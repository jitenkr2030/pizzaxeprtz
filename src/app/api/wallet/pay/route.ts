import { NextRequest, NextResponse } from 'next/server'

// Mock wallet data storage (in real implementation, this would be in a database)
let mockWallets: Record<string, { balance: number; currency: string; lastUpdated: string }> = {
  'user1': { balance: 1500, currency: 'INR', lastUpdated: new Date().toISOString() },
  'user2': { balance: 2500, currency: 'INR', lastUpdated: new Date().toISOString() },
  'demo_user': { balance: 1000, currency: 'INR', lastUpdated: new Date().toISOString() }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, amount, orderId, currency } = body

    // Validate required fields
    if (!userId || !amount || !orderId || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, amount, orderId, currency' },
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

    // Get user wallet
    const wallet = mockWallets[userId] || { balance: 0, currency: 'INR', lastUpdated: new Date().toISOString() }

    // Check if user has sufficient balance
    if (wallet.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient wallet balance' },
        { status: 400 }
      )
    }

    // Process payment (deduct amount from wallet)
    wallet.balance -= amount
    wallet.lastUpdated = new Date().toISOString()
    mockWallets[userId] = wallet

    // Generate transaction ID
    const transactionId = `wallet_txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log(`Wallet payment processed: ${userId} paid ${amount} ${currency} for order ${orderId}`)

    return NextResponse.json({
      success: true,
      transactionId,
      amount,
      currency,
      remainingBalance: wallet.balance,
      message: 'Wallet payment processed successfully'
    })

  } catch (error) {
    console.error('Error processing wallet payment:', error)
    return NextResponse.json(
      { error: 'Failed to process wallet payment' },
      { status: 500 }
    )
  }
}