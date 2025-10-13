"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ChefHat, MapPin, Clock, CheckCircle, XCircle, Navigation, Phone, Star, Package } from "lucide-react"

interface DeliveryOrder {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  restaurantAddress: string
  items: string[]
  status: 'pending' | 'picked-up' | 'in-transit' | 'delivered' | 'cancelled'
  orderTime: string
  estimatedDeliveryTime: string
  actualDeliveryTime?: string
  distance: number
  paymentStatus: 'paid' | 'cod'
  orderTotal: number
  deliveryFee: number
  earnings: number
  specialInstructions?: string
}

const sampleDeliveryOrders: DeliveryOrder[] = [
  {
    id: "1",
    orderNumber: "#1001",
    customerName: "John Smith",
    customerPhone: "+1 (555) 123-4567",
    deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
    restaurantAddress: "456 Pizza Ave, New York, NY 10002",
    items: ["2x Margherita Classic", "1x Garlic Bread"],
    status: "pending",
    orderTime: "2024-01-20T18:30:00",
    estimatedDeliveryTime: "2024-01-20T19:15:00",
    distance: 3.2,
    paymentStatus: "paid",
    orderTotal: 32.97,
    deliveryFee: 3.99,
    earnings: 3.99,
    specialInstructions: "Please call upon arrival"
  },
  {
    id: "2",
    orderNumber: "#1003",
    customerName: "Mike Davis",
    customerPhone: "+1 (555) 987-6543",
    deliveryAddress: "789 Oak Street, Brooklyn, NY 11201",
    restaurantAddress: "456 Pizza Ave, New York, NY 10002",
    items: ["1x Veggie Supreme", "1x Caesar Salad"],
    status: "picked-up",
    orderTime: "2024-01-20T18:15:00",
    estimatedDeliveryTime: "2024-01-20T19:00:00",
    distance: 5.1,
    paymentStatus: "cod",
    orderTotal: 23.98,
    deliveryFee: 4.99,
    earnings: 4.99
  },
  {
    id: "3",
    orderNumber: "#1005",
    customerName: "Lisa Chen",
    customerPhone: "+1 (555) 456-7890",
    deliveryAddress: "321 Elm Street, Queens, NY 11101",
    restaurantAddress: "456 Pizza Ave, New York, NY 10002",
    items: ["1x BBQ Chicken", "2x Coca Cola"],
    status: "in-transit",
    orderTime: "2024-01-20T17:45:00",
    estimatedDeliveryTime: "2024-01-20T18:30:00",
    distance: 4.8,
    paymentStatus: "paid",
    orderTotal: 21.98,
    deliveryFee: 4.49,
    earnings: 4.49
  }
]

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState<DeliveryOrder[]>(sampleDeliveryOrders)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeOrder, setActiveOrder] = useState<DeliveryOrder | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: DeliveryOrder['status']) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { 
          ...order, 
          status: newStatus,
          actualDeliveryTime: newStatus === 'delivered' ? new Date().toISOString() : order.actualDeliveryTime
        }
        if (newStatus === 'delivered') {
          setActiveOrder(null)
        }
        return updatedOrder
      }
      return order
    }))
  }

  const acceptOrder = (order: DeliveryOrder) => {
    setActiveOrder(order)
    updateOrderStatus(order.id, 'picked-up')
  }

  const getOrdersByStatus = (status: DeliveryOrder['status']) => {
    return orders.filter(order => order.status === status)
  }

  const getStatusColor = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'picked-up': return 'bg-blue-100 text-blue-800'
      case 'in-transit': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTimeRemaining = (estimatedTime: string) => {
    const estimated = new Date(estimatedTime)
    const now = currentTime
    const diff = estimated.getTime() - now.getTime()
    
    if (diff <= 0) return 'Overdue'
    
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return '< 1 min'
    return `${minutes} min`
  }

  const isOverdue = (estimatedTime: string) => {
    const estimated = new Date(estimatedTime)
    const now = currentTime
    return estimated.getTime() <= now.getTime()
  }

  const getTodayEarnings = () => {
    return orders
      .filter(order => order.status === 'delivered')
      .reduce((total, order) => total + order.earnings, 0)
  }

  const getCompletedDeliveries = () => {
    return orders.filter(order => order.status === 'delivered').length
  }

  const pendingOrders = getOrdersByStatus('pending')
  const activeOrders = orders.filter(order => order.status === 'picked-up' || order.status === 'in-transit')
  const deliveredOrders = getOrdersByStatus('delivered')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {pendingOrders.length} Available
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {activeOrders.length} Active
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Navigation className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900">{activeOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-2xl font-bold text-gray-900">{getCompletedDeliveries()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${getTodayEarnings().toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Order */}
        {activeOrder && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Navigation className="h-5 w-5 mr-2" />
                Active Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActiveOrderCard 
                order={activeOrder} 
                onStatusChange={updateOrderStatus}
                getTimeRemaining={getTimeRemaining}
                isOverdue={isOverdue}
                getStatusColor={getStatusColor}
              />
            </CardContent>
          </Card>
        )}

        {/* Order Tabs */}
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="available" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Available ({pendingOrders.length})</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center space-x-2">
              <Navigation className="h-4 w-4" />
              <span>Active ({activeOrders.length})</span>
            </TabsTrigger>
            <TabsTrigger value="delivered" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Delivered ({deliveredOrders.length})</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>All Orders</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {pendingOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No available orders</p>
                </CardContent>
              </Card>
            ) : (
              pendingOrders.map(order => (
                <DeliveryOrderCard 
                  key={order.id} 
                  order={order} 
                  onAccept={acceptOrder}
                  getTimeRemaining={getTimeRemaining}
                  isOverdue={isOverdue}
                  getStatusColor={getStatusColor}
                  isActive={false}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No active deliveries</p>
                </CardContent>
              </Card>
            ) : (
              activeOrders.map(order => (
                <DeliveryOrderCard 
                  key={order.id} 
                  order={order} 
                  onAccept={acceptOrder}
                  getTimeRemaining={getTimeRemaining}
                  isOverdue={isOverdue}
                  getStatusColor={getStatusColor}
                  isActive={true}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="delivered" className="space-y-4">
            {deliveredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No delivered orders today</p>
                </CardContent>
              </Card>
            ) : (
              deliveredOrders.map(order => (
                <DeliveryOrderCard 
                  key={order.id} 
                  order={order} 
                  onAccept={acceptOrder}
                  getTimeRemaining={getTimeRemaining}
                  isOverdue={isOverdue}
                  getStatusColor={getStatusColor}
                  isActive={false}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {orders.map(order => (
              <DeliveryOrderCard 
                key={order.id} 
                order={order} 
                onAccept={acceptOrder}
                getTimeRemaining={getTimeRemaining}
                isOverdue={isOverdue}
                getStatusColor={getStatusColor}
                isActive={false}
              />
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

interface ActiveOrderCardProps {
  order: DeliveryOrder
  onStatusChange: (orderId: string, status: DeliveryOrder['status']) => void
  getTimeRemaining: (estimatedTime: string) => string
  isOverdue: (estimatedTime: string) => boolean
  getStatusColor: (status: DeliveryOrder['status']) => string
}

function ActiveOrderCard({ 
  order, 
  onStatusChange, 
  getTimeRemaining, 
  isOverdue, 
  getStatusColor 
}: ActiveOrderCardProps) {
  const timeRemaining = getTimeRemaining(order.estimatedDeliveryTime)
  const overdue = isOverdue(order.estimatedDeliveryTime)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Order Details */}
      <div>
        <h4 className="font-medium mb-3">Order Details:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Order:</span>
            <span className="font-medium">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Customer:</span>
            <span className="font-medium">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              {order.customerPhone}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment:</span>
            <Badge variant="outline" className={order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {order.paymentStatus === 'paid' ? 'Paid' : 'Cash on Delivery'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Items:</span>
            <span className="font-medium">{order.items.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Delivery Progress */}
      <div>
        <h4 className="font-medium mb-3">Delivery Progress:</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status:</span>
            <Badge className={getStatusColor(order.status)}>
              {order.status === 'picked-up' ? 'Picked Up' : 
               order.status === 'in-transit' ? 'In Transit' : order.status}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className={overdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                {timeRemaining}
              </span>
            </div>
            <Progress 
              value={order.status === 'picked-up' ? 33 : order.status === 'in-transit' ? 66 : 100} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <div className="flex items-center mb-1">
                <MapPin className="h-4 w-4 mr-1" />
                Restaurant: {order.restaurantAddress}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Customer: {order.deliveryAddress}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {order.status === 'picked-up' && (
              <Button 
                onClick={() => onStatusChange(order.id, 'in-transit')}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Start Delivery
              </Button>
            )}
            
            {order.status === 'in-transit' && (
              <Button 
                onClick={() => onStatusChange(order.id, 'delivered')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Mark as Delivered
              </Button>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Distance:</span>
              <span>{order.distance} miles</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Earnings:</span>
              <span className="font-bold text-green-600">${order.earnings.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DeliveryOrderCardProps {
  order: DeliveryOrder
  onAccept: (order: DeliveryOrder) => void
  getTimeRemaining: (estimatedTime: string) => string
  isOverdue: (estimatedTime: string) => boolean
  getStatusColor: (status: DeliveryOrder['status']) => string
  isActive: boolean
}

function DeliveryOrderCard({ 
  order, 
  onAccept, 
  getTimeRemaining, 
  isOverdue, 
  getStatusColor,
  isActive
}: DeliveryOrderCardProps) {
  const timeRemaining = getTimeRemaining(order.estimatedDeliveryTime)
  const overdue = isOverdue(order.estimatedDeliveryTime)

  return (
    <Card className={`transition-all ${overdue ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
            <CardDescription>{order.customerName} • {order.distance} miles</CardDescription>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(order.status)}>
              {order.status === 'pending' ? 'Available' :
               order.status === 'picked-up' ? 'Picked Up' :
               order.status === 'in-transit' ? 'In Transit' :
               order.status === 'delivered' ? 'Delivered' : 'Cancelled'}
            </Badge>
            <div className={`text-sm mt-1 ${overdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              {timeRemaining}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Info */}
          <div>
            <h4 className="font-medium mb-3">Order Information:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-600" />
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-gray-600 mt-0.5 flex-shrink-0" />
                <span>{order.deliveryAddress}</span>
              </div>
              <div className="mt-2">
                <div className="font-medium mb-1">Items:</div>
                <div className="text-gray-600">{order.items.join(', ')}</div>
              </div>
              {order.specialInstructions && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <div className="font-medium text-yellow-800">Note:</div>
                  <div className="text-yellow-700">{order.specialInstructions}</div>
                </div>
              )}
            </div>
          </div>

          {/* Actions & Earnings */}
          <div>
            <h4 className="font-medium mb-3">Delivery Details:</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment:</span>
                <Badge variant="outline" className={order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Cash on Delivery'}
                </Badge>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Total:</span>
                <span className="font-medium">${order.orderTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="font-medium">${order.deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-lg font-bold">
                <span>Your Earnings:</span>
                <span className="text-green-600">${order.earnings.toFixed(2)}</span>
              </div>

              {order.status === 'pending' && !isActive && (
                <Button 
                  onClick={() => onAccept(order)}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Accept Order
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t text-sm text-gray-600">
          Ordered: {new Date(order.orderTime).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}