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
  Settings, 
  Plus, 
  Save, 
  Trash2, 
  RefreshCw,
  Clock,
  Bell,
  Gift,
  BarChart3,
  Play,
  Pause
} from 'lucide-react'
import { AutomationDashboard } from '@/components/automation/automation-dashboard'

interface AutomationAdminProps {
  storeId: string
}

interface MenuSchedule {
  id: string
  name: string
  description?: string
  type: 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER' | 'LATE_NIGHT' | 'SPECIAL'
  startTime: string
  endTime: string
  daysOfWeek: number[]
  isActive: boolean
}

interface NotificationTemplate {
  id: string
  name: string
  title: string
  message: string
  type: 'PUSH' | 'SMS' | 'EMAIL' | 'IN_APP'
  isActive: boolean
}

interface OfferRule {
  id: string
  name: string
  description?: string
  type: 'BUY_ONE_GET_ONE' | 'PERCENTAGE_DISCOUNT' | 'FIXED_AMOUNT_DISCOUNT' | 'FREE_ITEM' | 'COMBO_DEAL' | 'LOYALTY_BONUS'
  conditions: any[]
  actions: any[]
  startTime: string
  endTime: string
  daysOfWeek: number[]
  isActive: boolean
  priority: number
  maxUsage?: number
  usageCount: number
}

export function AutomationAdmin({ storeId }: AutomationAdminProps) {
  const [menuSchedules, setMenuSchedules] = useState<MenuSchedule[]>([])
  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>([])
  const [offerRules, setOfferRules] = useState<OfferRule[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Form states
  const [newMenuSchedule, setNewMenuSchedule] = useState({
    name: '',
    description: '',
    type: 'BREAKFAST' as const,
    startTime: '07:00',
    endTime: '11:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
  })

  const [newNotificationTemplate, setNewNotificationTemplate] = useState({
    name: '',
    title: '',
    message: '',
    type: 'PUSH' as const
  })

  const [newOfferRule, setNewOfferRule] = useState({
    name: '',
    description: '',
    type: 'BUY_ONE_GET_ONE' as const,
    conditions: [],
    actions: [],
    startTime: '00:00',
    endTime: '23:59',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    priority: 0,
    maxUsage: null
  })

  useEffect(() => {
    fetchAutomationData()
  }, [storeId])

  const fetchAutomationData = async () => {
    setLoading(true)
    try {
      const [menuResponse, notificationResponse, offerResponse] = await Promise.all([
        fetch(`/api/automation/menu-schedules?storeId=${storeId}`),
        fetch(`/api/automation/notifications?storeId=${storeId}&type=templates`),
        fetch(`/api/automation/offers?storeId=${storeId}`)
      ])

      const menuData = await menuResponse.json()
      const notificationData = await notificationResponse.json()
      const offerData = await offerResponse.json()

      setMenuSchedules(menuData.schedules || [])
      setNotificationTemplates(notificationData.templates || [])
      setOfferRules(offerData.offers || [])
    } catch (error) {
      console.error('Error fetching automation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createMenuSchedule = async () => {
    try {
      const response = await fetch('/api/automation/menu-schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMenuSchedule,
          storeId,
          menuItemIds: [] // Empty for now, admin will add items later
        })
      })

      if (response.ok) {
        setNewMenuSchedule({
          name: '',
          description: '',
          type: 'BREAKFAST',
          startTime: '07:00',
          endTime: '11:00',
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
        })
        fetchAutomationData()
      }
    } catch (error) {
      console.error('Error creating menu schedule:', error)
    }
  }

  const createNotificationTemplate = async () => {
    try {
      const response = await fetch('/api/automation/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createTemplate',
          ...newNotificationTemplate,
          storeId
        })
      })

      if (response.ok) {
        setNewNotificationTemplate({
          name: '',
          title: '',
          message: '',
          type: 'PUSH'
        })
        fetchAutomationData()
      }
    } catch (error) {
      console.error('Error creating notification template:', error)
    }
  }

  const createOfferRule = async () => {
    try {
      const response = await fetch('/api/automation/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createOffer',
          ...newOfferRule,
          storeId
        })
      })

      if (response.ok) {
        setNewOfferRule({
          name: '',
          description: '',
          type: 'BUY_ONE_GET_ONE',
          conditions: [],
          actions: [],
          startTime: '00:00',
          endTime: '23:59',
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          priority: 0,
          maxUsage: null
        })
        fetchAutomationData()
      }
    } catch (error) {
      console.error('Error creating offer rule:', error)
    }
  }

  const toggleScheduleStatus = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/automation/menu-schedules/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      })
      fetchAutomationData()
    } catch (error) {
      console.error('Error toggling schedule status:', error)
    }
  }

  const getScheduleColor = (type: string) => {
    switch (type) {
      case 'BREAKFAST':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'LUNCH':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'SNACKS':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'DINNER':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getDaysString = (days: number[]) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days.map(day => dayNames[day]).join(', ')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Automation Admin</h1>
          <p className="text-gray-600 mt-2">
            Manage automated menus, offers, and notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAutomationData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="menu">Menu Schedules</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AutomationDashboard storeId={storeId} isAdmin={true} />
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Menu Schedules
              </CardTitle>
              <CardDescription>
                Manage time-based menu schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuSchedules.map((schedule) => (
                    <Card key={schedule.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold">{schedule.name}</h3>
                          <div className="flex gap-2">
                            <Badge className={getScheduleColor(schedule.type)}>
                              {schedule.type}
                            </Badge>
                            <Badge variant={schedule.isActive ? "default" : "secondary"}>
                              {schedule.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        
                        {schedule.description && (
                          <p className="text-sm text-gray-600 mb-3">{schedule.description}</p>
                        )}
                        
                        <div className="text-sm text-gray-500 space-y-1">
                          <div>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</div>
                          <div>{getDaysString(schedule.daysOfWeek)}</div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleScheduleStatus(schedule.id, !schedule.isActive)}
                          >
                            {schedule.isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                            {schedule.isActive ? 'Pause' : 'Activate'}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create New Menu Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input
                          value={newMenuSchedule.name}
                          onChange={(e) => setNewMenuSchedule(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Breakfast Menu"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <Select 
                          value={newMenuSchedule.type}
                          onValueChange={(value: any) => setNewMenuSchedule(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BREAKFAST">Breakfast</SelectItem>
                            <SelectItem value="LUNCH">Lunch</SelectItem>
                            <SelectItem value="SNACKS">Snacks</SelectItem>
                            <SelectItem value="DINNER">Dinner</SelectItem>
                            <SelectItem value="LATE_NIGHT">Late Night</SelectItem>
                            <SelectItem value="SPECIAL">Special</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Time</label>
                        <Input
                          type="time"
                          value={newMenuSchedule.startTime}
                          onChange={(e) => setNewMenuSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Time</label>
                        <Input
                          type="time"
                          value={newMenuSchedule.endTime}
                          onChange={(e) => setNewMenuSchedule(prev => ({ ...prev, endTime: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        value={newMenuSchedule.description}
                        onChange={(e) => setNewMenuSchedule(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description for this menu schedule"
                      />
                    </div>
                    <Button onClick={createMenuSchedule}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Schedule
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Templates
              </CardTitle>
              <CardDescription>
                Manage notification templates and scheduling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notificationTemplates.map((template) => (
                    <Card key={template.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant={template.isActive ? "default" : "secondary"}>
                            {template.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Title:</span> {template.title}
                          </div>
                          <div>
                            <span className="font-medium">Message:</span> {template.message}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {template.type}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create New Notification Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input
                          value={newNotificationTemplate.name}
                          onChange={(e) => setNewNotificationTemplate(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Evening Snacks Offer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <Select 
                          value={newNotificationTemplate.type}
                          onValueChange={(value: any) => setNewNotificationTemplate(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PUSH">Push Notification</SelectItem>
                            <SelectItem value="SMS">SMS</SelectItem>
                            <SelectItem value="EMAIL">Email</SelectItem>
                            <SelectItem value="IN_APP">In-App</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input
                        value={newNotificationTemplate.title}
                        onChange={(e) => setNewNotificationTemplate(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Special Offer!"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <Textarea
                        value={newNotificationTemplate.message}
                        onChange={(e) => setNewNotificationTemplate(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Get 20% off on your next order!"
                      />
                    </div>
                    <Button onClick={createNotificationTemplate}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Offer Rules
              </CardTitle>
              <CardDescription>
                Manage automated offer rules and conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offerRules.map((rule) => (
                    <Card key={rule.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold">{rule.name}</h3>
                          <Badge variant={rule.isActive ? "default" : "secondary"}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        {rule.description && (
                          <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                        )}
                        <div className="text-sm text-gray-500 space-y-1">
                          <div>Type: {rule.type.replace('_', ' ')}</div>
                          <div>Priority: {rule.priority}</div>
                          <div>Usage: {rule.usageCount}{rule.maxUsage ? `/${rule.maxUsage}` : ''}</div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create New Offer Rule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input
                          value={newOfferRule.name}
                          onChange={(e) => setNewOfferRule(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Happy Hours BOGO"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <Select 
                          value={newOfferRule.type}
                          onValueChange={(value: any) => setNewOfferRule(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BUY_ONE_GET_ONE">Buy One Get One</SelectItem>
                            <SelectItem value="PERCENTAGE_DISCOUNT">Percentage Discount</SelectItem>
                            <SelectItem value="FIXED_AMOUNT_DISCOUNT">Fixed Amount Discount</SelectItem>
                            <SelectItem value="FREE_ITEM">Free Item</SelectItem>
                            <SelectItem value="COMBO_DEAL">Combo Deal</SelectItem>
                            <SelectItem value="LOYALTY_BONUS">Loyalty Bonus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        value={newOfferRule.description}
                        onChange={(e) => setNewOfferRule(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description for this offer rule"
                      />
                    </div>
                    <Button onClick={createOfferRule}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Offer Rule
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Automation Settings
              </CardTitle>
              <CardDescription>
                Configure automation system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">System Configuration</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Automatic Menu Updates</h4>
                        <p className="text-sm text-gray-600">Automatically update menus based on schedules</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Notification Processing</h4>
                        <p className="text-sm text-gray-600">Process scheduled notifications automatically</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Offer Evaluation</h4>
                        <p className="text-sm text-gray-600">Automatically evaluate and apply offers</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Data Management</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Cleanup Old Logs</h4>
                        <p className="text-sm text-gray-600">Remove old automation and notification logs</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Cleanup
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Export Automation Data</h4>
                        <p className="text-sm text-gray-600">Export automation configuration and data</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Advanced Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">API Rate Limiting</h4>
                        <p className="text-sm text-gray-600">Configure rate limits for automation API</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Error Handling</h4>
                        <p className="text-sm text-gray-600">Configure error handling and retry logic</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}