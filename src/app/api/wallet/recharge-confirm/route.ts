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
    const { sessionId, transactionId, paymentProof } = body

    // Validate required fields
    if (!sessionId || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, transactionId' },
        { status: 400 }
      )
    }

    // Get recharge session
    const session = mockRechargeSessions[sessionId]

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 404 }
      )
    }

    if (session.status === 'completed') {
      return NextResponse.json(
        { error: 'Recharge session already completed' },
        { status: 400 }
      )
    }

    // Get user wallet
    const wallet = mockWallets[session.userId] || { balance: 0, currency: 'INR', lastUpdated: new Date().toISOString() }

    // Add recharge amount to wallet
    wallet.balance += session.amount
    wallet.lastUpdated = new Date().toISOString()
    mockWallets[session.userId] = wallet

    // Update session status
    session.status = 'completed'
    mockRechargeSessions[sessionId] = session

    console.log(`Wallet recharge completed: ${session.userId} recharged ${session.amount} ${session.currency}`)

    return NextResponse.json({
      success: true,
      transactionId,
      amount: session.amount,
      currency: session.currency,
      newBalance: wallet.balance,
      message: 'Wallet recharge completed successfully'
    })

  } catch (error) {
    console.error('Error confirming wallet recharge:', error)
    return NextResponse.json(
      { error: 'Failed to confirm wallet recharge' },
      { status: 500 }
    )
  }
}