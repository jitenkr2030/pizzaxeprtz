import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

interface PaymentAutomationConfig {
  storeId: string
  action: string
  data?: any
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const action = searchParams.get('action')

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID required' }, { status: 400 })
    }

    if (action === 'payment-analytics') {
      const analytics = await getPaymentAnalytics(storeId)
      return NextResponse.json({ analytics })
    }

    if (action === 'revenue-forecast') {
      const forecast = await getRevenueForecast(storeId)
      return NextResponse.json({ forecast })
    }

    if (action === 'payment-methods-stats') {
      const stats = await getPaymentMethodsStats(storeId)
      return NextResponse.json({ stats })
    }

    if (action === 'billing-summary') {
      const summary = await getBillingSummary(storeId)
      return NextResponse.json({ summary })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching payment automation data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const config: PaymentAutomationConfig = await request.json()
    const { storeId, action, data } = config

    if (!storeId || !action) {
      return NextResponse.json({ error: 'Store ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'process-pending-payments':
        const processingResult = await processPendingPayments(storeId)
        return NextResponse.json({ result: processingResult })

      case 'auto-refund-failed':
        const refundResult = await autoRefundFailedPayments(storeId)
        return NextResponse.json({ result: refundResult })

      case 'generate-invoices':
        const invoiceResult = await generateInvoices(storeId)
        return NextResponse.json({ result: invoiceResult })

      case 'reconcile-payments':
        const reconciliationResult = await reconcilePayments(storeId)
        return NextResponse.json({ result: reconciliationResult })

      case 'send-billing-reminders':
        const reminderResult = await sendBillingReminders(storeId)
        return NextResponse.json({ result: reminderResult })

      case 'update-subscriptions':
        const subscriptionResult = await updateSubscriptions(storeId)
        return NextResponse.json({ result: subscriptionResult })

      case 'process-wallet-transactions':
        const walletResult = await processWalletTransactions(storeId)
        return NextResponse.json({ result: walletResult })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error executing payment automation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper functions
async function getPaymentAnalytics(storeId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)

  const [todayPayments, thisMonthPayments, lastMonthPayments] = await Promise.all([
    db.payment.findMany({
      where: {
        order: {
          storeId
        },
        createdAt: {
          gte: today
        }
      }
    }),
    db.payment.findMany({
      where: {
        order: {
          storeId
        },
        createdAt: {
          gte: thisMonth
        }
      }
    }),
    db.payment.findMany({
      where: {
        order: {
          storeId
        },
        createdAt: {
          gte: lastMonth,
          lt: thisMonth
        }
      }
    })
  ])

  const todayRevenue = todayPayments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0)
  
  const thisMonthRevenue = thisMonthPayments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0)
  
  const lastMonthRevenue = lastMonthPayments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0)

  const successRate = thisMonthPayments.length > 0 ? 
    (thisMonthPayments.filter(p => p.status === 'COMPLETED').length / thisMonthPayments.length) * 100 : 0

  return {
    today: {
      revenue: todayRevenue,
      transactions: todayPayments.length,
      successRate: todayPayments.length > 0 ? 
        (todayPayments.filter(p => p.status === 'COMPLETED').length / todayPayments.length) * 100 : 0
    },
    thisMonth: {
      revenue: thisMonthRevenue,
      transactions: thisMonthPayments.length,
      successRate,
      growth: lastMonthRevenue > 0 ? 
        ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0
    },
    lastMonth: {
      revenue: lastMonthRevenue,
      transactions: lastMonthPayments.length
    }
  }
}

async function getRevenueForecast(storeId: string) {
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  
  const recentPayments = await db.payment.findMany({
    where: {
      order: {
        storeId
      },
      status: 'COMPLETED',
      createdAt: {
        gte: last30Days
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  // Simple moving average forecast
  const dailyRevenue = recentPayments.reduce((acc, payment) => {
    const date = payment.createdAt.toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + payment.amount
    return acc
  }, {} as Record<string, number>)

  const revenues = Object.values(dailyRevenue)
  const avgDailyRevenue = revenues.length > 0 ? 
    revenues.reduce((sum, rev) => sum + rev, 0) / revenues.length : 0

  // Simple trend analysis
  const trend = revenues.length > 7 ? 
    (revenues.slice(-7).reduce((sum, rev) => sum + rev, 0) / 7) - 
    (revenues.slice(-14, -7).reduce((sum, rev) => sum + rev, 0) / 7) : 0

  const forecast = {
    next7Days: avgDailyRevenue * 7 * (1 + (trend > 0 ? 0.1 : -0.05)),
    next30Days: avgDailyRevenue * 30 * (1 + (trend > 0 ? 0.15 : -0.1)),
    avgDailyRevenue,
    trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable'
  }

  return forecast
}

async function getPaymentMethodsStats(storeId: string) {
  const payments = await db.payment.findMany({
    where: {
      order: {
        storeId
      },
      status: 'COMPLETED'
    }
  })

  const methodStats = payments.reduce((acc, payment) => {
    const method = payment.paymentMethod
    if (!acc[method]) {
      acc[method] = { count: 0, amount: 0 }
    }
    acc[method].count++
    acc[method].amount += payment.amount
    return acc
  }, {} as Record<string, { count: number; amount: number }>)

  const totalAmount = Object.values(methodStats).reduce((sum, stat) => sum + stat.amount, 0)
  const totalCount = payments.length

  return {
    methods: Object.entries(methodStats).map(([method, stats]) => ({
      method,
      count: stats.count,
      amount: stats.amount,
      percentage: totalCount > 0 ? (stats.count / totalCount) * 100 : 0,
      revenuePercentage: totalAmount > 0 ? (stats.amount / totalAmount) * 100 : 0
    })),
    totalTransactions: totalCount,
    totalRevenue: totalAmount
  }
}

async function getBillingSummary(storeId: string) {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  
  const [pendingPayments, failedPayments, subscriptions] = await Promise.all([
    db.payment.findMany({
      where: {
        order: {
          storeId
        },
        status: 'PENDING'
      }
    }),
    db.payment.findMany({
      where: {
        order: {
          storeId
        },
        status: 'FAILED'
      }
    }),
    db.subscription.findMany({
      where: {
        user: {
          role: 'CUSTOMER'
        },
        isActive: true
      },
      include: {
        user: true
      }
    })
  ])

  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0)
  const failedAmount = failedPayments.reduce((sum, p) => sum + p.amount, 0)
  const monthlySubscriptionRevenue = subscriptions
    .filter(s => s.startDate <= today && (!s.endDate || s.endDate >= today))
    .reduce((sum, s) => sum + s.price, 0)

  return {
    pending: {
      count: pendingPayments.length,
      amount: pendingAmount
    },
    failed: {
      count: failedPayments.length,
      amount: failedAmount
    },
    subscriptions: {
      activeCount: subscriptions.filter(s => s.isActive).length,
      monthlyRevenue: monthlySubscriptionRevenue
    }
  }
}

async function processPendingPayments(storeId: string) {
  const pendingPayments = await db.payment.findMany({
    where: {
      order: {
        storeId
      },
      status: 'PENDING'
    },
    include: {
      order: true
    }
  })

  const processed = []
  const failed = []

  for (const payment of pendingPayments) {
    try {
      // Simulate payment processing
      const isSuccess = Math.random() > 0.1 // 90% success rate
      
      if (isSuccess) {
        await db.payment.update({
          where: { id: payment.id },
          data: { 
            status: 'COMPLETED',
            transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          }
        })

        await db.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: 'COMPLETED' }
        })

        processed.push(payment.id)
      } else {
        await db.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' }
        })
        failed.push(payment.id)
      }
    } catch (error) {
      console.error('Error processing payment:', payment.id, error)
      failed.push(payment.id)
    }
  }

  return { processed: processed.length, failed: failed.length, total: pendingPayments.length }
}

async function autoRefundFailedPayments(storeId: string) {
  const failedPayments = await db.payment.findMany({
    where: {
      order: {
        storeId
      },
      status: 'FAILED'
    },
    include: {
      order: true
    }
  })

  const refunded = []

  for (const payment of failedPayments) {
    try {
      // Check if payment is eligible for refund (within 24 hours)
      const paymentAge = Date.now() - payment.createdAt.getTime()
      if (paymentAge <= 24 * 60 * 60 * 1000) { // 24 hours
        await db.payment.update({
          where: { id: payment.id },
          data: { 
            status: 'REFUNDED',
            transactionId: `${payment.transactionId}_refund`
          }
        })

        await db.order.update({
          where: { id: payment.orderId },
          data: { 
            status: 'REFUNDED',
            paymentStatus: 'REFUNDED'
          }
        })

        refunded.push(payment.id)
      }
    } catch (error) {
      console.error('Error refunding payment:', payment.id, error)
    }
  }

  return { refunded: refunded.length, total: failedPayments.length }
}

async function generateInvoices(storeId: string) {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  
  const completedOrders = await db.order.findMany({
    where: {
      storeId,
      status: 'DELIVERED',
      paymentStatus: 'COMPLETED',
      createdAt: {
        gte: startOfMonth
      }
    },
    include: {
      payments: true,
      user: true
    }
  })

  // Group by user for monthly invoicing
  const userOrders = completedOrders.reduce((acc, order) => {
    if (!order.userId) return acc
    if (!acc[order.userId]) {
      acc[order.userId] = { orders: [], user: order.user }
    }
    acc[order.userId].orders.push(order)
    return acc
  }, {} as Record<string, { orders: any[]; user: any }>)

  const invoices = []

  for (const [userId, data] of Object.entries(userOrders)) {
    const totalAmount = data.orders.reduce((sum, order) => sum + order.totalAmount, 0)
    
    // Generate invoice (simplified)
    const invoice = {
      userId,
      userName: data.user.name,
      userEmail: data.user.email,
      invoiceNumber: `INV_${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      period: `${startOfMonth.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`,
      totalAmount,
      orderCount: data.orders.length,
      generatedAt: new Date().toISOString()
    }
    
    invoices.push(invoice)
  }

  return { generated: invoices.length, invoices }
}

async function reconcilePayments(storeId: string) {
  const payments = await db.payment.findMany({
    where: {
      order: {
        storeId
      }
    },
    include: {
      order: true
    }
  })

  const reconciliations = []
  const discrepancies = []

  for (const payment of payments) {
    const orderTotal = payment.order.totalAmount
    const paymentAmount = payment.amount
    
    if (Math.abs(orderTotal - paymentAmount) > 0.01) { // Allow for small rounding differences
      discrepancies.push({
        paymentId: payment.id,
        orderId: payment.orderId,
        orderTotal,
        paymentAmount,
        difference: Math.abs(orderTotal - paymentAmount)
      })
    } else {
      reconciliations.push({
        paymentId: payment.id,
        orderId: payment.orderId,
        status: 'reconciled'
      })
    }
  }

  return { 
    reconciled: reconciliations.length, 
    discrepancies: discrepancies.length,
    total: payments.length,
    discrepancies 
  }
}

async function sendBillingReminders(storeId: string) {
  const pendingPayments = await db.payment.findMany({
    where: {
      order: {
        storeId
      },
      status: 'PENDING'
    },
    include: {
      order: true,
      user: true
    }
  })

  const reminders = []

  for (const payment of pendingPayments) {
    const paymentAge = Date.now() - payment.createdAt.getTime()
    
    // Send reminder if payment is pending for more than 1 hour
    if (paymentAge > 60 * 60 * 1000) {
      const reminder = {
        paymentId: payment.id,
        userId: payment.userId,
        userEmail: payment.user?.email,
        amount: payment.amount,
        orderNumber: payment.order.orderNumber,
        pendingSince: payment.createdAt,
        reminderSent: new Date().toISOString()
      }
      
      reminders.push(reminder)
    }
  }

  return { sent: reminders.length, reminders }
}

async function updateSubscriptions(storeId: string) {
  const today = new Date()
  
  const expiringSubscriptions = await db.subscription.findMany({
    where: {
      user: {
        role: 'CUSTOMER'
      },
      isActive: true,
      endDate: {
        lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) // Within next 7 days
      }
    }
  })

  const updated = []
  const expired = []

  for (const subscription of expiringSubscriptions) {
    if (subscription.endDate && subscription.endDate <= today) {
      // Expire subscription
      await db.subscription.update({
        where: { id: subscription.id },
        data: { isActive: false }
      })
      expired.push(subscription.id)
    } else {
      // Send renewal reminder (simplified)
      updated.push({
        subscriptionId: subscription.id,
        userId: subscription.userId,
        expiresAt: subscription.endDate,
        renewalReminderSent: new Date().toISOString()
      })
    }
  }

  return { 
    expired: expired.length, 
    renewalReminders: updated.length,
    total: expiringSubscriptions.length 
  }
}

async function processWalletTransactions(storeId: string) {
  const wallets = await db.wallet.findMany({
    where: {
      user: {
        role: 'CUSTOMER'
      }
    },
    include: {
      user: true
    }
  })

  const transactions = []

  for (const wallet of wallets) {
    // Process automatic wallet top-ups or balance adjustments
    if (wallet.balance < 100) { // Low balance threshold
      const topUpAmount = 500 - wallet.balance
      
      await db.wallet.update({
        where: { id: wallet.id },
        data: { 
          balance: wallet.balance + topUpAmount,
          updatedAt: new Date()
        }
      })

      transactions.push({
        walletId: wallet.id,
        userId: wallet.userId,
        type: 'auto_topup',
        amount: topUpAmount,
        previousBalance: wallet.balance,
        newBalance: wallet.balance + topUpAmount,
        processedAt: new Date().toISOString()
      })
    }
  }

  return { processed: transactions.length, transactions }
}