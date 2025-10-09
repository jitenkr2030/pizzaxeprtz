"use client"

import { useEffect, useState, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Truck, MapPin, ChefHat, Star, AlertCircle } from "lucide-react"
import Link from "next/link"
import { PaymentService, Order } from "@/lib/payment"

function ThankYouContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    const fetchOrder = async () => {
      try {
        const orderData = await PaymentService.getOrderStatus(orderId)
        if (orderData) {
          setOrder(orderData)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  useEffect(() => {
    // Auto redirect to profile after 10 seconds
    const timer = setTimeout(() => {
      if (session) {
        router.push('/profile')
      } else {
        router.push('/')
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [session, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-4">We couldn't find your order details</p>
            <Button onClick={() => router.push('/')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const estimatedDelivery = new Date(order.estimatedDeliveryTime)
  const timeRemaining = Math.max(0, estimatedDelivery.getTime() - Date.now())
  const minutesRemaining = Math.floor(timeRemaining / (1000 * 60))

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-orange-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">PizzaXpertz</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-xl text-gray-600 mb-2">Your order has been confirmed</p>
          <p className="text-lg text-orange-600 font-medium">Order #{order.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Order Confirmed</p>
                      <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChefHat className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Preparing</p>
                      <p className="text-sm text-gray-500">Estimated 15-20 minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center opacity-50">
                    <div className="flex-shrink-0">
                      <Truck className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Out for Delivery</p>
                      <p className="text-sm text-gray-500">Estimated 20-30 minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center opacity-50">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Delivered</p>
                      <p className="text-sm text-gray-500">Estimated 45 minutes total</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                      </div>
                      <p className="font-medium">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${(order.totalAmount * 0.92).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>$2.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${(order.totalAmount * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-orange-600">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Delivery Address</p>
                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress.street}<br />
                      {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{order.deliveryAddress.phone}</p>
                  </div>
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-gray-600">
                      {minutesRemaining > 0 ? `${minutesRemaining} minutes` : 'Arriving soon'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Payment Method</span>
                    <Badge variant="outline">{order.paymentMethod.replace('_', ' ')}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment Status</span>
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                  </div>
                  {order.transactionId && (
                    <div>
                      <p className="font-medium">Transaction ID</p>
                      <p className="text-sm text-gray-600 font-mono">{order.transactionId}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Have questions about your order? We're here to help!
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Phone:</strong> (555) 123-4567
                    </p>
                    <p className="text-sm">
                      <strong>Email:</strong> support@pizzaxpertz.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {session && (
                <Link href="/profile">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    View Order History
                  </Button>
                </Link>
              )}
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Order Again
                </Button>
              </Link>
            </div>

            {/* Auto-redirect notice */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                You'll be redirected to your profile in a few seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}