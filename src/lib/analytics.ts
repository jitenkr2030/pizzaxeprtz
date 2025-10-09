import { db } from '@/lib/db'

export interface AutomationAnalytics {
  menuScheduleStats: MenuScheduleStats
  notificationStats: NotificationStats
  offerStats: OfferStats
  userEngagementStats: UserEngagementStats
  systemPerformanceStats: SystemPerformanceStats
}

export interface MenuScheduleStats {
  totalSchedules: number
  activeSchedules: number
  scheduleByType: Record<string, number>
  averageItemsPerSchedule: number
  mostPopularSchedule: string
  scheduleComplianceRate: number
}

export interface NotificationStats {
  totalTemplates: number
  activeTemplates: number
  totalSent: number
  totalFailed: number
  deliveryRate: number
  averageResponseTime: number
  notificationByType: Record<string, number>
  bestPerformingTemplate: string
  scheduledNotifications: number
}

export interface OfferStats {
  totalOffers: number
  activeOffers: number
  totalRedemptions: number
  averageDiscountValue: number
  offerByType: Record<string, number>
  conversionRate: number
  mostPopularOffer: string
  revenueImpact: number
}

export interface UserEngagementStats {
  totalUsers: number
  activeUsers: number
  averageOrderFrequency: number
  averageOrderValue: number
  personalizationAccuracy: number
  userSatisfactionScore: number
  retentionRate: number
}

export interface SystemPerformanceStats {
  totalTasksExecuted: number
  successRate: number
  averageExecutionTime: number
  errorRate: number
  uptime: number
  lastMaintenance: Date
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor'
}

class AnalyticsService {
  async getAutomationAnalytics(storeId?: string): Promise<AutomationAnalytics> {
    const [
      menuScheduleStats,
      notificationStats,
      offerStats,
      userEngagementStats,
      systemPerformanceStats
    ] = await Promise.all([
      this.getMenuScheduleStats(storeId),
      this.getNotificationStats(storeId),
      this.getOfferStats(storeId),
      this.getUserEngagementStats(storeId),
      this.getSystemPerformanceStats()
    ])

    return {
      menuScheduleStats,
      notificationStats,
      offerStats,
      userEngagementStats,
      systemPerformanceStats
    }
  }

  private async getMenuScheduleStats(storeId?: string): Promise<MenuScheduleStats> {
    const whereClause = storeId ? { storeId } : {}
    
    const schedules = await db.menuSchedule.findMany({
      where: whereClause,
      include: {
        menuItems: true
      }
    })

    const activeSchedules = schedules.filter(s => s.isActive)
    const scheduleByType = schedules.reduce((acc, schedule) => {
      acc[schedule.type] = (acc[schedule.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const totalItems = schedules.reduce((sum, schedule) => sum + schedule.menuItems.length, 0)
    const averageItemsPerSchedule = schedules.length > 0 ? totalItems / schedules.length : 0

    // Find most popular schedule (most menu items)
    const mostPopularSchedule = schedules.reduce((popular, schedule) => 
      schedule.menuItems.length > popular.menuItems.length ? schedule : popular, schedules[0])

    // Calculate schedule compliance rate (schedules with items vs total schedules)
    const schedulesWithItems = schedules.filter(s => s.menuItems.length > 0).length
    const scheduleComplianceRate = schedules.length > 0 ? (schedulesWithItems / schedules.length) * 100 : 0

    return {
      totalSchedules: schedules.length,
      activeSchedules: activeSchedules.length,
      scheduleByType,
      averageItemsPerSchedule,
      mostPopularSchedule: mostPopularSchedule?.name || 'None',
      scheduleComplianceRate
    }
  }

  private async getNotificationStats(storeId?: string): Promise<NotificationStats> {
    const whereClause = storeId ? { storeId } : {}
    
    const templates = await db.notificationTemplate.findMany({
      where: whereClause
    })

    const activeTemplates = templates.filter(t => t.isActive)
    const notificationByType = templates.reduce((acc, template) => {
      acc[template.type] = (acc[template.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Get notification logs
    const logsWhere = storeId 
      ? { scheduledNotification: { storeId } }
      : {}
    
    const logs = await db.notificationLog.findMany({
      where: logsWhere
    })

    const totalSent = logs.filter(log => log.status === 'SENT').length
    const totalFailed = logs.filter(log => log.status === 'FAILED').length
    const deliveryRate = logs.length > 0 ? (totalSent / logs.length) * 100 : 0

    // Calculate average response time (time from scheduled to sent)
    const sentLogs = logs.filter(log => log.status === 'SENT' && log.sentAt)
    const responseTimes = sentLogs.map(log => {
      const scheduled = new Date(log.createdAt)
      const sent = new Date(log.sentAt!)
      return sent.getTime() - scheduled.getTime()
    })
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0

    // Find best performing template (highest delivery rate)
    const templatePerformance = await Promise.all(
      templates.map(async (template) => {
        const templateLogs = await db.notificationLog.findMany({
          where: {
            scheduledNotification: {
              templateId: template.id,
              ...(storeId && { storeId })
            }
          }
        })
        const sent = templateLogs.filter(log => log.status === 'SENT').length
        const total = templateLogs.length
        return {
          template,
          deliveryRate: total > 0 ? (sent / total) * 100 : 0
        }
      })
    )

    const bestPerformingTemplate = templatePerformance.reduce((best, current) => 
      current.deliveryRate > best.deliveryRate ? current : best, templatePerformance[0])

    // Get scheduled notifications count
    const scheduledNotifications = await db.scheduledNotification.count({
      where: {
        status: 'SCHEDULED',
        ...(storeId && { storeId })
      }
    })

    return {
      totalTemplates: templates.length,
      activeTemplates: activeTemplates.length,
      totalSent,
      totalFailed,
      deliveryRate,
      averageResponseTime,
      notificationByType,
      bestPerformingTemplate: bestPerformingTemplate?.template?.name || 'None',
      scheduledNotifications
    }
  }

  private async getOfferStats(storeId?: string): Promise<OfferStats> {
    const whereClause = storeId ? { storeId } : {}
    
    const offers = await db.offerRule.findMany({
      where: whereClause
    })

    const activeOffers = offers.filter(o => o.isActive)
    const offerByType = offers.reduce((acc, offer) => {
      acc[offer.type] = (acc[offer.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const totalRedemptions = offers.reduce((sum, offer) => sum + offer.usageCount, 0)
    const averageDiscountValue = offers.length > 0 
      ? offers.reduce((sum, offer) => {
          const actions = JSON.parse(offer.actions)
          const discount = actions.reduce((actionSum: number, action: any) => {
            if (action.type === 'PERCENTAGE_DISCOUNT') {
              return actionSum + action.value
            } else if (action.type === 'FIXED_AMOUNT_DISCOUNT') {
              return actionSum + action.value
            }
            return actionSum
          }, 0)
          return sum + discount
        }, 0) / offers.length
      : 0

    // Calculate conversion rate (offers used vs available)
    const totalAvailable = offers.reduce((sum, offer) => sum + (offer.maxUsage || 0), 0)
    const conversionRate = totalAvailable > 0 ? (totalRedemptions / totalAvailable) * 100 : 0

    // Find most popular offer (highest usage)
    const mostPopularOffer = offers.reduce((popular, offer) => 
      offer.usageCount > popular.usageCount ? offer : popular, offers[0])

    // Calculate revenue impact (estimated)
    const revenueImpact = totalRedemptions * averageDiscountValue

    return {
      totalOffers: offers.length,
      activeOffers: activeOffers.length,
      totalRedemptions,
      averageDiscountValue,
      offerByType,
      conversionRate,
      mostPopularOffer: mostPopularOffer?.name || 'None',
      revenueImpact
    }
  }

  private async getUserEngagementStats(storeId?: string): Promise<UserEngagementStats> {
    const userWhere = storeId 
      ? { orders: { some: { storeId } } }
      : {}

    const users = await db.user.findMany({
      where: userWhere,
      include: {
        orders: {
          where: { status: 'DELIVERED' },
          include: {
            orderItems: true
          }
        },
        userPreferences: true
      }
    })

    const activeUsers = users.filter(user => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return user.orders.some(order => order.createdAt > thirtyDaysAgo)
    })

    // Calculate average order frequency
    const userOrderFrequencies = users.map(user => {
      if (user.orders.length === 0) return 0
      const firstOrder = user.orders[user.orders.length - 1]
      const daysSinceFirstOrder = Math.floor(
        (Date.now() - firstOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      return daysSinceFirstOrder > 0 ? user.orders.length / daysSinceFirstOrder * 30 : 0
    })
    const averageOrderFrequency = userOrderFrequencies.length > 0 
      ? userOrderFrequencies.reduce((sum, freq) => sum + freq, 0) / userOrderFrequencies.length 
      : 0

    // Calculate average order value
    const userOrderValues = users.map(user => {
      if (user.orders.length === 0) return 0
      const totalSpent = user.orders.reduce((sum, order) => sum + order.totalAmount, 0)
      return totalSpent / user.orders.length
    })
    const averageOrderValue = userOrderValues.length > 0 
      ? userOrderValues.reduce((sum, value) => sum + value, 0) / userOrderValues.length 
      : 0

    // Calculate personalization accuracy (simplified)
    const usersWithPreferences = users.filter(user => user.userPreferences).length
    const personalizationAccuracy = users.length > 0 ? (usersWithPreferences / users.length) * 100 : 0

    // Calculate user satisfaction score (based on reviews)
    const reviews = await db.review.findMany({
      where: storeId ? { order: { storeId } } : {}
    })
    const userSatisfactionScore = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0

    // Calculate retention rate (users with multiple orders)
    const returningUsers = users.filter(user => user.orders.length > 1).length
    const retentionRate = users.length > 0 ? (returningUsers / users.length) * 100 : 0

    return {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      averageOrderFrequency,
      averageOrderValue,
      personalizationAccuracy,
      userSatisfactionScore,
      retentionRate
    }
  }

  private async getSystemPerformanceStats(): Promise<SystemPerformanceStats> {
    const logs = await db.automationLog.findMany({
      where: {
        executedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    })

    const totalTasksExecuted = logs.length
    const successfulTasks = logs.filter(log => log.status === 'success').length
    const failedTasks = logs.filter(log => log.status === 'failed').length
    const successRate = totalTasksExecuted > 0 ? (successfulTasks / totalTasksExecuted) * 100 : 0
    const errorRate = totalTasksExecuted > 0 ? (failedTasks / totalTasksExecuted) * 100 : 0

    // Calculate average execution time
    const executionTimes = logs
      .filter(log => log.status === 'success')
      .map(log => {
        const details = JSON.parse(log.details || '{}')
        return details.duration || 0
      })
    const averageExecutionTime = executionTimes.length > 0 
      ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length 
      : 0

    // Calculate uptime (simplified - based on successful task execution)
    const uptime = successRate

    // Get last maintenance time
    const lastMaintenance = new Date() // This would be tracked in a real system

    // Determine system health
    let systemHealth: SystemPerformanceStats['systemHealth'] = 'excellent'
    if (successRate < 95) systemHealth = 'good'
    if (successRate < 90) systemHealth = 'fair'
    if (successRate < 80) systemHealth = 'poor'

    return {
      totalTasksExecuted,
      successRate,
      averageExecutionTime,
      errorRate,
      uptime,
      lastMaintenance,
      systemHealth
    }
  }

  async generateReport(storeId?: string, reportType: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<string> {
    const analytics = await this.getAutomationAnalytics(storeId)
    
    const reportDate = new Date().toLocaleDateString()
    const report = `
# Automation Analytics Report - ${reportType.toUpperCase()}
Generated on: ${reportDate}

## Executive Summary
- System Health: ${analytics.systemPerformanceStats.systemHealth.toUpperCase()}
- Total Active Users: ${analytics.userEngagementStats.activeUsers}
- Overall Success Rate: ${analytics.systemPerformanceStats.successRate.toFixed(1)}%

## Menu Schedule Performance
- Total Schedules: ${analytics.menuScheduleStats.totalSchedules}
- Active Schedules: ${analytics.menuScheduleStats.activeSchedules}
- Average Items per Schedule: ${analytics.menuScheduleStats.averageItemsPerSchedule.toFixed(1)}
- Schedule Compliance Rate: ${analytics.menuScheduleStats.scheduleComplianceRate.toFixed(1)}%

## Notification Performance
- Total Templates: ${analytics.notificationStats.totalTemplates}
- Active Templates: ${analytics.notificationStats.activeTemplates}
- Total Sent: ${analytics.notificationStats.totalSent}
- Delivery Rate: ${analytics.notificationStats.deliveryRate.toFixed(1)}%
- Average Response Time: ${(analytics.notificationStats.averageResponseTime / 1000).toFixed(1)}s

## Offer Performance
- Total Offers: ${analytics.offerStats.totalOffers}
- Active Offers: ${analytics.offerStats.activeOffers}
- Total Redemptions: ${analytics.offerStats.totalRedemptions}
- Conversion Rate: ${analytics.offerStats.conversionRate.toFixed(1)}%
- Revenue Impact: ₹${analytics.offerStats.revenueImpact.toFixed(2)}

## User Engagement
- Total Users: ${analytics.userEngagementStats.totalUsers}
- Active Users: ${analytics.userEngagementStats.activeUsers}
- Average Order Frequency: ${analytics.userEngagementStats.averageOrderFrequency.toFixed(1)} per month
- Average Order Value: ₹${analytics.userEngagementStats.averageOrderValue.toFixed(2)}
- Personalization Accuracy: ${analytics.userEngagementStats.personalizationAccuracy.toFixed(1)}%
- User Satisfaction: ${analytics.userEngagementStats.userSatisfactionScore.toFixed(1)}/5
- Retention Rate: ${analytics.userEngagementStats.retentionRate.toFixed(1)}%

## System Performance
- Tasks Executed (24h): ${analytics.systemPerformanceStats.totalTasksExecuted}
- Success Rate: ${analytics.systemPerformanceStats.successRate.toFixed(1)}%
- Average Execution Time: ${analytics.systemPerformanceStats.averageExecutionTime.toFixed(0)}ms
- Error Rate: ${analytics.systemPerformanceStats.errorRate.toFixed(1)}%
- System Uptime: ${analytics.systemPerformanceStats.uptime.toFixed(1)}%

## Recommendations
${this.generateRecommendations(analytics)}
`

    return report
  }

  private generateRecommendations(analytics: AutomationAnalytics): string {
    const recommendations: string[] = []

    // Menu schedule recommendations
    if (analytics.menuScheduleStats.scheduleComplianceRate < 80) {
      recommendations.push("- Consider adding more menu items to your schedules to improve compliance rate")
    }

    // Notification recommendations
    if (analytics.notificationStats.deliveryRate < 90) {
      recommendations.push("- Review notification templates and delivery settings to improve delivery rates")
    }

    // Offer recommendations
    if (analytics.offerStats.conversionRate < 50) {
      recommendations.push("- Optimize offer conditions and targeting to improve conversion rates")
    }

    // User engagement recommendations
    if (analytics.userEngagementStats.retentionRate < 30) {
      recommendations.push("- Implement loyalty programs and personalized offers to improve user retention")
    }

    // System performance recommendations
    if (analytics.systemPerformanceStats.successRate < 95) {
      recommendations.push("- Monitor system errors and improve error handling for better reliability")
    }

    if (recommendations.length === 0) {
      recommendations.push("- System is performing well. Continue current strategies and monitor for optimization opportunities.")
    }

    return recommendations.join('\n')
  }

  async getRealTimeMetrics(storeId?: string): Promise<any> {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    const recentLogs = await db.automationLog.findMany({
      where: {
        executedAt: {
          gte: oneHourAgo
        },
        ...(storeId && { details: { contains: storeId } })
      }
    })

    const recentNotifications = await db.notificationLog.findMany({
      where: {
        createdAt: {
          gte: oneHourAgo
        },
        ...(storeId && { scheduledNotification: { storeId } })
      }
    })

    return {
      tasksLastHour: recentLogs.length,
      successfulTasksLastHour: recentLogs.filter(log => log.status === 'success').length,
      notificationsLastHour: recentNotifications.length,
      successfulNotificationsLastHour: recentNotifications.filter(log => log.status === 'SENT').length,
      averageResponseTimeLastHour: recentNotifications
        .filter(log => log.status === 'SENT' && log.sentAt)
        .reduce((sum, log) => {
          const scheduled = new Date(log.createdAt)
          const sent = new Date(log.sentAt!)
          return sum + (sent.getTime() - scheduled.getTime())
        }, 0) / recentNotifications.filter(log => log.status === 'SENT' && log.sentAt).length || 0
    }
  }
}

export const analyticsService = new AnalyticsService()