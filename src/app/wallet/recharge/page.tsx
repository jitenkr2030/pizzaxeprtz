"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Wallet, 
  CreditCard, 
  QrCode, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ArrowLeft,
  Smartphone
} from "lucide-react"
import { WalletService } from "@/lib/wallet"
import { formatINRWithRs } from "@/lib/currency"
import { MerchantQRPayment } from "@/components/ui/merchant-qr-payment"

export default function WalletRechargePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [walletInfo, setWalletInfo] = useState<{ balance: number; currency: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"qr_code" | "upi">("qr_code")
  const [processing, setProcessing] = useState(false)
  const [showQRPayment, setShowQRPayment] = useState(false)
  const [rechargeSuccess, setRechargeSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    loadWalletInfo()
  }, [session, router])

  const loadWalletInfo = async () => {
    try {
      if (!session?.user?.id) return
      setLoading(true)
      const balance = await WalletService.getBalance(session.user.id)
      setWalletInfo({
        balance,
        currency: 'INR'
      })
    } catch (error) {
      console.error('Error loading wallet info:', error)
      setError('Failed to load wallet information')
    } finally {
      setLoading(false)
    }
  }

  const predefinedAmounts = [100, 200, 500, 1000, 2000]

  const handleRecharge = async () => {
    if (!session?.user?.id) {
      setError('Please sign in to recharge your wallet')
      return
    }

    const amount = parseFloat(rechargeAmount)
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (amount < 10) {
      setError('Minimum recharge amount is Rs. 10')
      return
    }

    if (paymentMethod === 'qr_code') {
      setShowQRPayment(true)
      return
    }

    setProcessing(true)
    setError(null)

    try {
      const result = await WalletService.rechargeWallet({
        amount,
        paymentMethod,
        userId: session.user.id
      })

      if (result.success) {
        setRechargeSuccess(true)
        if (result.wallet) {
          setWalletInfo({
            balance: result.wallet.balance,
            currency: result.wallet.currency
          })
        }
      } else {
        setError(result.error || 'Recharge failed')
      }
    } catch (error) {
      setError('Failed to process recharge')
    } finally {
      setProcessing(false)
    }
  }

  const handleQRPaymentComplete = (transactionId: string, paymentProof?: string) => {
    console.log('QR Payment completed:', transactionId, paymentProof)
    // Process the wallet recharge
    processWalletRecharge()
  }

  const processWalletRecharge = async () => {
    if (!session?.user?.id) return

    const amount = parseFloat(rechargeAmount)
    setProcessing(true)
    setError(null)

    try {
      const result = await WalletService.rechargeWallet({
        amount,
        paymentMethod: 'qr_code',
        userId: session.user.id
      })

      if (result.success) {
        setRechargeSuccess(true)
        setShowQRPayment(false)
        if (result.wallet) {
          setWalletInfo({
            balance: result.wallet.balance,
            currency: result.wallet.currency
          })
        }
      } else {
        setError(result.error || 'Recharge failed')
      }
    } catch (error) {
      setError('Failed to process recharge')
    } finally {
      setProcessing(false)
    }
  }

  const handleQRPaymentError = (error: string) => {
    setError(error)
    setShowQRPayment(false)
  }

  if (rechargeSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Wallet Recharged Successfully!</h2>
            <p className="text-gray-600 mb-4">
              Your wallet has been recharged with {formatINRWithRs(parseFloat(rechargeAmount))}
            </p>
            {walletInfo && (
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  Current Balance: {formatINRWithRs(walletInfo.balance)}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Button onClick={() => router.push('/wallet')} className="w-full">
                View Wallet
              </Button>
              <Button onClick={() => router.push('/checkout')} variant="outline" className="w-full">
                Back to Checkout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading wallet information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Recharge Wallet</h1>
          <p className="text-gray-600 mt-2">Add money to your wallet for easy payments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Wallet Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {walletInfo ? (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {formatINRWithRs(walletInfo.balance)}
                    </div>
                    <p className="text-sm text-gray-600">Available for payments</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    Unable to load wallet information
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recharge Amount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount">Enter Amount (Rs.)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="10"
                    step="1"
                  />
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Quick Select</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {predefinedAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setRechargeAmount(amount.toString())}
                        className="text-sm"
                      >
                        {formatINRWithRs(amount)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={(value: "qr_code" | "upi") => setPaymentMethod(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qr_code">QR Code</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {!showQRPayment && (
                  <Button 
                    onClick={handleRecharge}
                    disabled={!rechargeAmount || processing}
                    className="w-full"
                    size="lg"
                  >
                    {processing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Recharge Wallet
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recharge Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Quick checkout payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">No extra transaction fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Track all payments in one place</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Secure and instant payments</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Payment Section */}
          <div className="space-y-6">
            {showQRPayment ? (
              <MerchantQRPayment
                amount={parseFloat(rechargeAmount)}
                orderId={`recharge_${Date.now()}`}
                merchantName="JITENDER"
                upiId="9871087168@kotak"
                upiNumber="9871087168"
                onPaymentComplete={handleQRPaymentComplete}
                onPaymentError={handleQRPaymentError}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="h-5 w-5 mr-2" />
                    QR Code Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center mb-4">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                    <p className="text-gray-600">
                      Select QR Code as payment method and enter amount to see the payment QR code
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">How to recharge with QR code:</h4>
                    <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Enter recharge amount and select QR Code payment</li>
                      <li>Scan the QR code with any UPI app</li>
                      <li>Pay the exact amount shown</li>
                      <li>Upload payment screenshot and transaction ID</li>
                      <li>Wallet will be recharged after verification</li>
                    </ol>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}