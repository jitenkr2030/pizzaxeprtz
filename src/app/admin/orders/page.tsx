"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  ChefHat,
  Truck,
  Phone,
  MapPin,
  Download,
  RefreshCw
} from "lucide-react"
import Link from "next/link"

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
  user: {
    name: string
    email: string
    phone?: string
  }
  address?: {
    street: string
    city: string
    state: string
    postalCode: string
  }
  orderItems: Array<{
    id: string
    quantity: number
    unitPrice: number
    totalPrice: number
    menuItem: {
      name: string
    }
  }>
  payments: Array<{
    paymentMethod: string
    status: string
  }>
}

const sampleOrders: Order[] = [
  {
    id: "1",
    orderNumber: "PX-2024-045",
    status: "PREPARING",
    subtotal: 32.97,
    taxAmount: 2.64,
    deliveryFee: 0.00,
    totalAmount: 35.61,
    specialInstructions: "Please deliver to the back door",
    estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000),
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    user: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567"
    },
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      postalCode: "12345"
    },
    orderItems: [
      {
        id: "1",
        quantity: 1,
        unitPrice: 12.99,
        totalPrice: 12.99,
        menuItem: {
          name: "Margherita Classic"
        }
      },
      {
        id: "2",
        quantity: 2,
        unitPrice: 6.99,
        totalPrice: 13.98,
        menuItem: {
          name: "Garlic Bread"
        }
      }
    ],
    payments: [
      {
        paymentMethod: "CREDIT_CARD",
        status: "COMPLETED"
      }
    ]
  },
  {
    id: "2",
    orderNumber: "PX-2024-044",
    status: "OUT_FOR_DELIVERY",
    subtotal: 15.99,
    taxAmount: 1.28,
    deliveryFee: 2.99,
    totalAmount: 20.26,
    estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000),
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 987-6543"
    },
    address: {
      street: "456 Oak Ave",
      city: "Somewhere",
      state: "NY",
      postalCode: "67890"
    },
    orderItems: [
      {
        id: "3",
        quantity: 1,
        unitPrice: 15.99,
        totalPrice: 15.99,
        menuItem: {
          name: "Pepperoni Feast"
        }
      }
    ],
    payments: [
      {
        paymentMethod: "CASH_ON_DELIVERY",
        status: "PENDING"
      }
    ]
  },
  {
    id: "3",
    orderNumber: "PX-2024-043",
    status: "PENDING",
    subtotal: 18.50,
    taxAmount: 1.48,
    deliveryFee: 2.99,
    totalAmount: 22.97,
    createdAt: new Date(Date.now() - 35 * 60 * 1000),
    user: {
      name: "Mike Johnson",
      email: "mike@example.com"
    },
    address: {
      street: "789 Pine Rd",
      city: "Elsewhere",
      state: "TX",
      postalCode: "54321"
    },
    orderItems: [
      {
        id: "4",
        quantity: 1,
        unitPrice: 18.50,
        totalPrice: 18.50,
        menuItem: {
          name: "Veggie Supreme"
        }
      }
    ],
    payments: [
      {
        paymentMethod: "DIGITAL_WALLET",
        status: "COMPLETED"
      }
    ]
  }
]

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  ACCEPTED: { label: "Accepted", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  PREPARING: { label: "Preparing", color: "bg-orange-100 text-orange-800", icon: ChefHat },
  READY_FOR_PICKUP: { label: "Ready", color: "bg-purple-100 text-purple-800", icon: CheckCircle },
  OUT_FOR_DELIVERY: { label: "Delivering", color: "bg-indigo-100 text-indigo-800", icon: Truck },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function AdminOrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(sampleOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    let filtered = orders

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

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
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // In a real app, this would make an API call
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const exportOrders = () => {
    // In a real app, this would generate and download a CSV/Excel file
    alert("Export functionality would be implemented here")
  }

  if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "MANAGER")) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold text-gray-900 ml-4">Order Management</h1>
          </div>
          
          <Button onClick={exportOrders} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                    <SelectItem value="PREPARING">Preparing</SelectItem>
                    <SelectItem value="READY_FOR_PICKUP">Ready for Pickup</SelectItem>
                    <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Orders ({filteredOrders.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({filteredOrders.filter(o => !["DELIVERED", "CANCELLED"].includes(o.status)).length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({filteredOrders.filter(o => o.status === "DELIVERED").length})</TabsTrigger>
              <TabsTrigger value="issues">Issues ({filteredOrders.filter(o => ["CANCELLED"].includes(o.status)).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orders List */}
                <div className="lg:col-span-2 space-y-4">
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
                                Customer: {order.user.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.orderItems.length} items • ${order.totalAmount.toFixed(2)}
                              </p>
                              {order.estimatedDelivery && order.status !== "DELIVERED" && (
                                <p className="text-sm text-gray-500 mt-1">
                                  Est. delivery: {formatTime(order.estimatedDelivery)}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              {order.status === "PENDING" && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateOrderStatus(order.id, "ACCEPTED")
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Accept
                                </Button>
                              )}
                              {order.status === "ACCEPTED" && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateOrderStatus(order.id, "PREPARING")
                                  }}
                                  className="bg-orange-600 hover:bg-orange-700"
                                >
                                  Start Preparing
                                </Button>
                              )}
                              {order.status === "PREPARING" && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateOrderStatus(order.id, "READY_FOR_PICKUP")
                                  }}
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  Mark Ready
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
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
                        {/* Customer Info */}
                        <div>
                          <h4 className="font-semibold mb-2">Customer Information</h4>
                          <div className="space-y-1 text-sm">
                            <p><strong>Name:</strong> {selectedOrder.user.name}</p>
                            <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                            {selectedOrder.user.phone && (
                              <p><strong>Phone:</strong> {selectedOrder.user.phone}</p>
                            )}
                          </div>
                        </div>

                        {/* Delivery Address */}
                        {selectedOrder.address && (
                          <>
                            <div>
                              <h4 className="font-semibold mb-2">Delivery Address</h4>
                              <div className="text-sm">
                                <p>{selectedOrder.address.street}</p>
                                <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.postalCode}</p>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Order Items */}
                        <div>
                          <h4 className="font-semibold mb-2">Order Items</h4>
                          <div className="space-y-2">
                            {selectedOrder.orderItems.map(item => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.quantity}x {item.menuItem.name}</span>
                                <span>${item.totalPrice.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Payment Info */}
                        <div>
                          <h4 className="font-semibold mb-2">Payment</h4>
                          <div className="text-sm">
                            <p><strong>Method:</strong> {selectedOrder.payments[0]?.paymentMethod}</p>
                            <p><strong>Status:</strong> {selectedOrder.payments[0]?.status}</p>
                          </div>
                        </div>

                        {/* Special Instructions */}
                        {selectedOrder.specialInstructions && (
                          <div>
                            <h4 className="font-semibold mb-2">Special Instructions</h4>
                            <p className="text-sm text-gray-600">{selectedOrder.specialInstructions}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-2">
                          {selectedOrder.user.phone && (
                            <Button variant="outline" className="w-full" size="sm">
                              <Phone className="h-4 w-4 mr-2" />
                              Call Customer
                            </Button>
                          )}
                          
                          {selectedOrder.address && (
                            <Button variant="outline" className="w-full" size="sm">
                              <MapPin className="h-4 w-4 mr-2" />
                              View on Map
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="sticky top-24">
                      <CardContent className="p-8 text-center">
                        <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Select an Order</h3>
                        <p className="text-gray-500">Choose an order to view its details.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {filteredOrders
                    .filter(order => !["DELIVERED", "CANCELLED"].includes(order.status))
                    .map(order => {
                      const statusInfo = getStatusInfo(order.status)
                      const StatusIcon = statusInfo.icon
                      
                      return (
                        <Card key={order.id} className="hover:shadow-md cursor-pointer" onClick={() => setSelectedOrder(order)}>
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
                                  Customer: {order.user.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {order.orderItems.length} items • ${order.totalAmount.toFixed(2)}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                Manage Order
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
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
                      <Card key={order.id}>
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
                                Customer: {order.user.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.orderItems.length} items • ${order.totalAmount.toFixed(2)}
                              </p>
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

            <TabsContent value="issues" className="mt-6">
              <div className="space-y-4">
                {filteredOrders
                  .filter(order => order.status === "CANCELLED")
                  .map(order => {
                    const statusInfo = getStatusInfo(order.status)
                    const StatusIcon = statusInfo.icon
                    
                    return (
                      <Card key={order.id}>
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
                                Customer: {order.user.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.orderItems.length} items • ${order.totalAmount.toFixed(2)}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Review Issue
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
      </main>
    </div>
  )
}