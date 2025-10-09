import { NextRequest, NextResponse } from 'next/server'
import { personalizationService } from '@/lib/personalization'
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
    const userId = searchParams.get('userId')
    const storeId = searchParams.get('storeId')
    const action = searchParams.get('action')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (action === 'recommendations' && storeId) {
      const recommendations = await personalizationService.getPersonalizedRecommendations(userId, storeId)
      return NextResponse.json({ recommendations })
    }

    if (action === 'analyze') {
      const preferences = await personalizationService.analyzeUserBehavior(userId)
      return NextResponse.json({ preferences })
    }

    // Get user preferences
    const preferences = await db.userPreference.findUnique({
      where: { userId }
    })

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error('Error fetching personalization data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, ...data } = body

    if (action === 'updatePreferences') {
      const { userId, preferences } = data
      const updatedPreferences = await personalizationService.updateUserPreferences(userId, preferences)
      return NextResponse.json({ preferences: updatedPreferences })
    }

    if (action === 'updateFromOrder') {
      const { userId, orderId } = data
      await personalizationService.updateUserPreferencesFromOrder(userId, orderId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating personalization:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}