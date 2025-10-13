"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChefHat, Clock, CheckCircle, XCircle, AlertCircle, ChefHat as Fire, Users } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  quantity: number
  customizations?: string[]
  notes?: string
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  items: OrderItem[]
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  priority: 'normal' | 'high' | 'urgent'
  orderTime: string
  estimatedTime: string
  deliveryType: 'pickup' | 'delivery'
  specialInstructions?: string
  totalAmount: number
}

const sampleOrders: Order[] = [
  {
    id: "1",
    orderNumber: "#1001",
    customerName: "John Smith",
    items: [
      {
        id: "1",
        name: "Margherita Classic",
        quantity: 2,
        customizations: ["Extra cheese", "Well done"]
      },
      {
        id: "2",
        name: "Garlic Bread",
        quantity: 1
      }
    ],
    status: "pending",
    priority: "normal",
    orderTime: "2024-01-20T18:30:00",
    estimatedTime: "2024-01-20T19:00:00",
    deliveryType: "delivery",
    specialInstructions: "Please make it spicy",
    totalAmount: 32.97
  },
  {
    id: "2",
    orderNumber: "#1002",
    customerName: "Sarah Johnson",
    items: [
      {
        id: "3",
        name: "Pepperoni Feast",
        quantity: 1,
        customizations: ["Thin crust"]
      }
    ],
    status: "preparing",
    priority: "high",
    orderTime: "2024-01-20T18:25:00",
    estimatedTime: "2024-01-20T18:50:00",
    deliveryType: "pickup",
    totalAmount: 15.99
  },
  {
    id: "3",
    orderNumber: "#1003",
    customerName: "Mike Davis",
    items: [
      {
        id: "4",
        name: "Veggie Supreme",
        quantity: 1,
        customizations: ["No onions", "Extra mushrooms"]
      },
      {
        id: "5",
        name: "Caesar Salad",
        quantity: 1
      }
    ],
    status: "ready",
    priority: "normal",
    orderTime: "2024-01-20T18:15:00",
    estimatedTime: "2024-01-20T18:45:00",
    deliveryType: "delivery",
    totalAmount: 23.98
  },
  {
    id: "4",
    orderNumber: "#1004",
    customerName: "Emily Brown",
    items: [
      {
        id: "6",
        name: "BBQ Chicken",
        quantity: 2,
        customizations: ["Extra BBQ sauce", "Add jalapeños"]
      }
    ],
    status: "pending",
    priority: "urgent",
    orderTime: "2024-01-20T18:35:00",
    estimatedTime: "2024-01-20T18:55:00",
    deliveryType: "pickup",
    specialInstructions: "Customer is waiting, please hurry",
    totalAmount: 33.98
  }
]

export default function KitchenOrders() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status)
  }

  const getPriorityColor = (priority: Order['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'preparing': return 'bg-blue-100 text-blue-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
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

  const pendingOrders = getOrdersByStatus('pending')
  const preparingOrders = getOrdersByStatus('preparing')
  const readyOrders = getOrdersByStatus('ready')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Kitchen Orders</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {pendingOrders.length} Pending
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {preparingOrders.length} Preparing
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {readyOrders.length} Ready
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
                <Clock className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Fire className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Preparing</p>
                  <p className="text-2xl font-bold text-gray-900">{preparingOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Ready</p>
                  <p className="text-2xl font-bold text-gray-900">{readyOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Today</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Pending ({pendingOrders.length})</span>
            </TabsTrigger>
            <TabsTrigger value="preparing" className="flex items-center space-x-2">
              <Fire className="h-4 w-4" />
              <span>Preparing ({preparingOrders.length})</span>
            </TabsTrigger>
            <TabsTrigger value="ready" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Ready ({readyOrders.length})</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>All Orders</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending orders</p>
                </CardContent>
              </Card>
            ) : (
              pendingOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onStatusChange={updateOrderStatus}
                  getTimeRemaining={getTimeRemaining}
                  isOverdue={isOverdue}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="preparing" className="space-y-4">
            {preparingOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Fire className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders being prepared</p>
                </CardContent>
              </Card>
            ) : (
              preparingOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onStatusChange={updateOrderStatus}
                  getTimeRemaining={getTimeRemaining}
                  isOverdue={isOverdue}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="ready" className="space-y-4">
            {readyOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders ready for pickup</p>
                </CardContent>
              </Card>
            ) : (
              readyOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onStatusChange={updateOrderStatus}
                  getTimeRemaining={getTimeRemaining}
                  isOverdue={isOverdue}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {orders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={updateOrderStatus}
                getTimeRemaining={getTimeRemaining}
                isOverdue={isOverdue}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
              />
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

interface OrderCardProps {
  order: Order
  onStatusChange: (orderId: string, status: Order['status']) => void
  getTimeRemaining: (estimatedTime: string) => string
  isOverdue: (estimatedTime: string) => boolean
  getPriorityColor: (priority: Order['priority']) => string
  getStatusColor: (status: Order['status']) => string
}

function OrderCard({ 
  order, 
  onStatusChange, 
  getTimeRemaining, 
  isOverdue, 
  getPriorityColor, 
  getStatusColor 
}: OrderCardProps) {
  const timeRemaining = getTimeRemaining(order.estimatedTime)
  const overdue = isOverdue(order.estimatedTime)

  return (
    <Card className={`transition-all ${overdue ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div>
              <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
              <CardDescription>{order.customerName} • {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}</CardDescription>
            </div>
            <Badge className={getPriorityColor(order.priority)}>
              {order.priority}
            </Badge>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <div className={`text-sm mt-1 ${overdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              {timeRemaining}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Items */}
          <div>
            <h4 className="font-medium mb-3">Order Items:</h4>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{item.quantity}x {item.name}</span>
                    {item.customizations && item.customizations.length > 0 && (
                      <div className="text-sm text-gray-600">
                        {item.customizations.join(', ')}
                      </div>
                    )}
                    {item.notes && (
                      <div className="text-sm text-blue-600">
                        Note: {item.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <h4 className="font-medium mb-3">Actions:</h4>
            <div className="space-y-2">
              {order.status === 'pending' && (
                <Button 
                  onClick={() => onStatusChange(order.id, 'preparing')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Start Preparing
                </Button>
              )}
              
              {order.status === 'preparing' && (
                <Button 
                  onClick={() => onStatusChange(order.id, 'ready')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Mark as Ready
                </Button>
              )}
              
              {order.status === 'ready' && (
                <Button 
                  onClick={() => onStatusChange(order.id, 'completed')}
                  className="w-full bg-gray-600 hover:bg-gray-700"
                >
                  Complete Order
                </Button>
              )}
              
              {order.status !== 'completed' && order.status !== 'cancelled' && (
                <Button 
                  onClick={() => onStatusChange(order.id, 'cancelled')}
                  variant="outline"
                  className="w-full text-red-600 border-red-600 hover:bg-red-50"
                >
                  Cancel Order
                </Button>
              )}
            </div>

            {order.specialInstructions && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Special Instructions:</p>
                    <p className="text-sm text-yellow-700">{order.specialInstructions}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Ordered: {new Date(order.orderTime).toLocaleTimeString()}
          </div>
          <div className="text-lg font-bold text-red-600">
            Total: ${order.totalAmount.toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}