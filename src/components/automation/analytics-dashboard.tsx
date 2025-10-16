'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Bell, 
  Gift, 
  Clock,
  Download,
  RefreshCw,
  Zap,
  Target,
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface AnalyticsData {
  menuScheduleStats: {
    totalSchedules: number
    activeSchedules: number
    scheduleByType: Record<string, number>
    averageItemsPerSchedule: number
    mostPopularSchedule: string
    scheduleComplianceRate: number
  }
  notificationStats: {
    totalTemplates: number
    activeTemplates: number
    totalSent: number
    totalFailed: number
    deliveryRate: number
    averageResponseTime: number
    notificationByType: Record<string, number>
    bestPerformingTemplate: string
    scheduledNotifications: number
  }
  offerStats: {
    totalOffers: number
    activeOffers: number
    totalRedemptions: number
    averageDiscountValue: number
    offerByType: Record<string, number>
    conversionRate: number
    mostPopularOffer: string
    revenueImpact: number
  }
  userEngagementStats: {
    totalUsers: number
    activeUsers: number
    averageOrderFrequency: number
    averageOrderValue: number
    personalizationAccuracy: number
    userSatisfactionScore: number
    retentionRate: number
  }
  systemPerformanceStats: {
    totalTasksExecuted: number
    successRate: number
    averageExecutionTime: number
    errorRate: number
    uptime: number
    systemHealth: 'excellent' | 'good' | 'fair' | 'poor'
  }
}

interface RealTimeMetrics {
  tasksLastHour: number
  successfulTasksLastHour: number
  notificationsLastHour: number
  successfulNotificationsLastHour: number
  averageResponseTimeLastHour: number
}

interface AnalyticsDashboardProps {
  storeId?: string
  isAdmin?: boolean
}

export function AnalyticsDashboard({ storeId, isAdmin = false }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStoreId, setSelectedStoreId] = useState(storeId || 'all')
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  useEffect(() => {
    fetchAnalytics()
    fetchRealTimeMetrics()
    
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchRealTimeMetrics()
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [selectedStoreId])

  const fetchAnalytics = async () => {
    try {
      const url = new URL('/api/automation/analytics', window.location.origin)
      if (selectedStoreId !== 'all') {
        url.searchParams.append('storeId', selectedStoreId)
      }

      const response = await fetch(url)
      const data = await response.json()
      setAnalytics(data.analytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRealTimeMetrics = async () => {
    try {
      const url = new URL('/api/automation/analytics', window.location.origin)
      url.searchParams.append('action', 'realtime')
      if (selectedStoreId !== 'all') {
        url.searchParams.append('storeId', selectedStoreId)
      }

      const response = await fetch(url)
      const data = await response.json()
      setRealTimeMetrics(data.metrics)
    } catch (error) {
      console.error('Error fetching real-time metrics:', error)
    }
  }

  const generateReport = async () => {
    try {
      const url = new URL('/api/automation/analytics', window.location.origin)
      url.searchParams.append('action', 'report')
      url.searchParams.append('reportType', reportType)
      if (selectedStoreId !== 'all') {
        url.searchParams.append('storeId', selectedStoreId)
      }

      const response = await fetch(url)
      const data = await response.json()
      
      // Create and download the report
      const blob = new Blob([data.report], { type: 'text/markdown' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `automation-report-${reportType}-${new Date().toISOString().split('T')[0]}.md`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'good':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'fair':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'poor':
        return 'text-red-600 bg-red-100 border-red-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`
  const formatPercentage = (percentage: number) => `${percentage.toFixed(1)}%`
  const formatTime = (milliseconds: number) => `${(milliseconds / 1000).toFixed(1)}s`

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analytics and reporting for automation features
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {/* Add store options dynamically */}
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={fetchAnalytics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      {realTimeMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Real-time Metrics (Last Hour)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {realTimeMetrics.tasksLastHour}
                </div>
                <div className="text-sm text-gray-600">Tasks Executed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {realTimeMetrics.successfulTasksLastHour}
                </div>
                <div className="text-sm text-gray-600">Successful Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {realTimeMetrics.notificationsLastHour}
                </div>
                <div className="text-sm text-gray-600">Notifications Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {realTimeMetrics.successfulNotificationsLastHour}
                </div>
                <div className="text-sm text-gray-600">Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(realTimeMetrics.averageResponseTimeLastHour)}
                </div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">System Health</span>
              </div>
              <Badge className={getHealthColor(analytics.systemPerformanceStats.systemHealth)}>
                {analytics.systemPerformanceStats.systemHealth.toUpperCase()}
              </Badge>
              <div className="text-xs text-gray-500 mt-1">
                {formatPercentage(analytics.systemPerformanceStats.uptime)} uptime
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Active Users</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {analytics.userEngagementStats.activeUsers}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatPercentage(analytics.userEngagementStats.retentionRate)} retention
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Offer Performance</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {formatPercentage(analytics.offerStats.conversionRate)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {analytics.offerStats.totalRedemptions} redemptions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Notification Success</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatPercentage(analytics.notificationStats.deliveryRate)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {analytics.notificationStats.totalSent} sent
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics */}
      {analytics && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="menu">Menu Schedules</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="users">User Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Key Performance Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">System Success Rate</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${analytics.systemPerformanceStats.successRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{formatPercentage(analytics.systemPerformanceStats.successRate)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">User Satisfaction</span>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= analytics.userEngagementStats.userSatisfactionScore ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{analytics.userEngagementStats.userSatisfactionScore.toFixed(1)}/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Personalization Accuracy</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${analytics.userEngagementStats.personalizationAccuracy}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{formatPercentage(analytics.userEngagementStats.personalizationAccuracy)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Most Popular Menu</span>
                      <Badge variant="outline">{analytics.menuScheduleStats.mostPopularSchedule}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Best Notification Template</span>
                      <Badge variant="outline">{analytics.notificationStats.bestPerformingTemplate}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Top Offer</span>
                      <Badge variant="outline">{analytics.offerStats.mostPopularOffer}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Menu Schedule Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.menuScheduleStats.totalSchedules}
                    </div>
                    <div className="text-sm text-gray-600">Total Schedules</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.menuScheduleStats.activeSchedules}
                    </div>
                    <div className="text-sm text-gray-600">Active Schedules</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {analytics.menuScheduleStats.averageItemsPerSchedule.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Items/Schedule</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Schedules by Type</h4>
                  <div className="space-y-2">
                    {Object.entries(analytics.menuScheduleStats.scheduleByType).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(count / analytics.menuScheduleStats.totalSchedules) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.notificationStats.totalTemplates}
                    </div>
                    <div className="text-sm text-gray-600">Total Templates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.notificationStats.totalSent}
                    </div>
                    <div className="text-sm text-gray-600">Total Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {analytics.notificationStats.totalFailed}
                    </div>
                    <div className="text-sm text-gray-600">Total Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatPercentage(analytics.notificationStats.deliveryRate)}
                    </div>
                    <div className="text-sm text-gray-600">Delivery Rate</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Notifications by Type</h4>
                  <div className="space-y-2">
                    {Object.entries(analytics.notificationStats.notificationByType).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(count / analytics.notificationStats.totalTemplates) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Offer Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.offerStats.totalOffers}
                    </div>
                    <div className="text-sm text-gray-600">Total Offers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.offerStats.totalRedemptions}
                    </div>
                    <div className="text-sm text-gray-600">Total Redemptions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatPercentage(analytics.offerStats.conversionRate)}
                    </div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(analytics.offerStats.revenueImpact)}
                    </div>
                    <div className="text-sm text-gray-600">Revenue Impact</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Offers by Type</h4>
                  <div className="space-y-2">
                    {Object.entries(analytics.offerStats.offerByType).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${(count / analytics.offerStats.totalOffers) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Engagement Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.userEngagementStats.totalUsers}
                    </div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.userEngagementStats.activeUsers}
                    </div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {analytics.userEngagementStats.averageOrderFrequency.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Orders/Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(analytics.userEngagementStats.averageOrderValue)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Order Value</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Personalization</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPercentage(analytics.userEngagementStats.personalizationAccuracy)}
                      </div>
                      <div className="text-xs text-gray-500">Accuracy Rate</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Satisfaction</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {analytics.userEngagementStats.userSatisfactionScore.toFixed(1)}/5
                      </div>
                      <div className="text-xs text-gray-500">Average Rating</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Retention</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {formatPercentage(analytics.userEngagementStats.retentionRate)}
                      </div>
                      <div className="text-xs text-gray-500">Retention Rate</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

// Star component for ratings
function Star({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}