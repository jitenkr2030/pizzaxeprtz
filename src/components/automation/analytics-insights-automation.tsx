'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  FileText, 
  Settings, 
  RefreshCw,
  Target,
  Users,
  DollarSign,
  ShoppingBag,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Eye,
  Download,
  Calendar,
  Lightbulb,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react'

interface AnalyticsDashboard {
  overview: {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    customerCount: number
    repeatCustomerRate: number
    growthRate: number
  }
  revenue: {
    daily: Array<{
      date: string
      revenue: number
      orders: number
    }>
    weekly: Array<{
      week: string
      revenue: number
      orders: number
    }>
    monthly: Array<{
      month: string
      revenue: number
      orders: number
    }>
  }
  customerAnalytics: {
    acquisition: Array<{
      channel: string
      customers: number
      cost: number
    }>
    retention: {
      newCustomers: number
      returningCustomers: number
      churnRate: number
      lifetimeValue: number
    }
    demographics: {
      ageGroups: Array<{
        range: string
        percentage: number
      }>
      locations: Array<{
        city: string
        customers: number
      }>
    }
  }
  productAnalytics: {
    topSelling: Array<{
      productId: string
      name: string
      quantity: number
      revenue: number
    }>
    categoryPerformance: Array<{
      category: string
      orders: number
      revenue: number
      growth: number
    }>
    recommendations: Array<{
      type: string
      message: string
      impact: 'high' | 'medium' | 'low'
    }>
  }
}

interface PredictiveAnalytics {
  demandForecast: {
    daily: Array<{
      date: string
      predictedOrders: number
      confidence: number
    }>
    weekly: Array<{
      week: string
      predictedOrders: number
      confidence: number
    }>
  }
  revenueForecast: {
    monthly: Array<{
      month: string
      predictedRevenue: number
      confidence: number
    }>
    quarterly: Array<{
      quarter: string
      predictedRevenue: number
      confidence: number
    }>
  }
  customerBehavior: {
    churnPrediction: Array<{
      customerId: string
      riskLevel: 'high' | 'medium' | 'low'
      probability: number
      reasons: string[]
    }>
    lifetimeValuePrediction: Array<{
      customerId: string
      predictedLTV: number
      confidence: number
    }>
    purchasePrediction: Array<{
      customerId: string
      likelyToPurchase: boolean
      probability: number
      timeframe: string
    }>
  }
  inventoryOptimization: {
    stockRecommendations: Array<{
      productId: string
      currentStock: number
      recommendedStock: number
      reason: string
      priority: 'high' | 'medium' | 'low'
    }>
    wasteReduction: Array<{
      productId: string
      currentWaste: number
      potentialReduction: number
      strategy: string
    }>
  }
}

interface AutomatedReports {
  scheduled: Array<{
    id: string
    name: string
    type: 'daily' | 'weekly' | 'monthly' | 'quarterly'
    recipients: string[]
    format: 'pdf' | 'excel' | 'email'
    lastGenerated: string
    nextGeneration: string
    isActive: boolean
  }>
  templates: Array<{
    id: string
    name: string
    description: string
    sections: string[]
    metrics: string[]
    charts: string[]
  }>
}

export function AnalyticsInsightsAutomation({ storeId, isAdmin = false }: { storeId: string; isAdmin?: boolean }) {
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null)
  const [predictive, setPredictive] = useState<PredictiveAnalytics | null>(null)
  const [reports, setReports] = useState<AutomatedReports | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily')

  useEffect(() => {
    loadAnalyticsData()
  }, [storeId])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      const [dashboardRes, predictiveRes, reportsRes] = await Promise.all([
        fetch(`/api/automation/analytics-insights?storeId=${storeId}&action=dashboard`),
        fetch(`/api/automation/analytics-insights?storeId=${storeId}&action=predictive`),
        fetch(`/api/automation/analytics-insights?storeId=${storeId}&action=reports`)
      ])

      const [dashboardData, predictiveData, reportsData] = await Promise.all([
        dashboardRes.json(),
        predictiveRes.json(),
        reportsRes.json()
      ])

      setDashboard(dashboardData.dashboard)
      setPredictive(predictiveData.predictive)
      setReports(reportsData.reports)
    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async (reportType: string) => {
    try {
      const response = await fetch(`/api/automation/analytics-insights?storeId=${storeId}&action=generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: `${reportType} Report`,
          type: reportType,
          dataPoints: 1000
        })
      })
      const data = await response.json()
      if (data.report) {
        alert(`Report generated successfully! Download URL: ${data.report.downloadUrl}`)
      }
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  const handleGenerateInsights = async () => {
    try {
      const response = await fetch(`/api/automation/analytics-insights?storeId=${storeId}&action=generate-insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          data: { revenue: dashboard?.overview.totalRevenue, orders: dashboard?.overview.totalOrders }
        })
      })
      const data = await response.json()
      if (data.insights) {
        alert(`AI Insights Generated:\n\nKey Insights:\n${data.insights.insights.join('\n')}\n\nOpportunities:\n${data.insights.opportunities.join('\n')}`)
      }
    } catch (error) {
      console.error('Error generating insights:', error)
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${dashboard.overview.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{dashboard.overview.growthRate}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.overview.totalOrders.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Avg: ${dashboard.overview.averageOrderValue.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.overview.customerCount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {dashboard.overview.repeatCustomerRate}% repeat rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">
                Automation score
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            {dashboard && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Revenue Trend</CardTitle>
                      <CardDescription>Revenue over time</CardDescription>
                    </div>
                    <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dashboard.revenue[selectedTimeframe as keyof typeof dashboard.revenue]?.slice(0, 7).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.date || item.week || item.month}</span>
                        <span className="font-medium">${item.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Acquisition */}
            {dashboard && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Acquisition</CardTitle>
                  <CardDescription>Channels and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboard.customerAnalytics.acquisition.map((channel, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{channel.channel}</div>
                          <div className="text-sm text-muted-foreground">
                            {channel.customers} customers
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {channel.cost > 0 ? `$${channel.cost.toLocaleString()}` : 'Organic'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {channel.cost > 0 ? `$${(channel.cost / channel.customers).toFixed(2)}/customer` : 'Free'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Top Selling Products */}
          {dashboard && (
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Best performing items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboard.productAnalytics.topSelling.slice(0, 6).map((product, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{product.name}</h4>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span>{product.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue:</span>
                          <span>${product.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Recommendations */}
          {dashboard && (
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Intelligent business insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.productAnalytics.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium capitalize">{rec.type}</span>
                          <Badge className={getImpactColor(rec.impact)}>
                            {rec.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demand Forecast */}
            {predictive && (
              <Card>
                <CardHeader>
                  <CardTitle>Demand Forecast</CardTitle>
                  <CardDescription>Predicted order volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {predictive.demandForecast.daily.slice(0, 7).map((forecast, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{forecast.date}</span>
                        <div className="text-right">
                          <div className="font-medium">{forecast.predictedOrders} orders</div>
                          <div className="text-xs text-muted-foreground">
                            {(forecast.confidence * 100).toFixed(0)}% confidence
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Behavior */}
            {predictive && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Behavior</CardTitle>
                  <CardDescription>Predictive insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Churn Risk</h4>
                      <div className="space-y-2">
                        {predictive.customerBehavior.churnPrediction.slice(0, 3).map((customer, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getRiskColor(customer.risk)}`}></div>
                              <span className="text-sm">Customer {customer.customerId}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {(customer.probability * 100).toFixed(0)}% risk
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Purchase Intent</h4>
                      <div className="space-y-2">
                        {predictive.customerBehavior.purchasePrediction.slice(0, 3).map((customer, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {customer.likelyToPurchase ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              )}
                              <span className="text-sm">Customer {customer.customerId}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {(customer.probability * 100).toFixed(0)}% likely
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Inventory Optimization */}
          {predictive && (
            <Card>
              <CardHeader>
                <CardTitle>Inventory Optimization</CardTitle>
                <CardDescription>AI-powered stock recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-3">Stock Recommendations</h4>
                    <div className="space-y-2">
                      {predictive.inventoryOptimization.stockRecommendations.map((rec, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Product {rec.productId}</span>
                            <Badge className={getImpactColor(rec.priority)}>
                              {rec.priority} priority
                            </Badge>
                          </div>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Current:</span>
                              <span>{rec.currentStock}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Recommended:</span>
                              <span>{rec.recommendedStock}</span>
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {rec.reason}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Waste Reduction</h4>
                    <div className="space-y-2">
                      {predictive.inventoryOptimization.wasteReduction.map((rec, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="font-medium mb-1">Product {rec.productId}</div>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Current Waste:</span>
                              <span>{rec.currentWaste}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Potential Reduction:</span>
                              <span>{rec.potentialReduction}%</span>
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {rec.strategy}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Automated Reports</h3>
            <Button onClick={() => handleGenerateReport('custom')}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>

          <div className="grid gap-4">
            {reports?.scheduled.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                      <CardDescription>
                        {report.type} report • {report.format}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.isActive ? "default" : "secondary"}>
                        {report.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerateReport(report.type)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Recipients</h4>
                      <p className="text-sm text-muted-foreground">
                        {report.recipients.length} recipients
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Last Generated</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.lastGenerated).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Next Generation</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.nextGeneration).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Report Templates */}
          {reports && (
            <Card>
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
                <CardDescription>Available report templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reports.templates.map((template, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium">Sections:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {template.sections.map((section, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {section}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium">Metrics:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {template.metrics.map((metric, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {metric}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
            <Button onClick={handleGenerateInsights}>
              <Brain className="h-4 w-4 mr-2" />
              Generate Insights
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Business Insights</CardTitle>
                <CardDescription>AI-generated business intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Findings</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">Weekend sales are 45% higher than weekdays</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span className="text-sm">Customer retention rate exceeds industry average</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ShoppingBag className="h-4 w-4 text-purple-500 mt-0.5" />
                        <span className="text-sm">Pizza category shows strongest growth</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Strategic Recommendations</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-orange-500 mt-0.5" />
                        <span className="text-sm">Implement dynamic pricing for peak hours</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <span className="text-sm">Launch loyalty program to improve retention</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Activity className="h-4 w-4 text-red-500 mt-0.5" />
                        <span className="text-sm">Expand delivery to high-demand areas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">12.3%</div>
                      <div className="text-sm text-muted-foreground">Revenue Growth</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">68.5%</div>
                      <div className="text-sm text-muted-foreground">Retention Rate</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">$37.02</div>
                      <div className="text-sm text-muted-foreground">Avg Order Value</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">94%</div>
                      <div className="text-sm text-muted-foreground">Automation Score</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Anomaly Detection */}
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Detection</CardTitle>
              <CardDescription>AI-powered anomaly alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Order Volume Spike</div>
                      <div className="text-sm text-muted-foreground">
                        90% above normal - detected 2 hours ago
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Medium
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Revenue Target Achieved</div>
                      <div className="text-sm text-muted-foreground">
                        Monthly goal exceeded by 15% - detected 1 day ago
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Positive
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}