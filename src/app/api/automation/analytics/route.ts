import { NextRequest, NextResponse } from 'next/server'
import { analyticsService } from '@/lib/analytics'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const reportType = searchParams.get('reportType') as 'daily' | 'weekly' | 'monthly' | undefined
    const action = searchParams.get('action')

    if (action === 'report' && reportType) {
      const report = await analyticsService.generateReport(storeId || undefined, reportType)
      return NextResponse.json({ report })
    }

    if (action === 'realtime') {
      const metrics = await analyticsService.getRealTimeMetrics(storeId || undefined)
      return NextResponse.json({ metrics })
    }

    const analytics = await analyticsService.getAutomationAnalytics(storeId || undefined)
    return NextResponse.json({ analytics })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}