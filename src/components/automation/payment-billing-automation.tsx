'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  FileText,
  Bell,
  Wallet,
  Calendar
} from 'lucide-react'

interface PaymentBillingAutomationProps {
  storeId: string
  isAdmin?: boolean
}

interface PaymentAnalytics {
  today: {
    revenue: number
    transactions: number
    successRate: number
  }
  thisMonth: {
    revenue: number
    transactions: number
    successRate: number
    growth: number
  }
  lastMonth: {
    revenue: number
    transactions: number
  }
}

interface RevenueForecast {
  next7Days: number
  next30Days: number
  avgDailyRevenue: number
  trend: 'increasing' | 'decreasing' | 'stable'
}

interface PaymentMethodsStats {
  methods: Array<{
    method: string
    count: number
    amount: number
    percentage: number
    revenuePercentage: number
  }>
  totalTransactions: number
  totalRevenue: number
}

interface BillingSummary {
  pending: {
    count: number
    amount: number
  }
  failed: {
    count: number
    amount: number
  }
  subscriptions: {
    activeCount: number
    monthlyRevenue: number
  }
}

export function PaymentBillingAutomation({ storeId, isAdmin = false }: PaymentBillingAutomationProps) {
  const [paymentAnalytics, setPaymentAnalytics] = useState<PaymentAnalytics | null>(null)
  const [revenueForecast, setRevenueForecast] = useState<RevenueForecast | null>(null)
  const [paymentMethodsStats, setPaymentMethodsStats] = useState<PaymentMethodsStats | null>(null)
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [storeId])

  const fetchData = async () => {
    try {
      const [analyticsRes, forecastRes, methodsRes, billingRes] = await Promise.all([
        fetch(`/api/automation/payments?storeId=${storeId}&action=payment-analytics`),
        fetch(`/api/automation/payments?storeId=${storeId}&action=revenue-forecast`),
        fetch(`/api/automation/payments?storeId=${storeId}&action=payment-methods-stats`),
        fetch(`/api/automation/payments?storeId=${storeId}&action=billing-summary`)
      ])

      const [analyticsData, forecastData, methodsData, billingData] = await Promise.all([
        analyticsRes.json(),
        forecastRes.json(),
        methodsRes.json(),
        billingRes.json()
      ])

      setPaymentAnalytics(analyticsData.analytics)
      setRevenueForecast(forecastData.forecast)
      setPaymentMethodsStats(methodsData.stats)
      setBillingSummary(billingData.summary)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching payment automation data:', error)
    }
  }

  const executeAutomation = async (action: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/automation/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          action
        })
      })

      const result = await response.json()
      console.log(`${action} result:`, result.result)
      
      // Refresh data after automation
      await fetchData()
    } catch (error) {
      console.error(`Error executing ${action}:`, error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`
  const formatPercentage = (percentage: number) => `${percentage.toFixed(1)}%`

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'CREDIT_CARD': return <CreditCard className="h-4 w-4" />
      case 'DEBIT_CARD': return <CreditCard className="h-4 w-4" />
      case 'DIGITAL_WALLET': return <Wallet className="h-4 w-4" />
      case 'CASH_ON_DELIVERY': return <DollarSign className="h-4 w-4" />
      default: return <CreditCard className="h-4 w-4" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600'
      case 'decreasing': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4" />
      case 'decreasing': return <TrendingUp className="h-4 w-4 rotate-180" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payment & Billing Automation</h2>
          <p className="text-gray-600 mt-1">
            Automated payment processing, billing, and financial management
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button 
            onClick={fetchData} 
            variant="outline" 
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(paymentAnalytics?.today.revenue || 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">
                  {formatPercentage(paymentAnalytics?.thisMonth.successRate || 0)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{billingSummary?.pending.count || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold">{billingSummary?.subscriptions.activeCount || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          {isAdmin && <TabsTrigger value="automation">Automation</TabsTrigger>}
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Today's Revenue</span>
                    <span className="font-bold">
                      {formatCurrency(paymentAnalytics?.today.revenue || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>This Month</span>
                    <span className="font-bold">
                      {formatCurrency(paymentAnalytics?.thisMonth.revenue || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Month</span>
                    <span className="font-bold">
                      {formatCurrency(paymentAnalytics?.lastMonth.revenue || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Growth</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {formatPercentage(paymentAnalytics?.thisMonth.growth || 0)}
                      </span>
                      {(paymentAnalytics?.thisMonth.growth || 0) > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentMethodsStats?.methods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(method.method)}
                        <span className="text-sm">
                          {method.method.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(method.amount)}</div>
                        <div className="text-xs text-gray-500">
                          {method.percentage.toFixed(1)}% of transactions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
                <CardDescription>
                  AI-powered revenue predictions based on historical data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-800">
                      {formatCurrency(revenueForecast?.next7Days || 0)}
                    </div>
                    <div className="text-sm text-blue-600">Next 7 Days</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-800">
                      {formatCurrency(revenueForecast?.next30Days || 0)}
                    </div>
                    <div className="text-sm text-green-600">Next 30 Days</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Avg. Daily Revenue</span>
                    <span className="font-bold">
                      {formatCurrency(revenueForecast?.avgDailyRevenue || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Trend</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getTrendColor(revenueForecast?.trend || 'stable')}`}>
                        {revenueForecast?.trend || 'stable'}
                      </span>
                      {getTrendIcon(revenueForecast?.trend || 'stable')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Pending Payments</span>
                    <div className="text-right">
                      <div className="font-bold">{billingSummary?.pending.count || 0}</div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(billingSummary?.pending.amount || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Failed Payments</span>
                    <div className="text-right">
                      <div className="font-bold">{billingSummary?.failed.count || 0}</div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(billingSummary?.failed.amount || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Active Subscriptions</span>
                    <div className="text-right">
                      <div className="font-bold">{billingSummary?.subscriptions.activeCount || 0}</div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(billingSummary?.subscriptions.monthlyRevenue || 0)}/mo
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Billing Operations
              </CardTitle>
              <CardDescription>
                Automated billing, invoicing, and subscription management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">
                    {billingSummary?.pending.count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Pending Payments</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">
                    {billingSummary?.failed.count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Failed Payments</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">
                    {billingSummary?.subscriptions.activeCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">Active Subscriptions</div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Pending Amount</span>
                  </div>
                  <span className="font-bold text-yellow-800">
                    {formatCurrency(billingSummary?.pending.amount || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Failed Amount</span>
                  </div>
                  <span className="font-bold text-red-800">
                    {formatCurrency(billingSummary?.failed.amount || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Monthly Subscription Revenue</span>
                  </div>
                  <span className="font-bold text-green-800">
                    {formatCurrency(billingSummary?.subscriptions.monthlyRevenue || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="automation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Automation Controls
                </CardTitle>
                <CardDescription>
                  Execute automated payment and billing tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => executeAutomation('process-pending-payments')}
                    disabled={loading}
                    className="h-20 flex-col"
                  >
                    <CreditCard className="h-6 w-6 mb-2" />
                    Process Pending Payments
                  </Button>
                  
                  <Button 
                    onClick={() => executeAutomation('auto-refund-failed')}
                    disabled={loading}
                    variant="outline"
                    className="h-20 flex-col"
                  >
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    Auto-Refund Failed
                  </Button>
                  
                  <Button 
                    onClick={() => executeAutomation('generate-invoices')}
                    disabled={loading}
                    variant="outline"
                    className="h-20 flex-col"
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    Generate Invoices
                  </Button>
                  
                  <Button 
                    onClick={() => executeAutomation('send-billing-reminders')}
                    disabled={loading}
                    variant="outline"
                    className="h-20 flex-col"
                  >
                    <Bell className="h-6 w-6 mb-2" />
                    Send Reminders
                  </Button>

                  <Button 
                    onClick={() => executeAutomation('reconcile-payments')}
                    disabled={loading}
                    variant="outline"
                    className="h-20 flex-col"
                  >
                    <CheckCircle className="h-6 w-6 mb-2" />
                    Reconcile Payments
                  </Button>
                  
                  <Button 
                    onClick={() => executeAutomation('update-subscriptions')}
                    disabled={loading}
                    variant="outline"
                    className="h-20 flex-col"
                  >
                    <Calendar className="h-6 w-6 mb-2" />
                    Update Subscriptions
                  </Button>

                  <Button 
                    onClick={() => executeAutomation('process-wallet-transactions')}
                    disabled={loading}
                    variant="outline"
                    className="h-20 flex-col"
                  >
                    <Wallet className="h-6 w-6 mb-2" />
                    Process Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}