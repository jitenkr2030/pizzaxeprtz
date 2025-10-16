"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  ChefHat, 
  Truck, 
  CheckCircle, 
  Phone,
  Star,
  RefreshCw
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
  }>
  deliveryOrder?: {
    status: string
    pickupTime?: Date
    deliveryTime?: Date
    deliveryPartner?: {
      name: string
      phone: string
    }
  }
}

const sampleOrder: Order = {
  id: "2",
  orderNumber: "PX-2024-002",
  status: "OUT_FOR_DELIVERY",
  subtotal: 15.99,
  taxAmount: 1.28,
  deliveryFee: 2.99,
  totalAmount: 20.26,
  specialInstructions: "Please deliver to the back door",
  estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
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
  deliveryOrder: {
    status: "picked_up",
    pickupTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    deliveryPartner: {
      name: "John Driver",
      phone: "+1 (555) 123-4567"
    }
  }
}

const statusSteps = [
  { key: "PENDING", label: "Order Received", icon: Clock, estimatedTime: 0 },
  { key: "ACCEPTED", label: "Order Confirmed", icon: CheckCircle, estimatedTime: 5 },
  { key: "PREPARING", label: "Preparing", icon: ChefHat, estimatedTime: 15 },
  { key: "READY_FOR_PICKUP", label: "Ready for Pickup", icon: CheckCircle, estimatedTime: 25 },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Truck, estimatedTime: 35 },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle, estimatedTime: 45 },
]

const statusConfig = {
  PENDING: { label: "Order Received", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  ACCEPTED: { label: "Order Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  PREPARING: { label: "Preparing", color: "bg-orange-100 text-orange-800", icon: ChefHat },
  READY_FOR_PICKUP: { label: "Ready for Pickup", color: "bg-purple-100 text-purple-800", icon: CheckCircle },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-800", icon: Truck },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: RefreshCw },
  REFUNDED: { label: "Refunded", color: "bg-gray-100 text-gray-800", icon: RefreshCw },
}

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<Order>(sampleOrder)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    // Initialize socket connection for real-time updates
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001")
    setSocket(newSocket)

    // Listen for order status updates
    newSocket.on("orderStatusUpdate", (data: { orderId: string; status: string; estimatedDelivery?: Date }) => {
      if (data.orderId === orderId) {
        setOrder(prev => ({
          ...prev,
          status: data.status,
          estimatedDelivery: data.estimatedDelivery || prev.estimatedDelivery
        }))
        setLastUpdated(new Date())
      }
    })

    // Listen for delivery updates
    newSocket.on("deliveryUpdate", (data: { orderId: string; status: string; pickupTime?: Date; deliveryTime?: Date }) => {
      if (data.orderId === orderId) {
        setOrder(prev => ({
          ...prev,
          deliveryOrder: {
            ...prev.deliveryOrder!,
            status: data.status,
            pickupTime: data.pickupTime || prev.deliveryOrder?.pickupTime,
            deliveryTime: data.deliveryTime || prev.deliveryOrder?.deliveryTime
          }
        }))
        setLastUpdated(new Date())
      }
    })

    return () => {
      newSocket.close()
    }
  }, [orderId])

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === order.status)
  }

  const getProgressPercentage = () => {
    const currentStep = getCurrentStepIndex()
    return ((currentStep + 1) / statusSteps.length) * 100
  }

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

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes === 1) return "1 minute ago"
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours === 1) return "1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "1 day ago"
    return `${diffInDays} days ago`
  }

  const getEstimatedDeliveryTime = () => {
    if (order.estimatedDelivery) {
      const now = new Date()
      const diffInMinutes = Math.floor((order.estimatedDelivery.getTime() - now.getTime()) / (1000 * 60))
      
      if (diffInMinutes <= 0) return "Arriving any minute now!"
      if (diffInMinutes <= 5) return "Arriving in less than 5 minutes"
      if (diffInMinutes <= 15) return `Arriving in ${diffInMinutes} minutes`
      return `Estimated arrival: ${formatTime(order.estimatedDelivery)}`
    }
    
    return "Calculating estimated delivery time..."
  }

  const currentStepIndex = getCurrentStepIndex()
  const statusInfo = getStatusInfo(order.status)
  const progressPercentage = getProgressPercentage()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 ml-8">Track Order</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Order #{order.orderNumber}</CardTitle>
                <CardDescription>
                  Placed {formatTimeAgo(order.createdAt)} • Total: ${order.totalAmount.toFixed(2)}
                </CardDescription>
              </div>
              <Badge className={statusInfo.color}>
                <statusInfo.icon className="h-4 w-4 mr-1" />
                {statusInfo.label}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Real-time Status Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>
              Last updated: {formatTimeAgo(lastUpdated)} • {getEstimatedDeliveryTime()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="relative">
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between mt-2">
                  {statusSteps.map((step, index) => {
                    const StepIcon = step.icon
                    const isActive = index <= currentStepIndex
                    const isCurrentStep = index === currentStepIndex
                    
                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive ? "bg-red-600 text-white" : "bg-gray-200 text-gray-400"
                        }`}>
                          <StepIcon className="h-4 w-4" />
                        </div>
                        <span className={`text-xs mt-2 text-center ${
                          isCurrentStep ? "font-semibold text-red-600" : "text-gray-500"
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Current Status Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      statusInfo.color
                    }`}>
                      <statusInfo.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{statusInfo.label}</h3>
                      <p className="text-sm text-gray-600">
                        {order.status === "PREPARING" && "Our chefs are preparing your delicious pizza"}
                        {order.status === "OUT_FOR_DELIVERY" && "Your order is on the way!"}
                        {order.status === "DELIVERED" && "Enjoy your meal!"}
                        {order.status === "PENDING" && "We've received your order and are reviewing it"}
                        {order.status === "ACCEPTED" && "Your order has been confirmed"}
                        {order.status === "READY_FOR_PICKUP" && "Your order is ready for pickup"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Partner Info */}
                {order.status === "OUT_FOR_DELIVERY" && order.deliveryOrder?.deliveryPartner && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Truck className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{order.deliveryOrder.deliveryPartner.name}</h4>
                          <p className="text-sm text-gray-600">Delivery Partner</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.orderItems.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{item.menuItem.name}</h4>
                    <p className="text-sm text-gray-500">{item.menuItem.description}</p>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${order.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-red-600">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {order.specialInstructions && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Special Instructions</h4>
                    <p className="text-sm text-gray-600">{order.specialInstructions}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {order.status === "DELIVERED" && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">How was your order?</h3>
                <p className="text-gray-600 mb-4">Rate your experience and help us improve</p>
                <div className="flex justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <Star 
                      key={rating} 
                      className="h-8 w-8 cursor-pointer text-gray-300 hover:text-yellow-400 transition-colors"
                    />
                  ))}
                </div>
                <Button className="bg-red-600 hover:bg-red-700">
                  Submit Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  )
}