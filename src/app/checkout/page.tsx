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
import { formatINRWithRs, convertUSDToINR } from "@/lib/currency"
import { QRCodePayment } from "@/components/ui/qrcode-payment"
import { MerchantQRPayment } from "@/components/ui/merchant-qr-payment"
import { WalletPayment } from "@/components/ui/wallet-payment"

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
  const [showQRCode, setShowQRCode] = useState(true)
  const [showWallet, setShowWallet] = useState(false)
  
  // Mock cart data - in real app, this would come from cart context or state management
  const [cartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Paneer Tikka Pizza",
      price: convertUSDToINR(16.99),
      quantity: 1,
      image: "/api/placeholder/300/200",
      preparationTime: 20
    },
    {
      id: "8",
      name: "Veg Samosa (2 pcs)",
      price: convertUSDToINR(6.99),
      quantity: 2,
      image: "/api/placeholder/300/200",
      preparationTime: 10
    }
  ])
  
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const deliveryFee = convertUSDToINR(2.99)
  const tax = totalAmount * 0.18 // GST rate in India
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
    paymentMethod: "qr_code" as const
  })
  
  const [showCashOnDelivery, setShowCashOnDelivery] = useState(false)

  const handlePayment = async () => {
    if (!session) {
      setError("Please sign in to complete your purchase")
      return
    }
    
    // If QR code or wallet payment is selected, the payment is handled by the respective component
    if (showQRCode || showWallet) {
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
        amount: Math.round(finalTotal * 100), // Convert to paise (INR)
        currency: "INR",
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
                        <p className="font-medium">{formatINRWithRs(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatINRWithRs(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{formatINRWithRs(deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18%)</span>
                      <span>{formatINRWithRs(tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-orange-600">{formatINRWithRs(finalTotal)}</span>
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
                    <Select value={paymentInfo.paymentMethod} onValueChange={(value: any) => {
                      setPaymentInfo({...paymentInfo, paymentMethod: value})
                      setShowQRCode(value === 'qr_code')
                      setShowWallet(value === 'wallet')
                      setShowCashOnDelivery(value === 'cash_on_delivery')
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="qr_code">QR Code</SelectItem>
                        <SelectItem value="wallet">Wallet</SelectItem>
                        <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Show QR Code Payment if selected */}
                  {showQRCode && (
                    <div className="space-y-4">
                      <MerchantQRPayment
                        amount={finalTotal}
                        orderId={`order_${Date.now()}`}
                        merchantName="JITENDER"
                        upiId="9871087168@kotak"
                        upiNumber="9871087168"
                        onPaymentComplete={(transactionId, paymentProof) => {
                          console.log('Payment completed:', transactionId, 'Proof:', paymentProof)
                          setPaymentSuccess(true)
                        }}
                        onPaymentError={(error) => {
                          setError(error)
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Show Wallet Payment if selected */}
                  {showWallet && (
                    <div className="space-y-4">
                      <WalletPayment
                        amount={finalTotal}
                        userId={session?.user?.id || 'demo_user'}
                        orderId={`order_${Date.now()}`}
                        onPaymentComplete={(transactionId) => {
                          console.log('Wallet payment completed:', transactionId)
                          setPaymentSuccess(true)
                        }}
                        onPaymentError={(error) => {
                          setError(error)
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Show Cash on Delivery if selected */}
                  {showCashOnDelivery && (
                    <div className="space-y-4">
                      <Alert className="border-blue-200 bg-blue-50">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          <strong>Cash on Delivery:</strong> Pay with cash when your order arrives. Our delivery partner will collect the payment at your doorstep.
                        </AlertDescription>
                      </Alert>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Cash on Delivery Details:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Please keep exact change ready</li>
                          <li>• Our delivery partner will provide a receipt</li>
                          <li>• Payment to be made in Indian Rupees (INR)</li>
                          <li>• No additional charges for COD</li>
                        </ul>
                      </div>
                      <Button 
                        onClick={() => {
                          // For COD, we directly create the order without payment processing
                          const orderData = {
                            userId: session?.user?.id || "",
                            items: cartItems,
                            totalAmount: finalTotal,
                            status: "confirmed" as const,
                            paymentStatus: "pending" as const, // Payment status is pending for COD
                            deliveryAddress: deliveryInfo,
                            paymentMethod: "cash_on_delivery",
                            transactionId: `cod_${Date.now()}`
                          }
                          
                          PaymentService.createOrder(orderData).then((createdOrder) => {
                            setOrder(createdOrder)
                            setPaymentSuccess(true)
                            setTimeout(() => {
                              router.push(`/thank-you?orderId=${createdOrder.id}`)
                            }, 2000)
                          }).catch((error) => {
                            setError("Failed to create order. Please try again.")
                          })
                        }}
                        disabled={!session}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        Confirm Order with Cash on Delivery
                      </Button>
                    </div>
                  )}
                  
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
            
            {/* Place Order Button - Only show for non-QR code, non-Wallet, and non-COD payments */}
            {!showQRCode && !showWallet && !showCashOnDelivery && (
              <Button 
                onClick={handlePayment}
                disabled={loading || !session}
                className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg"
              >
                {loading ? "Processing Payment..." : `Pay ${formatINRWithRs(finalTotal)}`}
              </Button>
            )}
            
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