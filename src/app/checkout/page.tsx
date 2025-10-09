"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, MapPin, Clock, Truck, CheckCircle, AlertCircle } from "lucide-react"
import { PaymentService, PaymentMethod, PaymentRequest, Order } from "@/lib/payment"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  preparationTime: number
}

interface CheckoutPageProps {
  cartItems: CartItem[]
  totalAmount: number
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  
  // Mock cart data - in real app, this would come from cart context or state management
  const [cartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Paneer Tikka Pizza",
      price: 16.99,
      quantity: 1,
      image: "/api/placeholder/300/200",
      preparationTime: 20
    },
    {
      id: "8",
      name: "Veg Samosa (2 pcs)",
      price: 6.99,
      quantity: 2,
      image: "/api/placeholder/300/200",
      preparationTime: 10
    }
  ])
  
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const deliveryFee = 2.99
  const tax = totalAmount * 0.08
  const finalTotal = totalAmount + deliveryFee + tax
  
  // Form states
  const [deliveryInfo, setDeliveryInfo] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: ""
  })
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardName: "",
    paymentMethod: "credit_card" as const
  })

  const handlePayment = async () => {
    if (!session) {
      setError("Please sign in to complete your purchase")
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Create payment method
      const paymentMethod: PaymentMethod = {
        id: "pm_" + Date.now(),
        type: paymentInfo.paymentMethod,
        lastFour: paymentInfo.cardNumber.slice(-4),
        expiryMonth: parseInt(paymentInfo.expiryMonth),
        expiryYear: parseInt(paymentInfo.expiryYear),
        name: paymentInfo.cardName
      }
      
      // Create payment request
      const paymentRequest: PaymentRequest = {
        amount: Math.round(finalTotal * 100), // Convert to cents
        currency: "USD",
        paymentMethod,
        orderId: "order_" + Date.now(),
        customerEmail: session.user?.email || "",
        customerName: session.user?.name || ""
      }
      
      // Process payment
      const paymentResult = await PaymentService.processPayment(paymentRequest)
      
      if (paymentResult.success) {
        // Create order
        const orderData = {
          userId: session.user?.id || "",
          items: cartItems,
          totalAmount: finalTotal,
          status: "confirmed" as const,
          paymentStatus: "paid" as const,
          deliveryAddress: deliveryInfo,
          paymentMethod: paymentInfo.paymentMethod,
          transactionId: paymentResult.transactionId
        }
        
        const createdOrder = await PaymentService.createOrder(orderData)
        setOrder(createdOrder)
        setPaymentSuccess(true)
        
        // Redirect to thank you page after 2 seconds
        setTimeout(() => {
          router.push(`/thank-you?orderId=${createdOrder.id}`)
        }, 2000)
      } else {
        setError(paymentResult.error || "Payment failed")
      }
    } catch (err) {
      setError("An error occurred during payment processing")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (paymentSuccess && order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your order has been confirmed</p>
            <p className="text-sm text-gray-500">Redirecting to thank you page...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-orange-600">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={deliveryInfo.street}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, street: e.target.value})}
                      placeholder="123 Main Street"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={deliveryInfo.city}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, city: e.target.value})}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={deliveryInfo.state}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, state: e.target.value})}
                        placeholder="NY"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={deliveryInfo.zipCode}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, zipCode: e.target.value})}
                        placeholder="10001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={deliveryInfo.phone}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Payment Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={paymentInfo.paymentMethod} onValueChange={(value: any) => setPaymentInfo({...paymentInfo, paymentMethod: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="debit_card">Debit Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="net_banking">Net Banking</SelectItem>
                        <SelectItem value="wallet">Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      value={paymentInfo.cardName}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Month</Label>
                      <Select value={paymentInfo.expiryMonth} onValueChange={(value) => setPaymentInfo({...paymentInfo, expiryMonth: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                            <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="expiryYear">Year</Label>
                      <Select value={paymentInfo.expiryYear} onValueChange={(value) => setPaymentInfo({...paymentInfo, expiryYear: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="YY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                            <SelectItem key={year} value={year.toString().slice(-2)}>
                              {year.toString().slice(-2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Estimated Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Order Confirmed
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Preparing (15-20 min)
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800">
                      <Truck className="h-3 w-3 mr-1" />
                      Out for Delivery (20-30 min)
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Delivered (45 min total)
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Place Order Button */}
            <Button 
              onClick={handlePayment}
              disabled={loading || !session}
              className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg"
            >
              {loading ? "Processing Payment..." : `Pay $${finalTotal.toFixed(2)}`}
            </Button>
            
            {!session && (
              <p className="text-center text-sm text-gray-600">
                Please sign in to complete your purchase
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}