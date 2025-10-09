import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

interface OrderAutomationConfig {
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

    if (action === 'delivery-status') {
      const deliveryStatus = await getDeliveryStatus(storeId)
      return NextResponse.json({ deliveryStatus })
    }

    if (action === 'order-analytics') {
      const analytics = await getOrderAnalytics(storeId)
      return NextResponse.json({ analytics })
    }

    if (action === 'kitchen-workload') {
      const workload = await getKitchenWorkload(storeId)
      return NextResponse.json({ workload })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching order automation data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const config: OrderAutomationConfig = await request.json()
    const { storeId, action, data } = config

    if (!storeId || !action) {
      return NextResponse.json({ error: 'Store ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'auto-assign-delivery':
        const assignmentResult = await autoAssignDelivery(storeId, data?.orderId)
        return NextResponse.json({ result: assignmentResult })

      case 'update-delivery-status':
        const statusUpdate = await updateDeliveryStatus(storeId, data)
        return NextResponse.json({ result: statusUpdate })

      case 'estimate-delivery-time':
        const timeEstimate = await estimateDeliveryTime(storeId, data)
        return NextResponse.json({ result: timeEstimate })

      case 'optimize-kitchen-queue':
        const optimization = await optimizeKitchenQueue(storeId)
        return NextResponse.json({ result: optimization })

      case 'auto-cancel-orders':
        const cancellationResult = await autoCancelStaleOrders(storeId)
        return NextResponse.json({ result: cancellationResult })

      case 'send-delivery-updates':
        const updateResult = await sendDeliveryUpdates(storeId)
        return NextResponse.json({ result: updateResult })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error executing order automation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper functions
async function getDeliveryStatus(storeId: string) {
  const orders = await db.order.findMany({
    where: {
      storeId,
      status: {
        in: ['ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY']
      }
    },
    include: {
      deliveryOrder: true,
      user: {
        select: {
          name: true,
          phone: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return {
    activeOrders: orders.length,
    ordersByStatus: {
      PENDING: orders.filter(o => o.status === 'PENDING').length,
      ACCEPTED: orders.filter(o => o.status === 'ACCEPTED').length,
      PREPARING: orders.filter(o => o.status === 'PREPARING').length,
      READY_FOR_PICKUP: orders.filter(o => o.status === 'READY_FOR_PICKUP').length,
      OUT_FOR_DELIVERY: orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length
    },
    orders: orders
  }
}

async function getOrderAnalytics(storeId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const [todayOrders, yesterdayOrders, weeklyOrders] = await Promise.all([
    db.order.findMany({
      where: {
        storeId,
        createdAt: {
          gte: today
        }
      }
    }),
    db.order.findMany({
      where: {
        storeId,
        createdAt: {
          gte: yesterday,
          lt: today
        }
      }
    }),
    db.order.findMany({
      where: {
        storeId,
        createdAt: {
          gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })
  ])

  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const weeklyRevenue = weeklyOrders.reduce((sum, order) => sum + order.totalAmount, 0)

  const avgOrderValueToday = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0
  const avgOrderValueWeekly = weeklyOrders.length > 0 ? weeklyRevenue / weeklyOrders.length : 0

  return {
    today: {
      orders: todayOrders.length,
      revenue: todayRevenue,
      avgOrderValue: avgOrderValueToday
    },
    yesterday: {
      orders: yesterdayOrders.length,
      revenue: yesterdayRevenue
    },
    weekly: {
      orders: weeklyOrders.length,
      revenue: weeklyRevenue,
      avgOrderValue: avgOrderValueWeekly
    },
    growth: {
      orders: yesterdayOrders.length > 0 ? 
        ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100 : 0,
      revenue: yesterdayRevenue > 0 ? 
        ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0
    }
  }
}

async function getKitchenWorkload(storeId: string) {
  const activeOrders = await db.order.findMany({
    where: {
      storeId,
      status: {
        in: ['ACCEPTED', 'PREPARING']
      }
    },
    include: {
      orderItems: {
        include: {
          menuItem: true
        }
      }
    }
  })

  const totalPrepTime = activeOrders.reduce((sum, order) => {
    const orderPrepTime = order.orderItems.reduce((itemSum, item) => {
      return itemSum + (item.menuItem.preparationTime * item.quantity)
    }, 0)
    return sum + orderPrepTime
  }, 0)

  const avgPrepTime = activeOrders.length > 0 ? totalPrepTime / activeOrders.length : 0

  return {
    activeOrders: activeOrders.length,
    totalPrepTime,
    avgPrepTime,
    estimatedCompletionTime: avgPrepTime > 0 ? new Date(Date.now() + avgPrepTime * 60000) : null,
    workloadLevel: activeOrders.length > 10 ? 'HIGH' : activeOrders.length > 5 ? 'MEDIUM' : 'LOW'
  }
}

async function autoAssignDelivery(storeId: string, orderId?: string) {
  const pendingOrders = orderId ? 
    await db.order.findMany({
      where: {
        storeId,
        id: orderId,
        status: 'READY_FOR_PICKUP'
      }
    }) :
    await db.order.findMany({
      where: {
        storeId,
        status: 'READY_FOR_PICKUP'
      }
    })

  const availablePartners = await db.user.findMany({
    where: {
      role: 'DELIVERY_PARTNER',
      isActive: true
    }
  })

  const assignments = []
  
  for (const order of pendingOrders) {
    if (availablePartners.length > 0) {
      // Simple round-robin assignment
      const partner = availablePartners[assignments.length % availablePartners.length]
      
      const deliveryOrder = await db.deliveryOrder.create({
        data: {
          orderId: order.id,
          deliveryPartnerId: partner.id,
          status: 'assigned',
          pickupTime: new Date(Date.now() + 15 * 60000) // 15 minutes from now
        }
      })

      await db.order.update({
        where: { id: order.id },
        data: { status: 'OUT_FOR_DELIVERY' }
      })

      assignments.push({
        orderId: order.id,
        deliveryPartnerId: partner.id,
        estimatedPickup: deliveryOrder.pickupTime
      })
    }
  }

  return { assigned: assignments.length, assignments }
}

async function updateDeliveryStatus(storeId: string, data: any) {
  const { orderId, status, notes } = data

  const deliveryOrder = await db.deliveryOrder.findFirst({
    where: {
      order: {
        storeId,
        id: orderId
      }
    }
  })

  if (!deliveryOrder) {
    throw new Error('Delivery order not found')
  }

  const updateData: any = { status }
  
  if (status === 'picked_up') {
    updateData.pickupTime = new Date()
  } else if (status === 'delivered') {
    updateData.deliveryTime = new Date()
  }

  if (notes) {
    updateData.notes = notes
  }

  const updatedDelivery = await db.deliveryOrder.update({
    where: { id: deliveryOrder.id },
    data: updateData
  })

  // Update order status if needed
  if (status === 'delivered') {
    await db.order.update({
      where: { id: orderId },
      data: { 
        status: 'DELIVERED',
        actualDelivery: new Date()
      }
    })
  }

  return updatedDelivery
}

async function estimateDeliveryTime(storeId: string, data: any) {
  const { addressId, orderItems } = data
  
  // Base preparation time
  const prepTime = orderItems?.reduce((sum: number, item: any) => {
    return sum + (item.preparationTime * item.quantity)
  }, 0) || 15

  // Distance-based delivery time (simplified)
  const deliveryTime = 20 // Base 20 minutes
  
  const totalEstimate = prepTime + deliveryTime
  
  return {
    preparationTime: prepTime,
    deliveryTime,
    totalEstimate,
    estimatedDelivery: new Date(Date.now() + totalEstimate * 60000)
  }
}

async function optimizeKitchenQueue(storeId: string) {
  const activeOrders = await db.order.findMany({
    where: {
      storeId,
      status: {
        in: ['ACCEPTED', 'PREPARING']
      }
    },
    include: {
      orderItems: {
        include: {
          menuItem: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  // Simple optimization: prioritize orders with shorter prep times
  const optimizedQueue = activeOrders.sort((a, b) => {
    const aPrepTime = a.orderItems.reduce((sum, item) => sum + item.menuItem.preparationTime * item.quantity, 0)
    const bPrepTime = b.orderItems.reduce((sum, item) => sum + item.menuItem.preparationTime * item.quantity, 0)
    return aPrepTime - bPrepTime
  })

  return {
    originalQueueLength: activeOrders.length,
    optimizedQueue: optimizedQueue.map((order, index) => ({
      orderId: order.id,
      position: index + 1,
      estimatedPrepTime: order.orderItems.reduce((sum, item) => sum + item.menuItem.preparationTime * item.quantity, 0)
    }))
  }
}

async function autoCancelStaleOrders(storeId: string) {
  const staleTime = new Date(Date.now() - 30 * 60000) // 30 minutes ago
  
  const staleOrders = await db.order.findMany({
    where: {
      storeId,
      status: 'PENDING',
      createdAt: {
        lt: staleTime
      }
    }
  })

  const cancelledOrders = []
  
  for (const order of staleOrders) {
    await db.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' }
    })
    cancelledOrders.push(order.id)
  }

  return { cancelled: cancelledOrders.length, orderIds: cancelledOrders }
}

async function sendDeliveryUpdates(storeId: string) {
  const activeDeliveries = await db.order.findMany({
    where: {
      storeId,
      status: 'OUT_FOR_DELIVERY'
    },
    include: {
      deliveryOrder: true,
      user: true
    }
  })

  const updates = []
  
  for (const order of activeDeliveries) {
    if (order.deliveryOrder) {
      // Simulate sending delivery update
      const update = {
        orderId: order.id,
        userId: order.userId,
        status: order.deliveryOrder.status,
        estimatedDelivery: order.deliveryOrder.deliveryTime || 
          new Date(Date.now() + 20 * 60000),
        message: `Your order is ${order.deliveryOrder.status.replace('_', ' ').toLowerCase()}`
      }
      updates.push(update)
    }
  }

  return { sent: updates.length, updates }
}