"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Wallet, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  CreditCard,
  RefreshCw,
  ArrowUpRight
} from "lucide-react"
import { formatINRWithRs } from "@/lib/currency"

interface WalletPaymentProps {
  amount: number
  userId: string
  orderId: string
  onPaymentComplete?: (transactionId: string) => void
  onPaymentError?: (error: string) => void
}

interface WalletBalance {
  balance: number
  currency: string
  lastUpdated: string
}

export function WalletPayment({
  amount,
  userId,
  orderId,
  onPaymentComplete,
  onPaymentError
}: WalletPaymentProps) {
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null)
  const [loading, setLoading] = useState(false)
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [showRecharge, setShowRecharge] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle')

  useEffect(() => {
    fetchWalletBalance()
  }, [userId])

  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(`/api/wallet/balance?userId=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setWalletBalance(data.balance)
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error)
    }
  }

  const handleWalletPayment = async () => {
    if (!walletBalance || walletBalance.balance < amount) {
      onPaymentError?.('Insufficient wallet balance')
      return
    }

    setLoading(true)
    setPaymentStatus('processing')

    try {
      const response = await fetch('/api/wallet/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount,
          orderId,
          currency: 'INR'
        })
      })

      const data = await response.json()

      if (data.success) {
        setPaymentStatus('completed')
        onPaymentComplete?.(data.transactionId)
        
        // Refresh wallet balance
        await fetchWalletBalance()
      } else {
        setPaymentStatus('failed')
        onPaymentError?.(data.error || 'Wallet payment failed')
      }
    } catch (error) {
      setPaymentStatus('failed')
      onPaymentError?.('Error processing wallet payment')
    } finally {
      setLoading(false)
    }
  }

  const handleRecharge = async () => {
    const amountValue = parseFloat(rechargeAmount)
    if (!amountValue || amountValue <= 0) {
      onPaymentError?.('Please enter a valid recharge amount')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/wallet/recharge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount: amountValue,
          currency: 'INR'
        })
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to QR code payment for recharge
        window.location.href = `/wallet-recharge?amount=${amountValue}&userId=${userId}&sessionId=${data.sessionId}`
      } else {
        onPaymentError?.(data.error || 'Failed to initiate wallet recharge')
      }
    } catch (error) {
      onPaymentError?.('Error initiating wallet recharge')
    } finally {
      setLoading(false)
    }
  }

  const canPay = walletBalance && walletBalance.balance >= amount
  const balanceShortage = walletBalance ? Math.max(0, amount - walletBalance.balance) : 0

  if (paymentStatus === 'completed') {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
          <p className="text-gray-600">Your wallet payment has been processed</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Wallet Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {walletBalance ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Balance:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatINRWithRs(walletBalance.balance)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Last Updated:</span>
                <span>{new Date(walletBalance.lastUpdated).toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading wallet balance...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Amount */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Order Amount:</span>
            <span className="text-lg font-semibold">{formatINRWithRs(amount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Balance Status */}
      {walletBalance && (
        <Card>
          <CardContent className="p-4">
            {canPay ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Sufficient balance available</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Insufficient balance</span>
                </div>
                <p className="text-sm text-gray-600">
                  You need {formatINRWithRs(balanceShortage)} more to complete this payment
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleWalletPayment}
          disabled={!canPay || loading || paymentStatus === 'processing'}
          className="w-full"
        >
          {loading && paymentStatus === 'processing' ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay with Wallet
            </>
          )}
        </Button>

        {!canPay && walletBalance && (
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => setShowRecharge(!showRecharge)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Recharge Wallet
            </Button>

            {showRecharge && (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <Label htmlFor="rechargeAmount">Recharge Amount</Label>
                    <Input
                      id="rechargeAmount"
                      type="number"
                      value={rechargeAmount}
                      onChange={(e) => setRechargeAmount(e.target.value)}
                      placeholder="Enter amount to recharge"
                      min="1"
                      step="0.01"
                    />
                  </div>
                  <Button
                    onClick={handleRecharge}
                    disabled={!rechargeAmount || loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Recharge Now
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Minimum recharge: ₹1.00
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Wallet Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Wallet Benefits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Instant payments</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>No transaction fees</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Secure transactions</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Easy recharge options</span>
          </div>
        </CardContent>
      </Card>

      {paymentStatus === 'failed' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Payment failed. Please try again or recharge your wallet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}