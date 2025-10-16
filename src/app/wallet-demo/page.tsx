"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WalletPayment } from "@/components/ui/wallet-payment"
import { MerchantQRPayment } from "@/components/ui/merchant-qr-payment"
import { formatINRWithRs } from "@/lib/currency"

export default function WalletDemoPage() {
  const [selectedDemo, setSelectedDemo] = useState<'wallet' | 'qr'>('wallet')
  const [showPayment, setShowPayment] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)

  const demoAmount = 599 // Rs. 599
  const demoOrderId = "demo_order_" + Date.now()
  const userId = "demo_user"

  const handleWalletPaymentComplete = (txnId: string) => {
    setTransactionId(txnId)
    setPaymentCompleted(true)
  }

  const handleQRPaymentComplete = (txnId: string, proof?: string) => {
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
            <p className="text-gray-600 mb-4">
              Your {selectedDemo === 'wallet' ? 'wallet' : 'QR code'} payment has been completed
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Amount:</strong> {formatINRWithRs(demoAmount)}</p>
              <p><strong>Transaction ID:</strong> {transactionId}</p>
              <p><strong>Order ID:</strong> {demoOrderId}</p>
              <p><strong>Payment Method:</strong> {selectedDemo === 'wallet' ? 'Wallet' : 'QR Code'}</p>
            </div>
            <Button onClick={resetDemo} className="mt-4">
              Try Another Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Wallet & QR Code Payment System</h1>
          <p className="text-lg text-gray-600">
            Experience the complete payment system with wallet functionality and QR code payments
          </p>
        </div>

        {/* Payment Method Selection */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setSelectedDemo('wallet')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedDemo === 'wallet'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Wallet Payment
            </button>
            <button
              onClick={() => setSelectedDemo('qr')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedDemo === 'qr'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              QR Code Payment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Information */}
          <div className="space-y-6">
            {selectedDemo === 'wallet' ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Wallet Payment System</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Check Wallet Balance</h4>
                          <p className="text-sm text-gray-600">View your current wallet balance in real-time</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Pay with Wallet</h4>
                          <p className="text-sm text-gray-600">Use wallet balance for instant payments</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Recharge if Needed</h4>
                          <p className="text-sm text-gray-600">Recharge wallet using QR code if balance is insufficient</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-sm">4</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Instant Confirmation</h4>
                          <p className="text-sm text-gray-600">Get immediate payment confirmation</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Wallet Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Instant payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">No transaction fees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Secure transactions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Easy recharge options</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Balance management</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Wallet Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Demo User Balance:</span>
                      <Badge className="bg-green-100 text-green-800">₹1,000.00</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Minimum Recharge:</span>
                      <span className="font-medium">₹1.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recharge Method:</span>
                      <span className="font-medium">QR Code Payment</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction Speed:</span>
                      <span className="font-medium">Instant</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>QR Code Payment System</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 font-semibold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Scan QR Code</h4>
                          <p className="text-sm text-gray-600">Scan merchant QR code with any UPI app</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 font-semibold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Pay Exact Amount</h4>
                          <p className="text-sm text-gray-600">Pay the exact order amount via UPI</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 font-semibold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Upload Proof</h4>
                          <p className="text-sm text-gray-600">Upload payment screenshot and enter transaction ID</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 font-semibold text-sm">4</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Get Verified</h4>
                          <p className="text-sm text-gray-600">System verifies payment and confirms order</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Merchant Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Merchant Name:</span>
                      <span className="font-semibold">JITENDER</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">UPI ID:</span>
                      <span className="font-mono text-sm">9871087168@kotak</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">UPI Number:</span>
                      <span className="font-mono text-sm">9871087168</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank:</span>
                      <span className="font-medium">Kotak Bank</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Payment proof verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Transaction ID validation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Amount verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Secure file upload</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">15-minute session timeout</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Payment Demo */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDemo === 'wallet' ? 'Try Wallet Payment' : 'Try QR Code Payment'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showPayment ? (
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                      {selectedDemo === 'wallet' ? (
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      ) : (
                        <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 3h7v7H3zm11 0h7v7h-7zM3 11h7v7H3zm11 0h7v7h-7z"/>
                        </svg>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        {selectedDemo === 'wallet' 
                          ? 'Experience the complete wallet payment system with balance management and recharge functionality'
                          : 'Experience the complete QR code payment system with payment verification'
                        }
                      </p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Demo Amount:</strong> {formatINRWithRs(demoAmount)}
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowPayment(true)}
                      className="w-full"
                    >
                      {selectedDemo === 'wallet' ? 'Start Wallet Payment Demo' : 'Start QR Code Payment Demo'}
                    </Button>
                  </div>
                ) : (
                  <>
                    {selectedDemo === 'wallet' ? (
                      <WalletPayment
                        amount={demoAmount}
                        userId={userId}
                        orderId={demoOrderId}
                        onPaymentComplete={handleWalletPaymentComplete}
                        onPaymentError={handlePaymentError}
                      />
                    ) : (
                      <MerchantQRPayment
                        amount={demoAmount}
                        orderId={demoOrderId}
                        merchantName="JITENDER"
                        upiId="9871087168@kotak"
                        upiNumber="9871087168"
                        onPaymentComplete={handleQRPaymentComplete}
                        onPaymentError={handlePaymentError}
                      />
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-1">Wallet Payment</h4>
                      <div className="space-y-1 text-xs text-blue-700">
                        <div>✓ Instant</div>
                        <div>✓ No fees</div>
                        <div>✓ Secure</div>
                        <div>✓ Balance mgmt</div>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-1">QR Code Payment</h4>
                      <div className="space-y-1 text-xs text-purple-700">
                        <div>✓ Universal</div>
                        <div>✓ Verified</div>
                        <div>✓ Secure</div>
                        <div>✓ Proof-based</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Both payment methods are fully integrated and ready for production use
                    </p>
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