"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QRCodePayment } from "@/components/ui/qrcode-payment"
import { formatINRWithRs } from "@/lib/currency"

export default function QRCodeDemoPage() {
  const [showPayment, setShowPayment] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)

  const demoAmount = 599 // Rs. 599
  const demoOrderId = "demo_order_" + Date.now()

  const handlePaymentComplete = (txnId: string) => {
    setTransactionId(txnId)
    setPaymentCompleted(true)
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
    alert("Payment failed: " + error)
  }

  const resetDemo = () => {
    setShowPayment(false)
    setPaymentCompleted(false)
    setTransactionId(null)
  }

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your demo payment has been completed</p>
            <div className="space-y-2 text-sm">
              <p><strong>Amount:</strong> {formatINRWithRs(demoAmount)}</p>
              <p><strong>Transaction ID:</strong> {transactionId}</p>
              <p><strong>Order ID:</strong> {demoOrderId}</p>
            </div>
            <Button onClick={resetDemo} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">QR Code Payment Demo</h1>
          <p className="text-lg text-gray-600">
            Experience the QR code payment system for PizzaXperts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Select QR Code Payment</h4>
                      <p className="text-sm text-gray-600">Choose QR Code as your payment method</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Scan QR Code</h4>
                      <p className="text-sm text-gray-600">Use any UPI app to scan the generated QR code</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Complete Payment</h4>
                      <p className="text-sm text-gray-600">Confirm payment in your UPI app</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Automatic Verification</h4>
                      <p className="text-sm text-gray-600">System automatically verifies and confirms payment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Secure UPI integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Real-time payment verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">15-minute payment session</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Automatic status polling</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">QR code download option</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demo Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Demo Amount:</span>
                  <span className="font-semibold">{formatINRWithRs(demoAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-sm">{demoOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">UPI ID:</span>
                  <span className="font-mono text-sm">pizzaxperts@ybl</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Merchant:</span>
                  <span className="font-medium">PizzaXperts</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code Payment Demo */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Try QR Code Payment</CardTitle>
              </CardHeader>
              <CardContent>
                {!showPayment ? (
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h7v7H3zm11 0h7v7h-7zM3 11h7v7H3zm11 0h7v7h-7z"/>
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      Click the button below to start the QR code payment demo
                    </p>
                    <Button 
                      onClick={() => setShowPayment(true)}
                      className="w-full"
                    >
                      Start QR Code Payment Demo
                    </Button>
                  </div>
                ) : (
                  <QRCodePayment
                    amount={demoAmount}
                    orderId={demoOrderId}
                    upiId="pizzaxperts@ybl"
                    merchantName="PizzaXperts"
                    onPaymentComplete={handlePaymentComplete}
                    onPaymentError={handlePaymentError}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supported UPI Apps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">GP</span>
                    </div>
                    <span className="text-xs">Google Pay</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">PP</span>
                    </div>
                    <span className="text-xs">PhonePe</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">PT</span>
                    </div>
                    <span className="text-xs">Paytm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}