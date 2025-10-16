"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  QrCode, 
  Copy, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Smartphone,
  AlertCircle,
  Download
} from "lucide-react"
import { QRCodeService, QRCodePaymentData } from "@/lib/qrcode"
import { formatINRWithRs } from "@/lib/currency"

interface QRCodePaymentProps {
  amount: number
  orderId: string
  upiId?: string
  merchantName?: string
  onPaymentComplete?: (transactionId: string) => void
  onPaymentError?: (error: string) => void
}

interface PaymentStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  message: string
  transactionId?: string
}

export function QRCodePayment({
  amount,
  orderId,
  upiId,
  merchantName,
  onPaymentComplete,
  onPaymentError
}: QRCodePaymentProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: 'pending',
    message: 'Waiting for payment...'
  })
  const [paymentData, setPaymentData] = useState<QRCodePaymentData | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(900) // 15 minutes in seconds
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    generateQRCode()
    
    // Cleanup on unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [amount, orderId, upiId, merchantName])

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

      // Start polling for payment status
      const pollInterval = setInterval(async () => {
        await checkPaymentStatus()
      }, 5000) // Check every 5 seconds

      setPollingInterval(pollInterval)

      return () => {
        clearInterval(timer)
        if (pollInterval) clearInterval(pollInterval)
      }
    } else if (paymentStatus.status === 'completed') {
      // Stop polling when payment is completed
      if (pollingInterval) {
        clearInterval(pollingInterval)
        setPollingInterval(null)
      }
    }
  }, [paymentStatus.status])

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payment/qrcode?orderId=${orderId}`)
      const data = await response.json()
      
      if (data.success && data.paymentStatus) {
        const status = data.paymentStatus.status
        
        if (status === 'completed') {
          setPaymentStatus({
            status: 'completed',
            message: 'Payment completed successfully!',
            transactionId: data.paymentStatus.transactionId
          })
          onPaymentComplete?.(data.paymentStatus.transactionId)
        } else if (status === 'failed') {
          setPaymentStatus({
            status: 'failed',
            message: data.paymentStatus.message || 'Payment failed'
          })
          onPaymentError?.(data.paymentStatus.message || 'Payment failed')
        } else if (status === 'processing') {
          setPaymentStatus({
            status: 'processing',
            message: 'Payment is being processed...'
          })
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
    }
  }

  const generateQRCode = async () => {
    setLoading(true)
    try {
      const data = QRCodeService.createOrderPaymentData(
        orderId,
        amount,
        upiId,
        merchantName
      )
      
      setPaymentData(data)
      const qrDataURL = await QRCodeService.generateQRCodeDataURL(data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      setQrCodeDataURL(qrDataURL)
      setPaymentStatus({
        status: 'pending',
        message: 'Scan QR code to pay'
      })
      setTimeRemaining(900)
    } catch (error) {
      setPaymentStatus({
        status: 'failed',
        message: 'Failed to generate QR code'
      })
      onPaymentError?.('Failed to generate QR code')
    } finally {
      setLoading(false)
    }
  }

  const copyUPIId = async () => {
    if (paymentData?.upiId) {
      try {
        await navigator.clipboard.writeText(paymentData.upiId)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Failed to copy UPI ID:', error)
      }
    }
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const downloadQRCode = () => {
    if (qrCodeDataURL) {
      const link = document.createElement('a')
      link.download = `pizzaxperts-payment-${orderId}.png`
      link.href = qrCodeDataURL
      link.click()
    }
  }

  const getStatusColor = () => {
    switch (paymentStatus.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
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
      case 'processing':
        return <RefreshCw className="h-3 w-3 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-3 w-3" />
      case 'failed':
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Generating QR code...</p>
        </CardContent>
      </Card>
    )
  }

  if (paymentStatus.status === 'failed') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Payment Failed</h3>
          <p className="text-gray-600 mb-4">{paymentStatus.message}</p>
          <Button onClick={generateQRCode} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            QR Code Payment
          </span>
          <Badge className={getStatusColor()}>
            {getStatusIcon()}
            <span className="ml-1 capitalize">{paymentStatus.status}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
            {qrCodeDataURL && (
              <img 
                src={qrCodeDataURL} 
                alt="Payment QR Code" 
                className="w-64 h-64"
              />
            )}
          </div>
          
          <div className="mt-4 flex justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={downloadQRCode}
            >
              <Download className="h-4 w-4 mr-2" />
              Save QR
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateQRCode}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="font-semibold text-lg">{formatINRWithRs(amount)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Order ID:</span>
            <span className="font-mono text-sm">{orderId}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">UPI ID:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{paymentData?.upiId}</span>
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
            <span className="text-sm text-gray-600">Time remaining:</span>
            <span className="font-mono text-sm text-orange-600">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <Separator />

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
              <span>Scan the QR code above</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                <CheckCircle className="h-3 w-3 text-blue-600" />
              </div>
              <span>Confirm payment and wait for verification</span>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <Alert>
          <AlertDescription className="text-center">
            {paymentStatus.message}
          </AlertDescription>
        </Alert>

        {/* Auto-refresh simulation */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            This page will automatically check for payment confirmation
          </p>
        </div>
      </CardContent>
    </Card>
  )
}