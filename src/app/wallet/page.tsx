"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Wallet, 
  CreditCard, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  TrendingUp
} from "lucide-react"
import { WalletService } from "@/lib/wallet"
import { formatINRWithRs } from "@/lib/currency"

interface WalletTransaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  reference?: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
  metadata?: {
    orderId?: string
    paymentMethod?: string
    transactionId?: string
  }
}

export default function WalletPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [walletInfo, setWalletInfo] = useState<{ balance: number; currency: string } | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    loadWalletData()
  }, [session, router])

  const loadWalletData = async () => {
    try {
      if (!session?.user?.id) return
      setLoading(true)
      
      const walletDetails = await WalletService.getWalletDetails(session.user.id)
      setWalletInfo({
        balance: walletDetails.wallet.balance,
        currency: walletDetails.wallet.currency
      })
      setTransactions(walletDetails.recentTransactions)
    } catch (error) {
      console.error('Error loading wallet data:', error)
      setError('Failed to load wallet information')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3" />
      case 'pending':
        return <Clock className="h-3 w-3" />
      case 'failed':
        return <div className="h-3 w-3 bg-red-500 rounded-full" />
      default:
        return <div className="h-3 w-3 bg-gray-500 rounded-full" />
    }
  }

  const getTransactionIcon = (type: 'credit' | 'debit') => {
    return type === 'credit' ? (
      <ArrowDownRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowUpRight className="h-4 w-4 text-red-600" />
    )
  }

  const getTransactionAmountColor = (type: 'credit' | 'debit') => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600'
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600 mt-2">Manage your wallet balance and view transaction history</p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wallet Balance Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Wallet className="h-5 w-5 mr-2" />
                  Wallet Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-blue-100 text-sm">Available Balance</p>
                  <p className="text-3xl font-bold">
                    {walletInfo ? formatINRWithRs(walletInfo.balance) : 'Rs. 0.00'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => router.push('/wallet/recharge')}
                    className="w-full bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Recharge Wallet
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={loadWalletData}
                    className="w-full border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Transactions</span>
                  <span className="font-medium">{transactions.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Credits</span>
                  <span className="font-medium text-green-600">
                    {formatINRWithRs(
                      transactions
                        .filter(t => t.type === 'credit' && t.status === 'completed')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Debits</span>
                  <span className="font-medium text-red-600">
                    {formatINRWithRs(
                      transactions
                        .filter(t => t.type === 'debit' && t.status === 'completed')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Transaction History
                  </span>
                  <Button variant="outline" size="sm" onClick={loadWalletData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No transactions yet</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Recharge your wallet to get started
                    </p>
                    <Button onClick={() => router.push('/wallet/recharge')}>
                      Recharge Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {transaction.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <p className="text-sm text-gray-500">
                                {formatDate(transaction.createdAt)}
                              </p>
                              <Badge className={getStatusColor(transaction.status)}>
                                {getStatusIcon(transaction.status)}
                                <span className="ml-1 capitalize text-xs">
                                  {transaction.status}
                                </span>
                              </Badge>
                              {transaction.metadata?.transactionId && (
                                <p className="text-xs text-gray-400 font-mono">
                                  ID: {transaction.metadata.transactionId.slice(-8)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${getTransactionAmountColor(transaction.type)}`}>
                            {transaction.type === 'credit' ? '+' : '-'}
                            {formatINRWithRs(transaction.amount)}
                          </p>
                          {transaction.metadata?.paymentMethod && (
                            <p className="text-xs text-gray-500 mt-1">
                              {transaction.metadata.paymentMethod}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Wallet Benefits */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Wallet Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Quick Payments</h3>
                <p className="text-sm text-gray-600">
                  Pay instantly without entering payment details
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">Secure</h3>
                <p className="text-sm text-gray-600">
                  Your money is safe with secure transactions
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">Track Expenses</h3>
                <p className="text-sm text-gray-600">
                  Monitor all your transactions in one place
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-medium mb-2">Easy Recharge</h3>
                <p className="text-sm text-gray-600">
                  Recharge anytime using multiple payment methods
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}