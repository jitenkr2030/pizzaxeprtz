import { db } from '@/lib/db'

export interface NotificationTemplate {
  id: string
  name: string
  title: string
  message: string
  type: 'PUSH' | 'SMS' | 'EMAIL' | 'IN_APP'
  isActive: boolean
  storeId: string
}

export interface ScheduledNotification {
  id: string
  templateId: string
  scheduleTime: string
  daysOfWeek: number[]
  sendImmediately: boolean
  status: 'SCHEDULED' | 'SENT' | 'FAILED' | 'CANCELLED'
  targetAudience: any
  maxSendCount?: number
  sentCount: number
  lastSentAt?: Date
  nextSendAt?: Date
  storeId: string
}

export interface NotificationLog {
  id: string
  scheduledNotificationId: string
  userId: string
  status: 'SCHEDULED' | 'SENT' | 'FAILED' | 'CANCELLED'
  sentAt?: Date
  errorMessage?: string
}

export interface TargetAudienceRule {
  userFrequency?: 'low' | 'medium' | 'high'
  minOrderValue?: number
  favoriteCategories?: string[]
  lastOrderDaysAgo?: number
  isNewUser?: boolean
  loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum'
}

class NotificationSchedulerService {
  async createNotificationTemplate(data: {
    name: string
    title: string
    message: string
    type: 'PUSH' | 'SMS' | 'EMAIL' | 'IN_APP'
    storeId: string
  }) {
    return await db.notificationTemplate.create({
      data
    })
  }

  async scheduleNotification(data: {
    templateId: string
    scheduleTime: string
    daysOfWeek: number[]
    sendImmediately?: boolean
    targetAudience: TargetAudienceRule
    maxSendCount?: number
    storeId: string
  }) {
    const notification = await db.scheduledNotification.create({
      data: {
        templateId: data.templateId,
        scheduleTime: data.scheduleTime,
        daysOfWeek: JSON.stringify(data.daysOfWeek),
        sendImmediately: data.sendImmediately || false,
        targetAudience: JSON.stringify(data.targetAudience),
        maxSendCount: data.maxSendCount,
        storeId: data.storeId
      },
      include: {
        template: true
      }
    })

    // Calculate next send time
    await this.updateNextSendTime(notification.id)

    return notification
  }

  async processScheduledNotifications() {
    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5)
    const currentDay = now.getDay()

    const notifications = await db.scheduledNotification.findMany({
      where: {
        status: 'SCHEDULED',
        nextSendAt: {
          lte: now
        }
      },
      include: {
        template: true
      }
    })

    const results = []
    for (const notification of notifications) {
      try {
        const result = await this.sendNotification(notification)
        results.push(result)
      } catch (error) {
        console.error('Failed to send notification:', error)
        await this.logNotificationAttempt(notification.id, null, 'FAILED', error.message)
      }
    }

    return results
  }

  private async sendNotification(notification: any) {
    const targetUsers = await this.getTargetUsers(notification)
    
    if (targetUsers.length === 0) {
      return { notificationId: notification.id, sentCount: 0, message: 'No target users found' }
    }

    const maxSendCount = notification.maxSendCount || targetUsers.length
    const usersToSend = targetUsers.slice(0, maxSendCount)

    let sentCount = 0
    for (const user of usersToSend) {
      try {
        await this.sendToUser(notification, user)
        await this.logNotificationAttempt(notification.id, user.id, 'SENT')
        sentCount++
      } catch (error) {
        console.error(`Failed to send notification to user ${user.id}:`, error)
        await this.logNotificationAttempt(notification.id, user.id, 'FAILED', error.message)
      }
    }

    // Update notification stats
    await db.scheduledNotification.update({
      where: { id: notification.id },
      data: {
        sentCount: {
          increment: sentCount
        },
        lastSentAt: new Date()
      }
    })

    // Calculate next send time
    await this.updateNextSendTime(notification.id)

    return { notificationId: notification.id, sentCount, totalTargeted: usersToSend.length }
  }

  private async getTargetUsers(notification: any) {
    const targetAudience = JSON.parse(notification.targetAudience) as TargetAudienceRule
    
    let users = await db.user.findMany({
      where: {
        isActive: true,
        role: 'CUSTOMER'
      },
      include: {
        userPreferences: true,
        orders: {
          where: {
            status: 'DELIVERED'
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    // Filter users based on target audience rules
    users = users.filter(user => {
      // Check user frequency
      if (targetAudience.userFrequency && user.userPreferences?.orderFrequency) {
        if (user.userPreferences.orderFrequency !== targetAudience.userFrequency) {
          return false
        }
      }

      // Check minimum order value
      if (targetAudience.minOrderValue && user.userPreferences?.avgOrderValue) {
        if (user.userPreferences.avgOrderValue < targetAudience.minOrderValue) {
          return false
        }
      }

      // Check new user
      if (targetAudience.isNewUser) {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        if (user.createdAt < thirtyDaysAgo) {
          return false
        }
      }

      // Check last order days ago
      if (targetAudience.lastOrderDaysAgo && user.orders.length > 0) {
        const lastOrder = user.orders[0]
        const daysSinceLastOrder = Math.floor((Date.now() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        if (daysSinceLastOrder > targetAudience.lastOrderDaysAgo) {
          return false
        }
      }

      return true
    })

    return users
  }

  private async sendToUser(notification: any, user: any) {
    const template = notification.template
    const personalizedMessage = this.personalizeMessage(template.message, user)

    switch (template.type) {
      case 'PUSH':
        await this.sendPushNotification(user, template.title, personalizedMessage)
        break
      case 'SMS':
        await this.sendSMS(user.phone, personalizedMessage)
        break
      case 'EMAIL':
        await this.sendEmail(user.email, template.title, personalizedMessage)
        break
      case 'IN_APP':
        await this.sendInAppNotification(user.id, template.title, personalizedMessage)
        break
    }
  }

  private personalizeMessage(message: string, user: any): string {
    return message
      .replace('{name}', user.name || 'Customer')
      .replace('{email}', user.email)
      .replace('{phone}', user.phone || '')
  }

  private async sendPushNotification(user: any, title: string, message: string) {
    // In a real implementation, this would integrate with a push notification service
    console.log(`Sending push notification to ${user.name}: ${title} - ${message}`)
  }

  private async sendSMS(phone: string, message: string) {
    // In a real implementation, this would integrate with an SMS service
    console.log(`Sending SMS to ${phone}: ${message}`)
  }

  private async sendEmail(email: string, subject: string, message: string) {
    // In a real implementation, this would integrate with an email service
    console.log(`Sending email to ${email}: ${subject} - ${message}`)
  }

  private async sendInAppNotification(userId: string, title: string, message: string) {
    // Store in-app notification in database
    console.log(`Sending in-app notification to user ${userId}: ${title} - ${message}`)
  }

  private async logNotificationAttempt(notificationId: string, userId: string | null, status: string, errorMessage?: string) {
    if (!userId) return

    await db.notificationLog.create({
      data: {
        scheduledNotificationId: notificationId,
        userId,
        status,
        sentAt: status === 'SENT' ? new Date() : undefined,
        errorMessage
      }
    })
  }

  private async updateNextSendTime(notificationId: string) {
    const notification = await db.scheduledNotification.findUnique({
      where: { id: notificationId }
    })

    if (!notification) return

    const now = new Date()
    const scheduleTime = notification.scheduleTime
    const daysOfWeek = JSON.parse(notification.daysOfWeek) as number[]

    // Find the next valid send time
    let nextDate = new Date(now)
    let attempts = 0
    const maxAttempts = 7 // Try up to 7 days ahead

    while (attempts < maxAttempts) {
      const currentDay = nextDate.getDay()
      
      if (daysOfWeek.includes(currentDay)) {
        const [hours, minutes] = scheduleTime.split(':').map(Number)
        nextDate.setHours(hours, minutes, 0, 0)
        
        if (nextDate > now) {
          break
        }
      }
      
      nextDate.setDate(nextDate.getDate() + 1)
      attempts++
    }

    await db.scheduledNotification.update({
      where: { id: notificationId },
      data: {
        nextSendAt: nextDate
      }
    })
  }

  async getNotificationTemplates(storeId: string) {
    return await db.notificationTemplate.findMany({
      where: { storeId, isActive: true },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getScheduledNotifications(storeId: string) {
    return await db.scheduledNotification.findMany({
      where: { storeId },
      include: {
        template: true
      },
      orderBy: { scheduleTime: 'asc' }
    })
  }

  async getNotificationStats(storeId: string) {
    const stats = await db.notificationLog.groupBy({
      by: ['status'],
      where: {
        scheduledNotification: {
          storeId
        }
      },
      _count: {
        status: true
      }
    })

    return stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status
      return acc
    }, {} as Record<string, number>)
  }

  async initializeDefaultNotifications(storeId: string) {
    const templates = [
      {
        name: 'Evening Snacks Offer',
        title: 'Evening Snacks Combo!',
        message: 'Evening Snacks Combo: Samosa + Tea ₹49. Order now and enjoy!',
        type: 'PUSH' as const
      },
      {
        name: 'Lunch Special',
        title: 'Lunch Time Special',
        message: 'Hey {name}, our lunch special is waiting for you! 20% off on all lunch combos.',
        type: 'SMS' as const
      },
      {
        name: 'Dinner Reminder',
        title: 'Dinner Time',
        message: 'Dinner is served! Order now and get a free drink on orders above ₹299.',
        type: 'EMAIL' as const
      }
    ]

    const createdTemplates = []
    for (const templateData of templates) {
      const template = await this.createNotificationTemplate({
        ...templateData,
        storeId
      })
      createdTemplates.push(template)
    }

    // Schedule default notifications
    const schedules = [
      {
        templateId: createdTemplates[0].id,
        scheduleTime: '15:00',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        targetAudience: { userFrequency: 'medium' },
        storeId
      },
      {
        templateId: createdTemplates[1].id,
        scheduleTime: '11:30',
        daysOfWeek: [1, 2, 3, 4, 5],
        targetAudience: { userFrequency: 'high' },
        storeId
      },
      {
        templateId: createdTemplates[2].id,
        scheduleTime: '19:00',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        targetAudience: { minOrderValue: 299 },
        storeId
      }
    ]

    for (const scheduleData of schedules) {
      await this.scheduleNotification(scheduleData)
    }

    return createdTemplates
  }
}

export const notificationSchedulerService = new NotificationSchedulerService()