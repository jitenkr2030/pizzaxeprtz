import { NextRequest, NextResponse } from 'next/server'

// Mock wallet data storage (in real implementation, this would be in a database)
let mockWallets: Record<string, { balance: number; currency: string; lastUpdated: string }> = {
  'user1': { balance: 1500, currency: 'INR', lastUpdated: new Date().toISOString() },
  'user2': { balance: 2500, currency: 'INR', lastUpdated: new Date().toISOString() },
  'demo_user': { balance: 1000, currency: 'INR', lastUpdated: new Date().toISOString() }
}

// Mock recharge sessions
let mockRechargeSessions: Record<string, { userId: string; amount: number; currency: string; createdAt: string; status: string }> = {}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, amount, currency } = body

    // Validate required fields
    if (!userId || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, amount, currency' },
        { status: 400 }
      )
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be a positive number.' },
        { status: 400 }
      )
    }

    // Create recharge session
    const sessionId = `recharge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    mockRechargeSessions[sessionId] = {
      userId,
      amount,
      currency,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }

    console.log(`Wallet recharge initiated: ${userId} wants to recharge ${amount} ${currency}`)

    return NextResponse.json({
      success: true,
      sessionId,
      amount,
      currency,
      message: 'Wallet recharge initiated. Please complete payment using QR code.',
      paymentUrl: `/wallet-recharge?sessionId=${sessionId}&amount=${amount}`
    })

  } catch (error) {
    console.error('Error initiating wallet recharge:', error)
    return NextResponse.json(
      { error: 'Failed to initiate wallet recharge' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const session = mockRechargeSessions[sessionId]

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      session
    })

  } catch (error) {
    console.error('Error fetching recharge session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recharge session' },
      { status: 500 }
    )
  }
}