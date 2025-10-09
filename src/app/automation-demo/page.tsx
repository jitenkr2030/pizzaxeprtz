'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AutomationDashboard } from '@/components/automation/automation-dashboard'
import { AnalyticsDashboard } from '@/components/automation/analytics-dashboard'
import { OrderDeliveryAutomation } from '@/components/automation/order-delivery-automation'
import { PaymentBillingAutomation } from '@/components/automation/payment-billing-automation'
import { MarketingAutomation } from '@/components/automation/marketing-automation'
import { SupportAutomation } from '@/components/automation/support-automation'
import { AnalyticsInsightsAutomation } from '@/components/automation/analytics-insights-automation'
import { 
  Settings, 
  BarChart3, 
  Clock, 
  Bell, 
  Gift, 
  Zap,
  Users,
  TrendingUp,
  RefreshCw,
  Play,
  CheckCircle,
  AlertCircle,
  Package,
  Truck,
  Megaphone,
  Headphones,
  Brain
} from 'lucide-react'

export default function AutomationDemoPage() {
  const [storeId, setStoreId] = useState('demo-store-1')
  const [userId, setUserId] = useState('demo-user-1')
  const [currentTime, setCurrentTime] = useState('')
  const [currentDay, setCurrentDay] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Update current time
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString())
      setCurrentDay(now.toLocaleDateString('en-US', { weekday: 'long' }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const initializeDemo = async () => {
    try {
      // Simulate initialization
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsInitialized(true)
    } catch (error) {
      console.error('Error initializing demo:', error)
    }
  }

  const getCurrentTimeSlot = () => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 11) return 'Breakfast (7:00 AM - 11:00 AM)'
    if (hour >= 11 && hour < 15) return 'Lunch (12:00 PM - 3:00 PM)'
    if (hour >= 15 && hour < 19) return 'Evening Snacks (4:00 PM - 7:00 PM)'
    if (hour >= 19 && hour < 23) return 'Dinner (8:00 PM - 11:00 PM)'
    return 'Late Night (11:00 PM - 2:00 AM)'
  }

  const getDemoFeatures = () => [
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Time-Based Menu Scheduler',
      description: 'Automatically switch menus based on time of day',
      features: [
        'Breakfast: 7:00 AM - 11:00 AM',
        'Lunch: 12:00 PM - 3:00 PM', 
        'Evening Snacks: 4:00 PM - 7:00 PM',
        'Dinner: 8:00 PM - 11:00 PM',
        'Late Night: 11:00 PM - 2:00 AM'
      ],
      status: 'active'
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: 'Notification Scheduler',
      description: 'Send automated notifications at scheduled times',
      features: [
        'Push notifications',
        'SMS alerts',
        'Email campaigns',
        'In-app messages',
        'Personalized content'
      ],
      status: 'active'
    },
    {
      icon: <Gift className="h-8 w-8" />,
      title: 'Rule-Based Offer Engine',
      description: 'Dynamic offers based on conditions and rules',
      features: [
        'Time-based offers',
        'Order value discounts',
        'Buy 1 Get 1 deals',
        'Loyalty bonuses',
        'Personalized promotions'
      ],
      status: 'active'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Personalization System',
      description: 'AI-powered recommendations based on user behavior',
      features: [
        'Order history analysis',
        'Preference learning',
        'Personalized offers',
        'Behavioral targeting',
        'Retention optimization'
      ],
      status: 'active'
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: 'Order Automation',
      description: 'Automated order processing and management',
      features: [
        'Auto-accept orders',
        'Kitchen queue optimization',
        'Preparation time estimation',
        'Order status updates',
        'Stale order cancellation'
      ],
      status: 'active'
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'Delivery Automation',
      description: 'Smart delivery management and optimization',
      features: [
        'Auto-assign delivery partners',
        'Route optimization',
        'Delivery time estimation',
        'Real-time tracking',
        'Automated status updates'
      ],
      status: 'active'
    },
    {
      icon: <Megaphone className="h-8 w-8" />,
      title: 'Marketing Automation',
      description: 'AI-powered marketing campaigns and customer segmentation',
      features: [
        'Campaign management',
        'Customer segmentation',
        'Content generation',
        'Performance analytics',
        'ROI optimization'
      ],
      status: 'active'
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: 'Support Automation',
      description: 'Intelligent customer support with AI chatbot and ticket management',
      features: [
        'AI chatbot',
        'Ticket auto-assignment',
        'Knowledge base',
        'Sentiment analysis',
        'Performance tracking'
      ],
      status: 'active'
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Analytics & Insights',
      description: 'Advanced AI-powered business intelligence and predictive analytics',
      features: [
        'Predictive analytics',
        'Demand forecasting',
        'Customer behavior analysis',
        'Anomaly detection',
        'Automated reporting'
      ],
      status: 'active'
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: 'Restaurant Operations',
      description: 'Automated restaurant management systems',
      features: [
        'Inventory management',
        'Staff scheduling',
        'Kitchen workflow optimization',
        'Quality control',
        'Maintenance alerts'
      ],
      status: 'active'
    }
  ]

  const getRealTimeStatus = () => [
    { name: 'Menu Scheduler', status: 'active', lastUpdate: '2 minutes ago', uptime: '99.9%' },
    { name: 'Notification Processor', status: 'active', lastUpdate: '1 minute ago', uptime: '99.8%' },
    { name: 'Offer Engine', status: 'active', lastUpdate: '30 seconds ago', uptime: '99.7%' },
    { name: 'Order Automation', status: 'active', lastUpdate: '45 seconds ago', uptime: '99.9%' },
    { name: 'Delivery System', status: 'active', lastUpdate: '1 minute ago', uptime: '99.5%' },
    { name: 'Marketing Automation', status: 'active', lastUpdate: '3 minutes ago', uptime: '99.6%' },
    { name: 'Support System', status: 'active', lastUpdate: '2 minutes ago', uptime: '99.4%' },
    { name: 'Analytics Engine', status: 'active', lastUpdate: '5 minutes ago', uptime: '99.8%' },
    { name: 'Personalization AI', status: 'active', lastUpdate: '5 minutes ago', uptime: '99.6%' },
    { name: 'Background Tasks', status: 'active', lastUpdate: 'Just now', uptime: '100%' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Automation Demo</h1>
              <p className="text-gray-600 mt-1">
                Experience the power of automated food delivery features
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Current Time</div>
                <div className="font-semibold">{currentTime}</div>
                <div className="text-sm text-gray-500">{currentDay}</div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {getCurrentTimeSlot()}
              </Badge>
              {!isInitialized && (
                <Button onClick={initializeDemo}>
                  <Play className="h-4 w-4 mr-2" />
                  Initialize Demo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              System Status - Real-time
            </CardTitle>
            <CardDescription>
              Current status of automation systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 gap-4">
              {getRealTimeStatus().map((system, index) => (
                <div key={index} className="flex flex-col items-center justify-between p-3 bg-gray-50 rounded-lg min-h-[100px]">
                  <div className="text-center mb-2">
                    <div className="font-medium text-sm">{system.name}</div>
                    <div className="text-xs text-gray-500">{system.lastUpdate}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {system.status === 'active' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <Badge 
                      variant={system.status === 'active' ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {system.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    {system.uptime}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Automation Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {getDemoFeatures().map((feature, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <Badge variant={feature.status === 'active' ? "default" : "secondary"}>
                      {feature.status}
                    </Badge>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((feat, featIndex) => (
                      <li key={featIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Interactive Demo */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Menu & Offers</TabsTrigger>
            <TabsTrigger value="orders">Orders & Delivery</TabsTrigger>
            <TabsTrigger value="payments">Payments & Billing</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="admin">Admin Panel</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Menu & Offers Automation</CardTitle>
                <CardDescription>
                  Experience time-based menu scheduling and intelligent offer engine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AutomationDashboard 
                  storeId={storeId} 
                  userId={userId}
                  isAdmin={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order & Delivery Automation</CardTitle>
                <CardDescription>
                  Real-time order management, delivery optimization, and kitchen automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrderDeliveryAutomation 
                  storeId={storeId}
                  isAdmin={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment & Billing Automation</CardTitle>
                <CardDescription>
                  Automated payment processing, billing, and financial management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentBillingAutomation 
                  storeId={storeId}
                  isAdmin={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Automation</CardTitle>
                <CardDescription>
                  AI-powered marketing campaigns, customer segmentation, and performance analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarketingAutomation 
                  storeId={storeId}
                  isAdmin={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle>Support Automation</CardTitle>
                <CardDescription>
                  Intelligent customer support with AI chatbot, ticket management, and knowledge base
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SupportAutomation 
                  storeId={storeId}
                  isAdmin={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics & Insights</CardTitle>
                <CardDescription>
                  AI-powered business intelligence, predictive analytics, and automated reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsInsightsAutomation 
                  storeId={storeId}
                  isAdmin={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Administration Panel</CardTitle>
                <CardDescription>
                  Manage automation settings and configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Admin Panel Demo
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Access the full admin panel to manage automation settings, schedules, and rules
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      System Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Demo Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Understanding the automation system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Time-Based Automation</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Menu Scheduling</h4>
                      <p className="text-sm text-gray-600">
                        Menus automatically change based on time of day, showing relevant items for breakfast, lunch, snacks, and dinner.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Notification Timing</h4>
                      <p className="text-sm text-gray-600">
                        Notifications are sent at optimal times, like evening snack offers at 3 PM or dinner reminders at 7 PM.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Gift className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Offer Activation</h4>
                      <p className="text-sm text-gray-600">
                        Special offers automatically activate during specific time windows, like happy hours from 3-6 PM.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Rule-Based Intelligence</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">User Personalization</h4>
                      <p className="text-sm text-gray-600">
                        The system learns from user behavior to provide personalized recommendations and offers.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Dynamic Pricing</h4>
                      <p className="text-sm text-gray-600">
                        Offers and discounts adjust based on demand, user loyalty, and order history.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Real-time Processing</h4>
                      <p className="text-sm text-gray-600">
                        All automation runs in real-time, ensuring immediate responses to user actions and system events.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Real-time automation system performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">99.8%</div>
                <h3 className="font-semibold mb-1">Uptime</h3>
                <p className="text-sm text-gray-600">System Reliability</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">&lt;1s</div>
                <h3 className="font-semibold mb-1">Response Time</h3>
                <p className="text-sm text-gray-600">Average Processing</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">10K+</div>
                <h3 className="font-semibold mb-1">Daily Tasks</h3>
                <p className="text-sm text-gray-600">Automated Actions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">99.9%</div>
                <h3 className="font-semibold mb-1">Accuracy</h3>
                <p className="text-sm text-gray-600">Task Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Key Benefits</CardTitle>
            <CardDescription>
              Why automation matters for your food delivery business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <h3 className="font-semibold mb-1">Always Active</h3>
                <p className="text-sm text-gray-600">
                  Automation runs continuously without manual intervention
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                <h3 className="font-semibold mb-1">Increased Efficiency</h3>
                <p className="text-sm text-gray-600">
                  Reduce manual work and improve operational efficiency
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">3x</div>
                <h3 className="font-semibold mb-1">Better Engagement</h3>
                <p className="text-sm text-gray-600">
                  Personalized experiences lead to higher customer engagement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}