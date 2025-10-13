"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Search, 
  Clock, 
  MapPin, 
  ChefHat, 
  Truck, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Star
} from "lucide-react"
import Link from "next/link"
import { io, Socket } from "socket.io-client"

interface Order {
  id: string
  orderNumber: string
  status: string
  subtotal: number
  taxAmount: number
  deliveryFee: number
  totalAmount: number
  specialInstructions?: string
  estimatedDelivery?: Date
  actualDelivery?: Date
  createdAt: Date
  orderItems: Array<{
    id: string
    quantity: number
    unitPrice: number
    totalPrice: number
    specialNotes?: string
    menuItem: {
      name: string
      description: string
      image?: string
    }
    customizations?: Array<{
      name: string
      priceAdjustment: number
    }>
  }>
  payments: Array<{
    id: string
    amount: number
    paymentMethod: string
    status: string
  }>
  review?: {
    id: string
    rating: number
    comment?: string
  }
}

const sampleOrders: Order[] = [
  {
    id: "1",
    orderNumber: "PX-2024-001",
    status: "DELIVERED",
    subtotal: 32.97,
    taxAmount: 2.64,
    deliveryFee: 0.00,
    totalAmount: 35.61,
    specialInstructions: "Please deliver to the back door",
    estimatedDelivery: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    actualDelivery: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    orderItems: [
      {
        id: "1",
        quantity: 1,
        unitPrice: 12.99,
        totalPrice: 12.99,
        menuItem: {
          name: "Margherita Classic",
          description: "Fresh mozzarella, tomato sauce, basil leaves",
        },
        customizations: [
          { name: "Extra Cheese", priceAdjustment: 2.00 },
          { name: "Large Size", priceAdjustment: 3.00 }
        ]
      },
      {
        id: "2",
        quantity: 2,
        unitPrice: 6.99,
        totalPrice: 13.98,
        menuItem: {
          name: "Garlic Bread",
          description: "Fresh baked bread with garlic butter and herbs",
        }
      }
    ],
    payments: [
      {
        id: "1",
        amount: 35.61,
        paymentMethod: "CREDIT_CARD",
        status: "COMPLETED"
      }
    ],
    review: {
      id: "1",
      rating: 5,
      comment: "Amazing pizza! Will definitely order again."
    }
  },
  {
    id: "2",
    orderNumber: "PX-2024-002",
    status: "OUT_FOR_DELIVERY",
    subtotal: 15.99,
    taxAmount: 1.28,
    deliveryFee: 2.99,
    totalAmount: 20.26,
    estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    orderItems: [
      {
        id: "3",
        quantity: 1,
        unitPrice: 15.99,
        totalPrice: 15.99,
        menuItem: {
          name: "Pepperoni Feast",
          description: "Double pepperoni, mozzarella cheese, tomato sauce",
        }
      }
    ],
    payments: [
      {
        id: "2",
        amount: 20.26,
        paymentMethod: "CASH_ON_DELIVERY",
        status: "PENDING"
      }
    ]
  }
]

const statusConfig = {
  PENDING: { label: "Order Received", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  ACCEPTED: { label: "Order Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  PREPARING: { label: "Preparing", color: "bg-orange-100 text-orange-800", icon: ChefHat },
  READY_FOR_PICKUP: { label: "Ready for Pickup", color: "bg-purple-100 text-purple-800", icon: CheckCircle },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-800", icon: Truck },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
  REFUNDED: { label: "Refunded", color: "bg-gray-100 text-gray-800", icon: RefreshCw },
}

export default function OrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    // Initialize socket connection for real-time updates
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001")
    setSocket(newSocket)

    // Listen for order status updates
    newSocket.on("orderStatusUpdate", (data: { orderId: string; status: string; estimatedDelivery?: Date }) => {
      setOrders(prev => prev.map(order => 
        order.id === data.orderId 
          ? { 
              ...order, 
              status: data.status,
              estimatedDelivery: data.estimatedDelivery || order.estimatedDelivery
            } 
          : order
      ))
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusInfo = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be signed in to view your orders.</p>
          <Link href="/auth/signin">
            <Button className="bg-red-600 hover:bg-red-700">Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 ml-8">My Orders</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="space-y-4">
                  {filteredOrders.map(order => {
                    const statusInfo = getStatusInfo(order.status)
                    const StatusIcon = statusInfo.icon
                    
                    return (
                      <Card 
                        key={order.id} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedOrder?.id === order.id ? "ring-2 ring-red-600" : ""
                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                              <CardDescription>
                                {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
                              </CardDescription>
                            </div>
                            <Badge className={statusInfo.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">
                                {order.orderItems.length} items • ${order.totalAmount.toFixed(2)}
                              </p>
                              {order.estimatedDelivery && order.status !== "DELIVERED" && (
                                <p className="text-sm text-gray-500 mt-1">
                                  Est. delivery: {formatTime(order.estimatedDelivery)}
                                </p>
                              )}
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="active" className="mt-6">
                <div className="space-y-4">
                  {filteredOrders
                    .filter(order => ["PENDING", "ACCEPTED", "PREPARING", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY"].includes(order.status))
                    .map(order => {
                      const statusInfo = getStatusInfo(order.status)
                      const StatusIcon = statusInfo.icon
                      
                      return (
                        <Card key={order.id} className="cursor-pointer hover:shadow-md" onClick={() => setSelectedOrder(order)}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                                <CardDescription>
                                  {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
                                </CardDescription>
                              </div>
                              <Badge className={statusInfo.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">
                                  {order.orderItems.length} items • ${order.totalAmount.toFixed(2)}
                                </p>
                                {order.estimatedDelivery && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    Est. delivery: {formatTime(order.estimatedDelivery)}
                                  </p>
                                )}
                              </div>
                              <Button variant="outline" size="sm">
                                Track Order
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <div className="space-y-4">
                  {filteredOrders
                    .filter(order => order.status === "DELIVERED")
                    .map(order => {
                      const statusInfo = getStatusInfo(order.status)
                      const StatusIcon = statusInfo.icon
                      
                      return (
                        <Card key={order.id} className="cursor-pointer hover:shadow-md" onClick={() => setSelectedOrder(order)}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                                <CardDescription>
                                  {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
                                </CardDescription>
                              </div>
                              <Badge className={statusInfo.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">
                                  {order.orderItems.length} items • ${order.totalAmount.toFixed(2)}
                                </p>
                                {order.review && (
                                  <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-3 w-3 ${i < order.review!.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
              </TabsContent>

              <TabsContent value="cancelled" className="mt-6">
                <div className="space-y-4">
                  {filteredOrders
                    .filter(order => ["CANCELLED", "REFUNDED"].includes(order.status))
                    .map(order => {
                      const statusInfo = getStatusInfo(order.status)
                      const StatusIcon = statusInfo.icon
                      
                      return (
                        <Card key={order.id} className="cursor-pointer hover:shadow-md" onClick={() => setSelectedOrder(order)}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                                <CardDescription>
                                  {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
                                </CardDescription>
                              </div>
                              <Badge className={statusInfo.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600">
                                {order.orderItems.length} items • ${order.totalAmount.toFixed(2)}
                              </p>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Order Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>Order #{selectedOrder.orderNumber}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status Timeline */}
                  <div>
                    <h4 className="font-semibold mb-3">Order Status</h4>
                    <div className="space-y-2">
                      {Object.entries(statusConfig).map(([statusKey, config]) => {
                        const isActive = selectedOrder.status === statusKey
                        const Icon = config.icon
                        
                        return (
                          <div 
                            key={statusKey}
                            className={`flex items-center space-x-3 p-2 rounded-lg ${
                              isActive ? config.color : "bg-gray-50"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{config.label}</span>
                            {isActive && <CheckCircle className="h-4 w-4 ml-auto" />}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.orderItems.map(item => (
                        <div key={item.id} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.menuItem.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            {item.customizations && item.customizations.length > 0 && (
                              <div className="mt-1">
                                {item.customizations.map((custom, index) => (
                                  <p key={index} className="text-xs text-gray-600">
                                    + {custom.name}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium">${item.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div>
                    <h4 className="font-semibold mb-3">Price Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${selectedOrder.taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-red-600">${selectedOrder.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.specialInstructions && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-3">Special Instructions</h4>
                        <p className="text-sm text-gray-600">{selectedOrder.specialInstructions}</p>
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {selectedOrder.status === "DELIVERED" && !selectedOrder.review && (
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Rate Order
                      </Button>
                    )}
                    
                    {selectedOrder.status === "OUT_FOR_DELIVERY" && (
                      <Button variant="outline" className="w-full">
                        <MapPin className="h-4 w-4 mr-2" />
                        Track Delivery
                      </Button>
                    )}
                    
                    <Button variant="outline" className="w-full">
                      Reorder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-24">
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select an Order</h3>
                  <p className="text-gray-500">Choose an order to view its details and tracking information.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}