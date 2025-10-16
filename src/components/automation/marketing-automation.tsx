'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Megaphone, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  Play,
  Pause,
  RefreshCw,
  Target,
  TrendingUp,
  Mail,
  MessageSquare,
  Bell,
  Share2,
  Calendar,
  DollarSign,
  Eye,
  MousePointer,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  type: 'email' | 'sms' | 'push' | 'social'
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused'
  targetAudience: {
    segmentIds: string[]
    userCount: number
    criteria: Record<string, any>
  }
  content: {
    subject?: string
    message: string
    template?: string
  }
  scheduling: {
    startDate: string
    sendTime: string
    frequency: 'once' | 'daily' | 'weekly' | 'monthly'
  }
  performance: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    converted: number
    revenue: number
    roi: number
  }
}

interface CustomerSegment {
  id: string
  name: string
  description: string
  criteria: Record<string, any>
  userCount: number
  isActive: boolean
}

interface MarketingAnalytics {
  overview: {
    totalCampaigns: number
    activeCampaigns: number
    totalReach: number
    engagementRate: number
    conversionRate: number
    revenueGenerated: number
    roi: number
  }
  channelPerformance: Array<{
    channel: string
    reach: number
    engagement: number
    conversion: number
    revenue: number
  }>
  campaignTypes: Array<{
    type: string
    count: number
    avgROI: number
  }>
}

interface MarketingConfig {
  campaignAutomation: {
    autoStart: boolean
    budgetAlerts: boolean
    performanceTracking: boolean
    aBTesting: boolean
  }
  customerSegmentation: {
    autoUpdate: boolean
    behavioralTracking: boolean
    predictiveAnalysis: boolean
  }
  contentOptimization: {
    aiGenerated: boolean
    personalization: boolean
    timingOptimization: boolean
  }
}

export function MarketingAutomation({ storeId, isAdmin = false }: { storeId: string; isAdmin?: boolean }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [segments, setSegments] = useState<CustomerSegment[]>([])
  const [analytics, setAnalytics] = useState<MarketingAnalytics | null>(null)
  const [config, setConfig] = useState<MarketingConfig | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [showCreateSegment, setShowCreateSegment] = useState(false)

  useEffect(() => {
    loadMarketingData()
  }, [storeId])

  const loadMarketingData = async () => {
    setLoading(true)
    try {
      const [campaignsRes, segmentsRes, analyticsRes, configRes] = await Promise.all([
        fetch(`/api/automation/marketing?storeId=${storeId}&action=campaigns`),
        fetch(`/api/automation/marketing?storeId=${storeId}&action=segments`),
        fetch(`/api/automation/marketing?storeId=${storeId}&action=analytics`),
        fetch(`/api/automation/marketing?storeId=${storeId}&action=config`)
      ])

      const [campaignsData, segmentsData, analyticsData, configData] = await Promise.all([
        campaignsRes.json(),
        segmentsRes.json(),
        analyticsRes.json(),
        configRes.json()
      ])

      setCampaigns(campaignsData.campaigns || [])
      setSegments(segmentsData.segments || [])
      setAnalytics(analyticsData.analytics)
      setConfig(configData.config)
    } catch (error) {
      console.error('Error loading marketing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/automation/marketing?storeId=${storeId}&action=start-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId })
      })
      const data = await response.json()
      if (data.message) {
        loadMarketingData()
      }
    } catch (error) {
      console.error('Error starting campaign:', error)
    }
  }

  const handlePauseCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/automation/marketing?storeId=${storeId}&action=pause-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId })
      })
      const data = await response.json()
      if (data.message) {
        loadMarketingData()
      }
    } catch (error) {
      console.error('Error pausing campaign:', error)
    }
  }

  const handleOptimizeCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/automation/marketing?storeId=${storeId}&action=optimize-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId })
      })
      const data = await response.json()
      if (data.recommendations) {
        alert(`Optimization Recommendations:\n${data.recommendations.join('\n')}`)
      }
    } catch (error) {
      console.error('Error optimizing campaign:', error)
    }
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />
      case 'sms': return <MessageSquare className="h-4 w-4" />
      case 'push': return <Bell className="h-4 w-4" />
      case 'social': return <Share2 className="h-4 w-4" />
      default: return <Megaphone className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'draft': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
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
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.activeCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                Total: {analytics.overview.totalCampaigns}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalReach.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.overview.engagementRate}% engagement
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analytics.overview.revenueGenerated.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.overview.conversionRate}% conversion
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.roi}x</div>
              <p className="text-xs text-muted-foreground">
                Return on investment
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Channel Performance */}
            {analytics && (
              <Card>
                <CardHeader>
                  <CardTitle>Channel Performance</CardTitle>
                  <CardDescription>Performance by marketing channel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.channelPerformance.map((channel, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(channel.channel.toLowerCase())}
                          <span className="font-medium capitalize">{channel.channel}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{channel.engagement}%</div>
                          <div className="text-xs text-muted-foreground">
                            ${channel.revenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common marketing automation tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start"
                  onClick={() => setShowCreateCampaign(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Campaign
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowCreateSegment(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Create Customer Segment
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={loadMarketingData}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Latest marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getChannelIcon(campaign.type)}
                      <div>
                        <h4 className="font-medium">{campaign.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {campaign.targetAudience.userCount} users targeted
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      {campaign.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePauseCampaign(campaign.id)}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      {campaign.status === 'paused' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartCampaign(campaign.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Marketing Campaigns</h3>
            <Button onClick={() => setShowCreateCampaign(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>

          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getChannelIcon(campaign.type)}
                      <div>
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <CardDescription>
                          {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} Campaign
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Target Audience</h4>
                      <p className="text-sm text-muted-foreground">
                        {campaign.targetAudience.userCount.toLocaleString()} users
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {campaign.targetAudience.segmentIds.length} segments
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Schedule</h4>
                      <p className="text-sm text-muted-foreground">
                        {campaign.scheduling.frequency} at {campaign.scheduling.sendTime}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Started {new Date(campaign.scheduling.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Performance</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="h-3 w-3" />
                        <span>{((campaign.performance.opened / campaign.performance.sent) * 100).toFixed(1)}% open rate</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MousePointer className="h-3 w-3" />
                        <span>{((campaign.performance.clicked / campaign.performance.sent) * 100).toFixed(1)}% CTR</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {campaign.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePauseCampaign(campaign.id)}
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    {campaign.status === 'paused' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartCampaign(campaign.id)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOptimizeCampaign(campaign.id)}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Optimize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Customer Segments</h3>
            <Button onClick={() => setShowCreateSegment(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Segment
            </Button>
          </div>

          <div className="grid gap-4">
            {segments.map((segment) => (
              <Card key={segment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{segment.name}</CardTitle>
                      <CardDescription>{segment.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={segment.isActive ? "default" : "secondary"}>
                        {segment.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {segment.userCount.toLocaleString()} users
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <strong>Criteria:</strong> {JSON.stringify(segment.criteria, null, 2)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {analytics && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Types</CardTitle>
                    <CardDescription>Performance by campaign type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.campaignTypes.map((type, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{type.type}</div>
                            <div className="text-sm text-muted-foreground">
                              {type.count} campaigns
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{type.avgROI}x ROI</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Automation Settings</CardTitle>
                    <CardDescription>Current automation configuration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {config && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Campaign Automation</h4>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Auto Start: {config.campaignAutomation.autoStart ? 'Enabled' : 'Disabled'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Budget Alerts: {config.campaignAutomation.budgetAlerts ? 'Enabled' : 'Disabled'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">A/B Testing: {config.campaignAutomation.aBTesting ? 'Enabled' : 'Disabled'}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Customer Segmentation</h4>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Auto Update: {config.customerSegmentation.autoUpdate ? 'Enabled' : 'Disabled'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Behavioral Tracking: {config.customerSegmentation.behavioralTracking ? 'Enabled' : 'Disabled'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}