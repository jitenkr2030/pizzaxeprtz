'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, Clock, CheckCircle, XCircle, Settings } from 'lucide-react'

interface NotificationTemplate {
  id: string
  name: string
  title: string
  message: string
  type: 'PUSH' | 'SMS' | 'EMAIL' | 'IN_APP'
  isActive: boolean
}

interface ScheduledNotification {
  id: string
  template: NotificationTemplate
  scheduleTime: string
  daysOfWeek: number[]
  sendImmediately: boolean
  status: 'SCHEDULED' | 'SENT' | 'FAILED' | 'CANCELLED'
  targetAudience: any
  maxSendCount?: number
  sentCount: number
  lastSentAt?: string
  nextSendAt?: string
}

interface NotificationSchedulerProps {
  storeId: string
  userId?: string
  onNotificationSettings?: () => void
}

export function NotificationScheduler({ storeId, userId, onNotificationSettings }: NotificationSchedulerProps) {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotificationData()
  }, [storeId])

  const fetchNotificationData = async () => {
    try {
      const [templatesResponse, scheduledResponse, statsResponse] = await Promise.all([
        fetch(`/api/automation/notifications?storeId=${storeId}&type=templates`),
        fetch(`/api/automation/notifications?storeId=${storeId}&type=scheduled`),
        fetch(`/api/automation/notifications?storeId=${storeId}&type=stats`)
      ])

      const templatesData = await templatesResponse.json()
      const scheduledData = await scheduledResponse.json()
      const statsData = await statsResponse.json()

      setTemplates(templatesData.templates || [])
      setScheduledNotifications(scheduledData.notifications || [])
      setStats(statsData.stats || {})
    } catch (error) {
      console.error('Error fetching notification data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'PUSH':
        return <Bell className="h-4 w-4" />
      case 'SMS':
        return <Bell className="h-4 w-4" />
      case 'EMAIL':
        return <Bell className="h-4 w-4" />
      case 'IN_APP':
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'PUSH':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'SMS':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'EMAIL':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'IN_APP':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'SENT':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'SENT':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const getDaysString = (days: any[]) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days.map(day => dayNames[day]).join(', ')
  }

  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return 'N/A'
    const date = new Date(dateTimeString)
    return date.toLocaleString()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Notification Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Overview
          </CardTitle>
          <CardDescription>
            Summary of your notification performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(stats.SENT || 0) + (stats.SCHEDULED || 0)}
              </div>
              <div className="text-sm text-gray-600">Total Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.SENT || 0}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.FAILED || 0}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.SCHEDULED || 0}
              </div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Templates
          </CardTitle>
          <CardDescription>
            Pre-defined message templates for automated notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Notification Templates
              </h3>
              <p className="text-gray-500">
                Create notification templates to start sending automated messages
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(template.type)}
                        <h3 className="font-semibold">{template.name}</h3>
                      </div>
                      <Badge className={getNotificationColor(template.type)}>
                        {template.type}
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-sm mb-1">Title:</h4>
                      <p className="text-sm text-gray-600">{template.title}</p>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-sm mb-1">Message:</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{template.message}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant={template.isActive ? "default" : "secondary"}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Scheduled Notifications
          </CardTitle>
          <CardDescription>
            Automated notifications scheduled for delivery
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scheduledNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Scheduled Notifications
              </h3>
              <p className="text-gray-500">
                Schedule notifications to engage with your customers automatically
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledNotifications.map((notification) => (
                <Card key={notification.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getNotificationIcon(notification.template.type)}
                          <h3 className="font-semibold">{notification.template.name}</h3>
                          <Badge className={getNotificationColor(notification.template.type)}>
                            {notification.template.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{notification.template.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(notification.status)}
                        <Badge className={getStatusColor(notification.status)}>
                          {notification.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Schedule:</span>
                        <div className="text-gray-600">
                          {formatTime(notification.scheduleTime)} on {getDaysString(notification.daysOfWeek)}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Next Send:</span>
                        <div className="text-gray-600">
                          {formatDateTime(notification.nextSendAt)}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Sent Count:</span>
                        <div className="text-gray-600">
                          {notification.sentCount} {notification.maxSendCount ? `/ ${notification.maxSendCount}` : ''}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Last Sent:</span>
                        <div className="text-gray-600">
                          {formatDateTime(notification.lastSentAt)}
                        </div>
                      </div>
                    </div>
                    
                    {notification.sendImmediately && (
                      <div className="mt-3">
                        <Badge variant="outline" className="border-orange-200 text-orange-700">
                          Sends Immediately
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Settings */}
      {userId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Your Notification Preferences
            </CardTitle>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications on your device</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Get updates via email</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Receive text messages</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              
              <Button 
                onClick={onNotificationSettings}
                className="w-full"
                variant="outline"
              >
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}