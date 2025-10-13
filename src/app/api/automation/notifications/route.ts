import { NextRequest, NextResponse } from 'next/server'
import { notificationSchedulerService } from '@/lib/notification-scheduler'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const type = searchParams.get('type') // 'templates' or 'scheduled'

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 })
    }

    if (type === 'templates') {
      const templates = await notificationSchedulerService.getNotificationTemplates(storeId)
      return NextResponse.json({ templates })
    }

    if (type === 'scheduled') {
      const notifications = await notificationSchedulerService.getScheduledNotifications(storeId)
      return NextResponse.json({ notifications })
    }

    if (type === 'stats') {
      const stats = await notificationSchedulerService.getNotificationStats(storeId)
      return NextResponse.json({ stats })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, ...data } = body

    if (action === 'createTemplate') {
      const { name, title, message, type, storeId } = data
      const template = await notificationSchedulerService.createNotificationTemplate({
        name,
        title,
        message,
        type,
        storeId
      })
      return NextResponse.json({ template })
    }

    if (action === 'scheduleNotification') {
      const { templateId, scheduleTime, daysOfWeek, targetAudience, maxSendCount, storeId } = data
      const notification = await notificationSchedulerService.scheduleNotification({
        templateId,
        scheduleTime,
        daysOfWeek,
        targetAudience,
        maxSendCount,
        storeId
      })
      return NextResponse.json({ notification })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}