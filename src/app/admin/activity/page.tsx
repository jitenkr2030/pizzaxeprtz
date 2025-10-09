"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ChefHat, Activity, Users, UserCheck, AlertTriangle, Clock, MapPin, Smartphone, Mail, Phone, Calendar, Filter, Download, Eye } from "lucide-react"

interface UserActivity {
  id: string
  userId: string
  userName: string
  userEmail: string
  userRole: string
  action: string
  resource: string
  resourceId: string
  timestamp: string
  ipAddress: string
  device: string
  location: string
  status: 'success' | 'failed' | 'warning'
  details: string
}

interface SystemAlert {
  id: string
  type: 'security' | 'performance' | 'system' | 'user'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: string
  resolved: boolean
  affectedUsers: number
}

interface ActivityStats {
  totalActivities: number
  uniqueUsers: number
  failedLogins: number
  securityEvents: number
  systemAlerts: number
  averageResponseTime: number
}

const sampleActivities: UserActivity[] = [
  {
    id: "1",
    userId: "1",
    userName: "John Smith",
    userEmail: "john.smith@pizzaxperts.com",
    userRole: "superadmin",
    action: "login",
    resource: "authentication",
    resourceId: "auth-1",
    timestamp: "2024-01-20T18:30:00",
    ipAddress: "192.168.1.1",
    device: "Chrome on Windows",
    location: "New York, NY",
    status: "success",
    details: "Successful login with 2FA"
  },
  {
    id: "2",
    userId: "2",
    userName: "Sarah Johnson",
    userEmail: "sarah.johnson@pizzaxperts.com",
    userRole: "admin",
    action: "update",
    resource: "user",
    resourceId: "user-4",
    timestamp: "2024-01-20T17:45:00",
    ipAddress: "192.168.1.2",
    device: "Chrome on macOS",
    location: "Brooklyn, NY",
    status: "success",
    details: "Updated user profile information"
  },
  {
    id: "3",
    userId: "4",
    userName: "Emily Brown",
    userEmail: "emily.brown@email.com",
    userRole: "customer",
    action: "order",
    resource: "order",
    resourceId: "order-1001",
    timestamp: "2024-01-20T15:30:00",
    ipAddress: "192.168.1.3",
    device: "Mobile App",
    location: "New York, NY",
    status: "success",
    details: "Placed order #1001 - Total: $32.97"
  },
  {
    id: "4",
    userId: "5",
    userName: "David Wilson",
    userEmail: "david.wilson@delivery.com",
    userRole: "delivery",
    action: "update",
    resource: "delivery",
    resourceId: "delivery-1",
    timestamp: "2024-01-20T14:15:00",
    ipAddress: "192.168.1.4",
    device: "Mobile App",
    location: "Queens, NY",
    status: "success",
    details: "Updated delivery status to 'in-transit'"
  },
  {
    id: "5",
    userId: "unknown",
    userName: "Unknown User",
    userEmail: "",
    userRole: "",
    action: "login",
    resource: "authentication",
    resourceId: "auth-failed-1",
    timestamp: "2024-01-20T13:20:00",
    ipAddress: "192.168.1.100",
    device: "Unknown Smartphone",
    location: "Unknown Location",
    status: "failed",
    details: "Failed login attempt - Invalid credentials"
  },
  {
    id: "6",
    userId: "3",
    userName: "Mike Davis",
    userEmail: "mike.davis@pizzaxperts.com",
    userRole: "manager",
    action: "view",
    resource: "analytics",
    resourceId: "analytics-1",
    timestamp: "2024-01-20T12:10:00",
    ipAddress: "192.168.1.5",
    device: "Chrome on Windows",
    location: "Brooklyn, NY",
    status: "success",
    details: "Viewed sales analytics dashboard"
  }
]

const sampleAlerts: SystemAlert[] = [
  {
    id: "1",
    type: "security",
    severity: "high",
    title: "Multiple Failed Login Attempts",
    description: "Detected multiple failed login attempts from IP address 192.168.1.100",
    timestamp: "2024-01-20T13:25:00",
    resolved: false,
    affectedUsers: 0
  },
  {
    id: "2",
    type: "performance",
    severity: "medium",
    title: "High Response Time",
    description: "API response time exceeded 2 seconds threshold",
    timestamp: "2024-01-20T11:30:00",
    resolved: true,
    affectedUsers: 150
  },
  {
    id: "3",
    type: "user",
    severity: "low",
    title: "New User Registration",
    description: "New user registration requires approval",
    timestamp: "2024-01-20T10:15:00",
    resolved: false,
    affectedUsers: 1
  },
  {
    id: "4",
    type: "system",
    severity: "critical",
    title: "Database Connection Issue",
    description: "Temporary database connectivity issues detected",
    timestamp: "2024-01-20T09:45:00",
    resolved: true,
    affectedUsers: 500
  }
]

const sampleStats: ActivityStats = {
  totalActivities: 15420,
  uniqueUsers: 892,
  failedLogins: 45,
  securityEvents: 12,
  systemAlerts: 8,
  averageResponseTime: 245
}

export default function UserActivityTracking() {
  const [activities] = useState<UserActivity[]>(sampleActivities)
  const [alerts] = useState<SystemAlert[]>(sampleAlerts)
  const [stats] = useState<ActivityStats>(sampleStats)
  const [selectedAction, setSelectedAction] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [timeRange, setTimeRange] = useState("24h")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = selectedAction === "all" || activity.action === selectedAction
    const matchesStatus = selectedStatus === "all" || activity.status === selectedStatus
    return matchesSearch && matchesAction && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActiveAlerts = () => alerts.filter(alert => !alert.resolved)
  const getCriticalAlerts = () => alerts.filter(alert => alert.severity === 'critical' && !alert.resolved)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">User Activity Tracking</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Security & Monitoring</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalActivities.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.uniqueUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed Logins</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.failedLogins}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Security Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.securityEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageResponseTime}ms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">System Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.systemAlerts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        {getCriticalAlerts().length > 0 && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCriticalAlerts().map(alert => (
                  <div key={alert.id} className="p-4 bg-white border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-red-100 text-red-800">{alert.severity.toUpperCase()}</Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="font-medium text-red-800 mb-1">{alert.title}</h4>
                    <p className="text-sm text-red-700 mb-2">{alert.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">
                        {alert.affectedUsers} users affected
                      </span>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Tracking Tabs */}
        <Tabs defaultValue="activities" className="space-y-6">
          <div className="flex justify-between items-start">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="alerts">System Alerts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <TabsContent value="activities" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Select value={selectedAction} onValueChange={setSelectedAction}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="login">Login</SelectItem>
                        <SelectItem value="logout">Logout</SelectItem>
                        <SelectItem value="create">Create</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="delete">Delete</SelectItem>
                        <SelectItem value="view">View</SelectItem>
                        <SelectItem value="order">Order</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">Last Hour</SelectItem>
                        <SelectItem value="24h">Last 24h</SelectItem>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Real-time user activity monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredActivities.map(activity => (
                    <div key={activity.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </Badge>
                            <span className="text-sm font-medium text-gray-900">
                              {activity.action.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-600">•</span>
                            <span className="text-sm text-gray-600">{activity.resource}</span>
                          </div>
                          
                          <div className="text-sm text-gray-900 mb-1">
                            <span className="font-medium">{activity.userName}</span>
                            {activity.userEmail && (
                              <span className="text-gray-600 ml-2">({activity.userEmail})</span>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            {activity.details}
                          </div>
                          
                          <div className="flex items-center space-x-6 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(activity.timestamp).toLocaleString()}
                            </div>
                            <div className="flex items-center">
                              <Smartphone className="h-3 w-3 mr-1" />
                              {activity.device}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {activity.location}
                            </div>
                            <div className="flex items-center">
                              <span className="font-mono">{activity.ipAddress}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {activity.userRole && (
                            <Badge variant="outline" className="text-xs">
                              {activity.userRole}
                            </Badge>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                    Active Alerts
                  </CardTitle>
                  <CardDescription>Alerts requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getActiveAlerts().map(alert => (
                      <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="font-medium mb-1">{alert.title}</h4>
                        <p className="text-sm mb-3">{alert.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">
                            {alert.affectedUsers} users affected
                          </span>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Resolve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Resolved Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-2 text-green-600" />
                    Resolved Alerts
                  </CardTitle>
                  <CardDescription>Recently resolved alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.filter(alert => alert.resolved).map(alert => (
                      <div key={alert.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{alert.severity.toUpperCase()}</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="font-medium mb-1">{alert.title}</h4>
                        <p className="text-sm mb-3">{alert.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-green-600">✓ Resolved</span>
                          <span className="text-xs">
                            {alert.affectedUsers} users affected
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity by Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity by Type</CardTitle>
                  <CardDescription>Breakdown of user activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'Login', count: 3420, percentage: 22 },
                      { type: 'Order', count: 2890, percentage: 19 },
                      { type: 'View', count: 4560, percentage: 30 },
                      { type: 'Update', count: 2340, percentage: 15 },
                      { type: 'Create', count: 1560, percentage: 10 },
                      { type: 'Delete', count: 650, percentage: 4 }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.type}</span>
                          <span>{item.count} ({item.percentage}%)</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Security Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Overview</CardTitle>
                  <CardDescription>Security-related activities and events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{stats.failedLogins}</div>
                        <div className="text-sm text-gray-600">Failed Logins</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.securityEvents}</div>
                        <div className="text-sm text-gray-600">Security Events</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Suspicious Activities</span>
                        <Badge className="bg-red-100 text-red-800">High</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Blocked IPs</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Password Resets</span>
                        <span className="font-medium">45</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Account Lockouts</span>
                        <span className="font-medium">3</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Activity Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>User Activity Timeline</CardTitle>
                <CardDescription>Activity patterns over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = new Date()
                    hour.setHours(hour.getHours() - (23 - i))
                    const activity = Math.floor(Math.random() * 100)
                    
                    return (
                      <div key={i} className="flex items-center space-x-4">
                        <span className="text-sm w-12">
                          {hour.getHours().toString().padStart(2, '0')}:00
                        </span>
                        <div className="flex-1">
                          <Progress value={activity} className="h-3" />
                        </div>
                        <span className="text-sm w-12 text-right">
                          {activity}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}