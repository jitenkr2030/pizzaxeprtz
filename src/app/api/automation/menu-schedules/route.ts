import { NextRequest, NextResponse } from 'next/server'
import { menuSchedulerService } from '@/lib/menu-scheduler'
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
    const current = searchParams.get('current') === 'true'

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 })
    }

    if (current) {
      const currentSchedule = await menuSchedulerService.getCurrentMenuSchedule(storeId)
      return NextResponse.json({ schedule: currentSchedule })
    }

    const schedules = await menuSchedulerService.getActiveSchedules(storeId)
    return NextResponse.json({ schedules })
  } catch (error) {
    console.error('Error fetching menu schedules:', error)
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
    const { name, description, type, startTime, endTime, daysOfWeek, storeId, menuItemIds } = body

    if (!name || !type || !startTime || !endTime || !daysOfWeek || !storeId || !menuItemIds) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const schedule = await menuSchedulerService.createMenuSchedule({
      name,
      description,
      type,
      startTime,
      endTime,
      daysOfWeek,
      storeId,
      menuItemIds
    })

    return NextResponse.json({ schedule })
  } catch (error) {
    console.error('Error creating menu schedule:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}