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
  QrCode, 
  Copy, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Smartphone,
  AlertCircle,
  Download,
  Upload,
  CreditCard
} from "lucide-react"
import { formatINRWithRs } from "@/lib/currency"

interface MerchantQRPaymentProps {
  amount: number
  orderId: string
  merchantName?: string
  upiId?: string
  upiNumber?: string
  onPaymentComplete?: (transactionId: string, paymentProof?: string) => void
  onPaymentError?: (error: string) => void
}

interface PaymentStatus {
  status: 'pending' | 'uploading' | 'verifying' | 'completed' | 'failed'
  message: string
  transactionId?: string
}

export function MerchantQRPayment({
  amount,
  orderId,
  merchantName = "JITENDER",
  upiId = "9871087168@kotak",
  upiNumber = "9871087168",
  onPaymentComplete,
  onPaymentError
}: MerchantQRPaymentProps) {
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: 'pending',
    message: 'Pay using QR code below'
  })
  const [timeRemaining, setTimeRemaining] = useState(900) // 15 minutes in seconds
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [transactionId, setTransactionId] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (paymentStatus.status === 'pending') {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setPaymentStatus({
              status: 'failed',
              message: 'Payment session expired. Please refresh to try again.'
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [paymentStatus.status])

  const copyUPIId = async () => {
    try {
      await navigator.clipboard.writeText(upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy UPI ID:', error)
    }
  }

  const copyUPINumber = async () => {
    try {
      await navigator.clipboard.writeText(upiNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy UPI Number:', error)
    }
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setPaymentProof(file)
        setPaymentStatus({
          status: 'uploading',
          message: 'Payment proof uploaded. Please enter transaction ID.'
        })
      } else {
        onPaymentError?.('Please upload a valid image file')
      }
    }
  }

  const handlePaymentVerification = async () => {
    if (!paymentProof) {
      onPaymentError?.('Please upload payment proof screenshot')
      return
    }

    if (!transactionId.trim()) {
      onPaymentError?.('Please enter transaction ID')
      return
    }

    setIsUploading(true)
    setPaymentStatus({
      status: 'verifying',
      message: 'Verifying payment...'
    })

    try {
      // Call payment proof verification API
      const response = await fetch('/api/payment/verify-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          transactionId: transactionId.trim(),
          amount,
          paymentProof: paymentProof.name
        })
      })

      const data = await response.json()

      if (data.success) {
        setPaymentStatus({
          status: 'completed',
          message: 'Payment verified successfully!',
          transactionId: transactionId
        })
        
        // Call completion callback
        onPaymentComplete?.(transactionId, paymentProof.name)
      } else {
        setPaymentStatus({
          status: 'failed',
          message: data.error || 'Payment verification failed. Please try again.'
        })
        onPaymentError?.(data.error || 'Payment verification failed')
      }
    } catch (error) {
      setPaymentStatus({
        status: 'failed',
        message: 'Error verifying payment'
      })
      onPaymentError?.('Error verifying payment')
    } finally {
      setIsUploading(false)
    }
  }

  const getStatusColor = () => {
    switch (paymentStatus.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'uploading':
        return 'bg-blue-100 text-blue-800'
      case 'verifying':
        return 'bg-purple-100 text-purple-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = () => {
    switch (paymentStatus.status) {
      case 'pending':
        return <Clock className="h-3 w-3" />
      case 'uploading':
        return <Upload className="h-3 w-3" />
      case 'verifying':
        return <RefreshCw className="h-3 w-3 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-3 w-3" />
      case 'failed':
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const resetPayment = () => {
    setPaymentProof(null)
    setTransactionId("")
    setPaymentStatus({
      status: 'pending',
      message: 'Pay using QR code below'
    })
    setTimeRemaining(900)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            UPI Payment
          </span>
          <Badge className={getStatusColor()}>
            {getStatusIcon()}
            <span className="ml-1 capitalize">{paymentStatus.status}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* QR Code Display with Amount Overlay */}
        <div className="text-center relative">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-300 inline-block relative">
            <img 
              src="/images/merchant-qr-code.png" 
              alt="Merchant QR Code" 
              className="w-64 h-64"
            />
            {/* Amount Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
              <div className="text-white text-center">
                <p className="text-sm font-medium">Pay Amount</p>
                <p className="text-2xl font-bold">{formatINRWithRs(amount)}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const link = document.createElement('a')
                link.href = '/images/merchant-qr-code.png'
                link.download = `merchant-qr-code.png`
                link.click()
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Save QR
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetPayment}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="font-semibold text-lg text-orange-600">{formatINRWithRs(amount)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Order ID:</span>
            <span className="font-mono text-sm">{orderId}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Merchant:</span>
            <span className="font-medium">{merchantName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">UPI ID:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{upiId}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyUPIId}
                className="h-6 w-6 p-0"
              >
                {copied ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">UPI Number:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{upiNumber}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyUPINumber}
                className="h-6 w-6 p-0"
              >
                {copied ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Time remaining:</span>
            <span className="font-mono text-sm text-orange-600">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <Separator />

        {/* Payment Proof Upload */}
        {paymentStatus.status !== 'completed' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="paymentProof">Upload Payment Screenshot</Label>
              <Input
                id="paymentProof"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="mt-2"
                disabled={isUploading}
              />
              {paymentProof && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ {paymentProof.name} uploaded
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="transactionId">Transaction ID (UPI Reference)</Label>
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter UPI transaction ID"
                className="mt-2"
                disabled={isUploading}
              />
            </div>
            
            <Button 
              onClick={handlePaymentVerification}
              disabled={!paymentProof || !transactionId.trim() || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Verifying Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Verify Payment
                </>
              )}
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">How to pay:</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                <Smartphone className="h-3 w-3 text-blue-600" />
              </div>
              <span>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                <QrCode className="h-3 w-3 text-blue-600" />
              </div>
              <span>Scan the QR code above or use UPI ID/Number</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                <CreditCard className="h-3 w-3 text-blue-600" />
              </div>
              <span>Enter exact amount: {formatINRWithRs(amount)}</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                <Upload className="h-3 w-3 text-blue-600" />
              </div>
              <span>Upload payment screenshot and enter transaction ID</span>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <Alert>
          <AlertDescription className="text-center">
            {paymentStatus.message}
          </AlertDescription>
        </Alert>

        {/* Success Message */}
        {paymentStatus.status === 'completed' && (
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-green-600 font-medium">Payment verified successfully!</p>
            <p className="text-sm text-gray-600">Transaction ID: {transactionId}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}