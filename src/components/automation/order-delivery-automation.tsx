'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Truck, 
  Clock, 
  TrendingUp, 
  Users, 
  ChefHat,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  MapPin,
  Phone
} from 'lucide-react'

interface OrderDeliveryAutomationProps {
  storeId: string
  isAdmin?: boolean
}

interface DeliveryStatus {
  activeOrders: number
  ordersByStatus: Record<string, number>
  orders: Array<{
    id: string
    orderNumber: string
    status: string
    user: {
      name: string
      phone: string
    }
    deliveryOrder?: {
      status: string
      pickupTime?: string
      deliveryTime?: string
    }
  }>
}

interface OrderAnalytics {
  today: {
    orders: number
    revenue: number
    avgOrderValue: number
  }
  yesterday: {
    orders: number
    revenue: number
  }
  weekly: {
    orders: number
    revenue: number
    avgOrderValue: number
  }
  growth: {
    orders: number
    revenue: number
  }
}

interface KitchenWorkload {
  activeOrders: number
  totalPrepTime: number
  avgPrepTime: number
  estimatedCompletionTime?: string
  workloadLevel: 'LOW' | 'MEDIUM' | 'HIGH'
}

export function OrderDeliveryAutomation({ storeId, isAdmin = false }: OrderDeliveryAutomationProps) {
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | null>(null)
  const [orderAnalytics, setOrderAnalytics] = useState<OrderAnalytics | null>(null)
  const [kitchenWorkload, setKitchenWorkload] = useState<KitchenWorkload | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [storeId])

  const fetchData = async () => {
    try {
      const [deliveryRes, analyticsRes, workloadRes] = await Promise.all([
        fetch(`/api/automation/orders?storeId=${storeId}&action=delivery-status`),
        fetch(`/api/automation/orders?storeId=${storeId}&action=order-analytics`),
        fetch(`/api/automation/orders?storeId=${storeId}&action=kitchen-workload`)
      ])

      const [deliveryData, analyticsData, workloadData] = await Promise.all([
        deliveryRes.json(),
        analyticsRes.json(),
        workloadRes.json()
      ])

      setDeliveryStatus(deliveryData.deliveryStatus)
      setOrderAnalytics(analyticsData.analytics)
      setKitchenWorkload(workloadData.workload)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching order automation data:', error)
    }
  }

  const executeAutomation = async (action: string, data?: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/automation/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          action,
          data
        })
      })

      const result = await response.json()
      console.log(`${action} result:`, result.result)
      
      // Refresh data after automation
      await fetchData()
    } catch (error) {
      console.error(`Error executing ${action}:`, error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`
  const formatTime = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleTimeString()
  }

  const getWorkloadColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600 bg-green-100'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
      case 'HIGH': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-100 text-gray-800'
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800'
      case 'PREPARING': return 'bg-yellow-100 text-yellow-800'
      case 'READY_FOR_PICKUP': return 'bg-purple-100 text-purple-800'
      case 'OUT_FOR_DELIVERY': return 'bg-orange-100 text-orange-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Order & Delivery Automation</h2>
          <p className="text-gray-600 mt-1">
            Real-time order management and delivery optimization
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button 
            onClick={fetchData} 
            variant="outline" 
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold">{deliveryStatus?.activeOrders || 0}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(orderAnalytics?.today.revenue || 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kitchen Workload</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{kitchenWorkload?.activeOrders || 0}</p>
                  {kitchenWorkload && (
                    <Badge className={getWorkloadColor(kitchenWorkload.workloadLevel)}>
                      {kitchenWorkload.workloadLevel}
                    </Badge>
                  )}
                </div>
              </div>
              <ChefHat className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Prep Time</p>
                <p className="text-2xl font-bold">
                  {kitchenWorkload?.avgPrepTime || 0}m
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="live-orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live-orders">Live Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
          {isAdmin && <TabsTrigger value="automation">Automation</TabsTrigger>}
        </TabsList>

        <TabsContent value="live-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Live Order Status
              </CardTitle>
              <CardDescription>
                Real-time order tracking and delivery status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Status Overview */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {Object.entries(deliveryStatus?.ordersByStatus || {}).map(([status, count]) => (
                    <div key={status} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold">{count}</div>
                      <div className="text-xs text-gray-600">
                        {status.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active Orders List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {deliveryStatus?.orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium">#{order.orderNumber}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            {order.user.name}
                          </div>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="text-right">
                        {order.deliveryOrder && (
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              {order.deliveryOrder.status.replace('_', ' ')}
                            </div>
                            {order.deliveryOrder.pickupTime && (
                              <div className="text-xs">
                                Pickup: {formatTime(order.deliveryOrder.pickupTime)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {(!deliveryStatus?.orders || deliveryStatus.orders.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p>No active orders</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Orders</span>
                    <span className="font-bold">{orderAnalytics?.today.orders || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Revenue</span>
                    <span className="font-bold">
                      {formatCurrency(orderAnalytics?.today.revenue || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg. Order Value</span>
                    <span className="font-bold">
                      {formatCurrency(orderAnalytics?.today.avgOrderValue || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Orders Growth</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {orderAnalytics?.growth.orders.toFixed(1) || 0}%
                      </span>
                      {(orderAnalytics?.growth.orders || 0) > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Revenue Growth</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {orderAnalytics?.growth.revenue.toFixed(1) || 0}%
                      </span>
                      {(orderAnalytics?.growth.revenue || 0) > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Weekly Orders</span>
                    <span className="font-bold">{orderAnalytics?.weekly.orders || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Weekly Revenue</span>
                    <span className="font-bold">
                      {formatCurrency(orderAnalytics?.weekly.revenue || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kitchen" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Kitchen Workload
              </CardTitle>
              <CardDescription>
                Current kitchen status and preparation estimates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {kitchenWorkload?.activeOrders || 0}
                    </div>
                    <div className="text-sm text-gray-600">Active Orders</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {kitchenWorkload?.totalPrepTime || 0}m
                    </div>
                    <div className="text-sm text-gray-600">Total Prep Time</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {kitchenWorkload?.avgPrepTime || 0}m
                    </div>
                    <div className="text-sm text-gray-600">Avg. Prep Time</div>
                  </div>
                </div>

                {kitchenWorkload?.estimatedCompletionTime && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-800">
                      Est. Completion
                    </div>
                    <div className="text-blue-600">
                      {new Date(kitchenWorkload.estimatedCompletionTime).toLocaleTimeString()}
                    </div>
                  </div>
                )}

                {kitchenWorkload && (
                  <div className="text-center">
                    <Badge className={getWorkloadColor(kitchenWorkload.workloadLevel)}>
                      {kitchenWorkload.workloadLevel} WORKLOAD
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="automation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Automation Controls
                </CardTitle>
                <CardDescription>
                  Execute automated order and delivery tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => executeAutomation('auto-assign-delivery')}
                    disabled={loading}
                    className="h-20 flex-col"
                  >
                    <Truck className="h-6 w-6 mb-2" />
                    Auto-Assign Delivery
                  </Button>
                  
                  <Button 
                    onClick={() => executeAutomation('optimize-kitchen-queue')}
                    disabled={loading}
                    variant="outline"
                    className="h-20 flex-col"
                  >
                    <ChefHat className="h-6 w-6 mb-2" />
                    Optimize Kitchen Queue
                  </Button>
                  
                  <Button 
                    onClick={() => executeAutomation('auto-cancel-orders')}
                    disabled={loading}
                    variant="outline"
                    className="h-20 flex-col"
                  >
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    Cancel Stale Orders
                  </Button>
                  
                  <Button 
                    onClick={() => executeAutomation('send-delivery-updates')}
                    disabled={loading}
                    variant="outline"
                    className="h-20 flex-col"
                  >
                    <CheckCircle className="h-6 w-6 mb-2" />
                    Send Delivery Updates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}