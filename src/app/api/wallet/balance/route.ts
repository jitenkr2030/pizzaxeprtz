import { NextRequest, NextResponse } from 'next/server'

// Mock wallet data storage (in real implementation, this would be in a database)
const mockWallets: Record<string, { balance: number; currency: string; lastUpdated: string }> = {
  'user1': { balance: 1500, currency: 'INR', lastUpdated: new Date().toISOString() },
  'user2': { balance: 2500, currency: 'INR', lastUpdated: new Date().toISOString() },
  'demo_user': { balance: 1000, currency: 'INR', lastUpdated: new Date().toISOString() }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get wallet balance (mock implementation)
    const wallet = mockWallets[userId] || { 
      balance: 0, 
      currency: 'INR', 
      lastUpdated: new Date().toISOString() 
    }

    return NextResponse.json({
      success: true,
      balance: wallet
    })

  } catch (error) {
    console.error('Error fetching wallet balance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wallet balance' },
      { status: 500 }
    )
  }
}