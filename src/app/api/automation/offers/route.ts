import { NextRequest, NextResponse } from 'next/server'
import { offerEngineService } from '@/lib/offer-engine'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 })
    }

    if (action === 'userOffers' && userId) {
      const userOffers = await offerEngineService.getUserOffers(userId)
      return NextResponse.json({ userOffers })
    }

    if (action === 'personalized' && userId) {
      const personalizedOffers = await offerEngineService.getPersonalizedOffers(userId, storeId)
      return NextResponse.json({ offers: personalizedOffers })
    }

    // Get all offer rules for the store
    const offers = await db.offerRule.findMany({
      where: {
        storeId,
        isActive: true
      },
      orderBy: {
        priority: 'desc'
      }
    })

    return NextResponse.json({ offers })
  } catch (error) {
    console.error('Error fetching offers:', error)
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

    if (action === 'createOffer') {
      const { name, description, type, conditions, actions, startTime, endTime, daysOfWeek, priority, maxUsage, storeId } = data
      const offer = await offerEngineService.createOfferRule({
        name,
        description,
        type,
        conditions,
        actions,
        startTime,
        endTime,
        daysOfWeek,
        priority,
        maxUsage,
        storeId
      })
      return NextResponse.json({ offer })
    }

    if (action === 'evaluate') {
      const { userId, storeId, items, subtotal } = data
      const evaluation = await offerEngineService.evaluateOffers({
        userId,
        storeId,
        items,
        subtotal
      })
      return NextResponse.json({ evaluation })
    }

    if (action === 'applyToUser') {
      const { userId, offerRuleId } = data
      await offerEngineService.applyOfferToUser(userId, offerRuleId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error processing offer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}