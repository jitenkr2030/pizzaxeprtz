import { NextRequest, NextResponse } from 'next/server'
import { PaymentService, PaymentMethod, PaymentRequest } from '@/lib/payment'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, orderId, customerEmail, customerName, paymentProof, transactionId } = body

    // Validate required fields
    if (!amount || !orderId || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, orderId, customerEmail, customerName' },
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

    // Create payment method for merchant QR code
    const paymentMethod: PaymentMethod = {
      id: 'pm_merchant_qr_' + Date.now(),
      type: 'qr_code',
      name: 'Merchant QR Code Payment',
      lastFour: 'kotak'
    }

    const paymentRequest: PaymentRequest = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      paymentMethod,
      orderId,
      customerEmail,
      customerName
    }

    // Process payment (verification will be done separately)
    const paymentResult = await PaymentService.processPayment(paymentRequest)

    return NextResponse.json({
      success: true,
      paymentResult,
      merchantDetails: {
        name: 'JITENDER',
        upiId: '9871087168@kotak',
        upiNumber: '9871087168'
      },
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      qrCodeUrl: '/images/merchant-qr-code.png'
    })

  } catch (error) {
    console.error('Merchant QR code payment error:', error)
    return NextResponse.json(
      { error: 'Failed to process merchant QR code payment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Check payment status (mock implementation)
    const paymentStatus = await checkPaymentStatus(orderId)

    return NextResponse.json({
      success: true,
      orderId,
      paymentStatus
    })

  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}

// Mock function to check payment status
async function checkPaymentStatus(orderId: string) {
  // In a real implementation, this would check with the payment gateway
  // For now, we'll simulate different statuses
  
  // Simulate some randomness for demo purposes
  const random = Math.random()
  
  if (random < 0.7) {
    return {
      status: 'completed',
      message: 'Payment completed successfully',
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    }
  } else if (random < 0.9) {
    return {
      status: 'pending',
      message: 'Payment is being processed',
      timestamp: new Date().toISOString()
    }
  } else {
    return {
      status: 'failed',
      message: 'Payment failed or expired',
      timestamp: new Date().toISOString()
    }
  }
}