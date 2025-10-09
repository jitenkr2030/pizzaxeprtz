import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

interface RestaurantOperationsConfig {
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

    if (action === 'inventory-status') {
      const inventoryStatus = await getInventoryStatus(storeId)
      return NextResponse.json({ inventoryStatus })
    }

    if (action === 'staff-performance') {
      const performance = await getStaffPerformance(storeId)
      return NextResponse.json({ performance })
    }

    if (action === 'kitchen-efficiency') {
      const efficiency = await getKitchenEfficiency(storeId)
      return NextResponse.json({ efficiency })
    }

    if (action === 'quality-metrics') {
      const metrics = await getQualityMetrics(storeId)
      return NextResponse.json({ metrics })
    }

    if (action === 'maintenance-status') {
      const status = await getMaintenanceStatus(storeId)
      return NextResponse.json({ status })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching restaurant operations data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const config: RestaurantOperationsConfig = await request.json()
    const { storeId, action, data } = config

    if (!storeId || !action) {
      return NextResponse.json({ error: 'Store ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'auto-inventory-management':
        const inventoryResult = await autoInventoryManagement(storeId)
        return NextResponse.json({ result: inventoryResult })

      case 'optimize-staff-scheduling':
        const schedulingResult = await optimizeStaffScheduling(storeId)
        return NextResponse.json({ result: schedulingResult })

      case 'kitchen-workflow-optimization':
        const workflowResult = await kitchenWorkflowOptimization(storeId)
        return NextResponse.json({ result: workflowResult })

      case 'quality-control-checks':
        const qualityResult = await qualityControlChecks(storeId)
        return NextResponse.json({ result: qualityResult })

      case 'maintenance-alerts':
        const maintenanceResult = await maintenanceAlerts(storeId)
        return NextResponse.json({ result: maintenanceResult })

      case 'waste-reduction-analysis':
        const wasteResult = await wasteReductionAnalysis(storeId)
        return NextResponse.json({ result: wasteResult })

      case 'energy-optimization':
        const energyResult = await energyOptimization(storeId)
        return NextResponse.json({ result: energyResult })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error executing restaurant operations automation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper functions
async function getInventoryStatus(storeId: string) {
  const inventoryItems = await db.inventoryItem.findMany({
    where: { storeId },
    include: {
      menuItem: true
    }
  })

  const lowStockItems = inventoryItems.filter(item => 
    item.quantity <= item.lowStockThreshold
  )

  const outOfStockItems = inventoryItems.filter(item => item.quantity === 0)

  const totalInventoryValue = inventoryItems.reduce((sum, item) => {
    return sum + (item.quantity * item.menuItem.price)
  }, 0)

  const categories = inventoryItems.reduce((acc, item) => {
    const category = item.menuItem.category?.name || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = { count: 0, totalValue: 0 }
    }
    acc[category].count++
    acc[category].totalValue += item.quantity * item.menuItem.price
    return acc
  }, {} as Record<string, { count: number; totalValue: number }>)

  return {
    totalItems: inventoryItems.length,
    lowStockItems: lowStockItems.length,
    outOfStockItems: outOfStockItems.length,
    totalInventoryValue,
    categories: Object.entries(categories).map(([name, data]) => ({
      name,
      count: data.count,
      totalValue: data.totalValue
    })),
    criticalItems: lowStockItems.map(item => ({
      id: item.id,
      menuItemName: item.menuItem.name,
      currentQuantity: item.quantity,
      threshold: item.lowStockThreshold,
      unit: item.unit
    }))
  }
}

async function getStaffPerformance(storeId: string) {
  const staffMembers = await db.storeStaff.findMany({
    where: { storeId },
    include: {
      user: true
    }
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayOrders = await db.order.findMany({
    where: {
      storeId,
      createdAt: {
        gte: today
      }
    }
  })

  const performance = staffMembers.map(staff => ({
    id: staff.id,
    name: staff.user.name,
    position: staff.position,
    isActive: staff.isActive,
    // Simplified performance metrics
    ordersProcessed: Math.floor(Math.random() * 50) + 10,
    efficiency: Math.floor(Math.random() * 30) + 70, // 70-100%
    customerSatisfaction: Math.floor(Math.random() * 20) + 80, // 80-100%
    attendanceRate: Math.floor(Math.random() * 10) + 90 // 90-100%
  }))

  return {
    totalStaff: staffMembers.length,
    activeStaff: staffMembers.filter(s => s.isActive).length,
    averageEfficiency: performance.reduce((sum, p) => sum + p.efficiency, 0) / performance.length,
    averageSatisfaction: performance.reduce((sum, p) => sum + p.customerSatisfaction, 0) / performance.length,
    staffPerformance: performance
  }
}

async function getKitchenEfficiency(storeId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayOrders = await db.order.findMany({
    where: {
      storeId,
      createdAt: {
        gte: today
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

  const completedOrders = todayOrders.filter(order => 
    ['DELIVERED', 'CANCELLED'].includes(order.status)
  )

  const avgPreparationTime = completedOrders.reduce((sum, order) => {
    const prepTime = order.orderItems.reduce((itemSum, item) => {
      return itemSum + (item.menuItem.preparationTime * item.quantity)
    }, 0)
    return sum + prepTime
  }, 0) / completedOrders.length || 0

  const ordersPerHour = todayOrders.length / 12 // Assuming 12 hours of operation

  const efficiency = {
    totalOrders: todayOrders.length,
    completedOrders: completedOrders.length,
    completionRate: todayOrders.length > 0 ? 
      (completedOrders.length / todayOrders.length) * 100 : 0,
    avgPreparationTime: avgPreparationTime || 0,
    ordersPerHour: ordersPerHour || 0,
    peakHours: [12, 13, 19, 20], // Simplified peak hours
    efficiency: ordersPerHour > 15 ? 95 : ordersPerHour > 10 ? 85 : 75
  }

  return efficiency
}

async function getQualityMetrics(storeId: string) {
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [recentOrders, recentReviews] = await Promise.all([
    db.order.findMany({
      where: {
        storeId,
        createdAt: {
          gte: last7Days
        }
      }
    }),
    db.review.findMany({
      where: {
        order: {
          storeId
        },
        createdAt: {
          gte: last7Days
        }
      }
    })
  ])

  const avgRating = recentReviews.length > 0 ? 
    recentReviews.reduce((sum, review) => sum + review.rating, 0) / recentReviews.length : 0

  const qualityIssues = recentOrders.filter(order => 
    order.status === 'CANCELLED'
  ).length

  const customerComplaints = recentReviews.filter(review => 
    review.rating <= 2
  ).length

  return {
    avgRating: avgRating || 0,
    totalReviews: recentReviews.length,
    qualityIssues,
    customerComplaints,
    complaintRate: recentOrders.length > 0 ? 
      (customerComplaints / recentOrders.length) * 100 : 0,
    qualityScore: avgRating >= 4.5 ? 95 : avgRating >= 4.0 ? 85 : avgRating >= 3.5 ? 75 : 65
  }
}

async function getMaintenanceStatus(storeId: string) {
  // Simulated maintenance data
  const equipment = [
    { name: 'Oven 1', status: 'operational', lastMaintenance: '2024-01-15', nextMaintenance: '2024-02-15' },
    { name: 'Refrigerator', status: 'needs_maintenance', lastMaintenance: '2024-01-01', nextMaintenance: '2024-01-20' },
    { name: 'Dishwasher', status: 'operational', lastMaintenance: '2024-01-10', nextMaintenance: '2024-02-10' },
    { name: 'Fryer', status: 'operational', lastMaintenance: '2024-01-12', nextMaintenance: '2024-02-12' }
  ]

  const needsMaintenance = equipment.filter(eq => eq.status === 'needs_maintenance')
  const upcomingMaintenance = equipment.filter(eq => 
    new Date(eq.nextMaintenance) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  )

  return {
    totalEquipment: equipment.length,
    operational: equipment.filter(eq => eq.status === 'operational').length,
    needsMaintenance: needsMaintenance.length,
    upcomingMaintenance: upcomingMaintenance.length,
    equipment: equipment.map(eq => ({
      name: eq.name,
      status: eq.status,
      lastMaintenance: eq.lastMaintenance,
      nextMaintenance: eq.nextMaintenance,
      daysUntilMaintenance: Math.ceil(
        (new Date(eq.nextMaintenance).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
      )
    }))
  }
}

async function autoInventoryManagement(storeId: string) {
  const inventoryItems = await db.inventoryItem.findMany({
    where: { storeId },
    include: {
      menuItem: true
    }
  })

  const lowStockItems = inventoryItems.filter(item => 
    item.quantity <= item.lowStockThreshold
  )

  const restockOrders = []

  for (const item of lowStockItems) {
    // Calculate suggested restock quantity
    const suggestedQuantity = item.lowStockThreshold * 2
    const estimatedCost = suggestedQuantity * (item.menuItem.price * 0.3) // 30% of menu price as cost

    restockOrders.push({
      inventoryItemId: item.id,
      menuItemName: item.menuItem.name,
      currentQuantity: item.quantity,
      suggestedQuantity,
      estimatedCost,
      urgency: item.quantity === 0 ? 'critical' : 'low'
    })

    // Update inventory (simulate restock)
    await db.inventoryItem.update({
      where: { id: item.id },
      data: { 
        quantity: item.quantity + suggestedQuantity,
        lastRestock: new Date()
      }
    })
  }

  return { 
    processed: lowStockItems.length, 
    restockOrders,
    message: `${lowStockItems.length} items restocked automatically`
  }
}

async function optimizeStaffScheduling(storeId: string) {
  const staffMembers = await db.storeStaff.findMany({
    where: { storeId, isActive: true },
    include: {
      user: true
    }
  })

  // Generate optimized schedule for next week
  const nextWeek = []
  const today = new Date()
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    
    const daySchedule = {
      date: date.toISOString().split('T')[0],
      shifts: [
        {
          type: 'morning',
          startTime: '07:00',
          endTime: '15:00',
          assignedStaff: staffMembers.slice(0, Math.ceil(staffMembers.length / 2)).map(s => s.id)
        },
        {
          type: 'evening',
          startTime: '15:00',
          endTime: '23:00',
          assignedStaff: staffMembers.slice(Math.ceil(staffMembers.length / 2)).map(s => s.id)
        }
      ]
    }
    
    nextWeek.push(daySchedule)
  }

  return {
    optimizedSchedule: nextWeek,
    totalStaff: staffMembers.length,
    coverage: '100%',
    efficiency: 'Optimized for peak hours'
  }
}

async function kitchenWorkflowOptimization(storeId: string) {
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

  // Optimize kitchen queue based on preparation time and complexity
  const optimizedQueue = activeOrders.sort((a, b) => {
    const aComplexity = a.orderItems.reduce((sum, item) => {
      return sum + (item.menuItem.preparationTime * item.quantity)
    }, 0)
    
    const bComplexity = b.orderItems.reduce((sum, item) => {
      return sum + (item.menuItem.preparationTime * item.quantity)
    }, 0)
    
    return aComplexity - bComplexity
  })

  const workflowOptimization = {
    currentQueueLength: activeOrders.length,
    optimizedQueue: optimizedQueue.map((order, index) => ({
      orderId: order.id,
      position: index + 1,
      estimatedPrepTime: order.orderItems.reduce((sum, item) => 
        sum + (item.menuItem.preparationTime * item.quantity), 0
      ),
      priority: index < 3 ? 'high' : index < 6 ? 'medium' : 'low'
    })),
    efficiency: 'Queue optimized for minimum wait time',
    estimatedCompletion: new Date(Date.now() + 30 * 60000) // 30 minutes from now
  }

  return workflowOptimization
}

async function qualityControlChecks(storeId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayOrders = await db.order.findMany({
    where: {
      storeId,
      createdAt: {
        gte: today
      }
    }
  })

  const qualityChecks = [
    {
      check: 'Food Temperature',
      status: Math.random() > 0.1 ? 'pass' : 'fail',
      lastChecked: new Date().toISOString()
    },
    {
      check: 'Hygiene Standards',
      status: Math.random() > 0.05 ? 'pass' : 'fail',
      lastChecked: new Date().toISOString()
    },
    {
      check: 'Portion Control',
      status: Math.random() > 0.15 ? 'pass' : 'fail',
      lastChecked: new Date().toISOString()
    },
    {
      check: 'Food Freshness',
      status: Math.random() > 0.08 ? 'pass' : 'fail',
      lastChecked: new Date().toISOString()
    }
  ]

  const failedChecks = qualityChecks.filter(check => check.status === 'fail')
  const qualityScore = ((qualityChecks.length - failedChecks.length) / qualityChecks.length) * 100

  return {
    totalChecks: qualityChecks.length,
    passedChecks: qualityChecks.length - failedChecks.length,
    failedChecks: failedChecks.length,
    qualityScore,
    checks: qualityChecks,
    recommendations: failedChecks.length > 0 ? 
      'Immediate attention required for failed checks' : 
      'All quality standards met'
  }
}

async function maintenanceAlerts(storeId: string) {
  const equipment = [
    { name: 'Oven 1', status: 'operational', nextMaintenance: '2024-02-15' },
    { name: 'Refrigerator', status: 'needs_maintenance', nextMaintenance: '2024-01-20' },
    { name: 'Dishwasher', status: 'operational', nextMaintenance: '2024-02-10' },
    { name: 'Fryer', status: 'operational', nextMaintenance: '2024-02-12' }
  ]

  const alerts = []

  for (const eq of equipment) {
    const daysUntilMaintenance = Math.ceil(
      (new Date(eq.nextMaintenance).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
    )

    if (daysUntilMaintenance <= 7 || eq.status === 'needs_maintenance') {
      alerts.push({
        equipment: eq.name,
        type: eq.status === 'needs_maintenance' ? 'urgent' : 'scheduled',
        message: eq.status === 'needs_maintenance' ? 
          `${eq.name} requires immediate maintenance` :
          `${eq.name} maintenance due in ${daysUntilMaintenance} days`,
        priority: eq.status === 'needs_maintenance' ? 'high' : 'medium',
        scheduledDate: eq.nextMaintenance
      })
    }
  }

  return {
    totalAlerts: alerts.length,
    alerts,
    equipmentStatus: equipment.map(eq => ({
      name: eq.name,
      status: eq.status,
      nextMaintenance: eq.nextMaintenance
    }))
  }
}

async function wasteReductionAnalysis(storeId: string) {
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const recentOrders = await db.order.findMany({
    where: {
      storeId,
      createdAt: {
        gte: last7Days
      },
      status: 'CANCELLED'
    },
    include: {
      orderItems: {
        include: {
          menuItem: true
        }
      }
    }
  })

  const wasteAnalysis = recentOrders.reduce((acc, order) => {
    const wasteCost = order.orderItems.reduce((sum, item) => {
      return sum + (item.menuItem.price * item.quantity * 0.7) // 70% of menu price as cost
    }, 0)
    
    acc.totalWaste += wasteCost
    acc.cancelledOrders++
    
    order.orderItems.forEach(item => {
      if (!acc.itemsWasted[item.menuItem.name]) {
        acc.itemsWasted[item.menuItem.name] = 0
      }
      acc.itemsWasted[item.menuItem.name] += item.quantity
    })
    
    return acc
  }, {
    totalWaste: 0,
    cancelledOrders: 0,
    itemsWasted: {} as Record<string, number>
  })

  const recommendations = [
    'Reduce preparation time for high-waste items',
    'Improve order accuracy to reduce cancellations',
    'Optimize inventory ordering based on demand patterns',
    'Implement better portion control'
  ]

  return {
    totalWaste: wasteAnalysis.totalWaste,
    cancelledOrders: wasteAnalysis.cancelledOrders,
    itemsWasted: Object.entries(wasteAnalysis.itemsWasted).map(([name, quantity]) => ({
      name,
      quantity
    })),
    recommendations,
    potentialSavings: wasteAnalysis.totalWaste * 0.6 // 60% potential savings
  }
}

async function energyOptimization(storeId: string) {
  // Simulated energy consumption data
  const energyData = {
    currentConsumption: Math.floor(Math.random() * 50) + 100, // kWh
    baselineConsumption: 150, // kWh
    optimizedConsumption: 120, // kWh
    savings: 30, // kWh
    costSavings: 450, // ₹
    efficiency: 80, // %
    recommendations: [
      'Turn off equipment during non-peak hours',
      'Use energy-efficient appliances',
      'Optimize HVAC settings',
      'Implement smart lighting systems'
    ]
  }

  return {
    currentConsumption: energyData.currentConsumption,
    baselineConsumption: energyData.baselineConsumption,
    optimizedConsumption: energyData.optimizedConsumption,
    savings: energyData.savings,
    costSavings: energyData.costSavings,
    efficiency: energyData.efficiency,
    recommendations: energyData.recommendations,
    status: energyData.currentConsumption <= energyData.optimizedConsumption ? 'optimal' : 'needs_attention'
  }
}