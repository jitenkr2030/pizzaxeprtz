import { NextRequest, NextResponse } from 'next/server'
import { automationService } from '@/lib/automation'
import { menuSchedulerService } from '@/lib/menu-scheduler'
import { notificationSchedulerService } from '@/lib/notification-scheduler'
import { offerEngineService } from '@/lib/offer-engine'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'stats') {
      const stats = await automationService.getAutomationStats()
      return NextResponse.json({ stats })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching system data:', error)
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

    if (action === 'executeTask') {
      const { taskType, config } = data
      const result = await automationService.executeTaskManually(taskType, config)
      return NextResponse.json({ result })
    }

    if (action === 'initializeStore') {
      const { storeId } = data
      const results = await Promise.all([
        menuSchedulerService.initializeDefaultSchedules(storeId),
        notificationSchedulerService.initializeDefaultNotifications(storeId),
        offerEngineService.initializeDefaultOffers(storeId)
      ])
      return NextResponse.json({ 
        success: true, 
        results: {
          menuSchedules: results[0],
          notifications: results[1],
          offers: results[2]
        }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error executing system action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}