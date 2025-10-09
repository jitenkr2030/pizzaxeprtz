"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { ChefHat, Plus, Users, UserCheck, UserX, Mail, Phone, Calendar, Activity, Settings, Eye, Edit, Trash2, Shield, Crown, Store, Truck } from "lucide-react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'superadmin' | 'admin' | 'manager' | 'staff' | 'delivery' | 'customer'
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  storeId?: string
  storeName?: string
  lastLogin: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  avatar: string
  permissions: string[]
  settings: {
    emailNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
    twoFactorAuth: boolean
  }
  activity: {
    lastActivity: string
    loginCount: number
    devices: string[]
  }
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  color: string
  icon: string
}

const roles: Role[] = [
  {
    id: 'superadmin',
    name: 'Super Admin',
    description: 'Full system access',
    permissions: ['all'],
    color: 'bg-purple-100 text-purple-800',
    icon: 'Crown'
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Store management access',
    permissions: ['manage_store', 'manage_users', 'view_analytics', 'manage_inventory'],
    color: 'bg-blue-100 text-blue-800',
    icon: 'Shield'
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Store operations management',
    permissions: ['manage_orders', 'manage_staff', 'view_reports'],
    color: 'bg-green-100 text-green-800',
    icon: 'Store'
  },
  {
    id: 'staff',
    name: 'Staff',
    description: 'Kitchen and service staff',
    permissions: ['view_orders', 'update_order_status'],
    color: 'bg-orange-100 text-orange-800',
    icon: 'Users'
  },
  {
    id: 'delivery',
    name: 'Delivery',
    description: 'Delivery partners',
    permissions: ['view_delivery_orders', 'update_delivery_status'],
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'Truck'
  },
  {
    id: 'customer',
    name: 'Customer',
    description: 'Regular customers',
    permissions: ['place_orders', 'view_profile'],
    color: 'bg-gray-100 text-gray-800',
    icon: 'UserCheck'
  }
]

const sampleUsers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@pizzaxperts.com",
    phone: "+1 (555) 123-4567",
    role: "superadmin",
    status: "active",
    lastLogin: "2024-01-20T18:30:00",
    joinDate: "2023-01-15",
    totalOrders: 0,
    totalSpent: 0,
    avatar: "/api/placeholder/40/40",
    permissions: ['all'],
    settings: {
      emailNotifications: true,
      smsNotifications: true,
      marketingEmails: false,
      twoFactorAuth: true
    },
    activity: {
      lastActivity: "2024-01-20T18:30:00",
      loginCount: 342,
      devices: ["Chrome on Windows", "Safari on iPhone"]
    }
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@pizzaxperts.com",
    phone: "+1 (555) 987-6543",
    role: "admin",
    status: "active",
    storeId: "1",
    storeName: "Pizzaxperts Downtown",
    lastLogin: "2024-01-20T17:45:00",
    joinDate: "2023-03-20",
    totalOrders: 0,
    totalSpent: 0,
    avatar: "/api/placeholder/40/40",
    permissions: ['manage_store', 'manage_users', 'view_analytics', 'manage_inventory'],
    settings: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      twoFactorAuth: true
    },
    activity: {
      lastActivity: "2024-01-20T17:45:00",
      loginCount: 156,
      devices: ["Chrome on macOS", "Firefox on Windows"]
    }
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Davis",
    email: "mike.davis@pizzaxperts.com",
    phone: "+1 (555) 456-7890",
    role: "manager",
    status: "active",
    storeId: "2",
    storeName: "Pizzaxperts Brooklyn",
    lastLogin: "2024-01-20T16:20:00",
    joinDate: "2023-06-10",
    totalOrders: 0,
    totalSpent: 0,
    avatar: "/api/placeholder/40/40",
    permissions: ['manage_orders', 'manage_staff', 'view_reports'],
    settings: {
      emailNotifications: true,
      smsNotifications: true,
      marketingEmails: false,
      twoFactorAuth: false
    },
    activity: {
      lastActivity: "2024-01-20T16:20:00",
      loginCount: 89,
      devices: ["Chrome on Windows", "Mobile App"]
    }
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Brown",
    email: "emily.brown@email.com",
    phone: "+1 (555) 234-5678",
    role: "customer",
    status: "active",
    lastLogin: "2024-01-20T15:30:00",
    joinDate: "2023-08-15",
    totalOrders: 24,
    totalSpent: 486.50,
    avatar: "/api/placeholder/40/40",
    permissions: ['place_orders', 'view_profile'],
    settings: {
      emailNotifications: true,
      smsNotifications: true,
      marketingEmails: true,
      twoFactorAuth: false
    },
    activity: {
      lastActivity: "2024-01-20T15:30:00",
      loginCount: 45,
      devices: ["Mobile App", "Safari on iPhone"]
    }
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@delivery.com",
    phone: "+1 (555) 345-6789",
    role: "delivery",
    status: "active",
    storeId: "1",
    storeName: "Pizzaxperts Downtown",
    lastLogin: "2024-01-20T14:15:00",
    joinDate: "2023-09-01",
    totalOrders: 0,
    totalSpent: 0,
    avatar: "/api/placeholder/40/40",
    permissions: ['view_delivery_orders', 'update_delivery_status'],
    settings: {
      emailNotifications: true,
      smsNotifications: true,
      marketingEmails: false,
      twoFactorAuth: false
    },
    activity: {
      lastActivity: "2024-01-20T14:15:00",
      loginCount: 67,
      devices: ["Mobile App", "Chrome on Android"]
    }
  },
  {
    id: "6",
    firstName: "Lisa",
    lastName: "Chen",
    email: "lisa.chen@email.com",
    phone: "+1 (555) 456-7890",
    role: "customer",
    status: "pending",
    lastLogin: "",
    joinDate: "2024-01-20",
    totalOrders: 0,
    totalSpent: 0,
    avatar: "/api/placeholder/40/40",
    permissions: ['place_orders', 'view_profile'],
    settings: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      twoFactorAuth: false
    },
    activity: {
      lastActivity: "2024-01-20T12:00:00",
      loginCount: 0,
      devices: []
    }
  }
]

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active'
        return { ...user, status: newStatus }
      }
      return user
    }))
  }

  const approveUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ))
  }

  const getRoleInfo = (role: string) => {
    return roles.find(r => r.id === role) || roles[5] // Default to customer
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTotalUsers = () => users.length
  const getActiveUsers = () => users.filter(u => u.status === 'active').length
  const getPendingUsers = () => users.filter(u => u.status === 'pending').length
  const getStaffUsers = () => users.filter(u => ['superadmin', 'admin', 'manager', 'staff', 'delivery'].includes(u.role)).length
  const getCustomerUsers = () => users.filter(u => u.role === 'customer').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin Panel</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalUsers()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{getActiveUsers()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserX className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{getPendingUsers()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Staff</p>
                  <p className="text-2xl font-bold text-gray-900">{getStaffUsers()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Crown className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{getCustomerUsers()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* User Management Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">All Users</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="activity">User Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map(user => {
                const roleInfo = getRoleInfo(user.role)
                const IconComponent = roleInfo.icon === 'Crown' ? Crown :
                                   roleInfo.icon === 'Shield' ? Shield :
                                   roleInfo.icon === 'Store' ? Store :
                                   roleInfo.icon === 'Users' ? Users :
                                   roleInfo.icon === 'Truck' ? Truck : UserCheck

                return (
                  <Card key={user.id} className="transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {user.firstName} {user.lastName}
                            </CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={user.status === 'active'}
                            onCheckedChange={() => toggleUserStatus(user.id)}
                          />
                          <Badge className={getStatusColor(user.status)}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-4 w-4" />
                            <Badge className={roleInfo.color}>
                              {roleInfo.name}
                            </Badge>
                          </div>
                          {user.storeName && (
                            <span className="text-xs text-gray-600">{user.storeName}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{user.phone}</span>
                        </div>
                        
                        {user.role === 'customer' && (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Orders:</span>
                              <span className="font-medium ml-1">{user.totalOrders}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Spent:</span>
                              <span className="font-medium ml-1">${user.totalSpent.toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                          <div>Joined: {new Date(user.joinDate).toLocaleDateString()}</div>
                          {user.lastLogin && (
                            <div>Last login: {new Date(user.lastLogin).toLocaleDateString()}</div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {getPendingUsers().length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending user approvals</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {users.filter(u => u.status === 'pending').map(user => {
                  const roleInfo = getRoleInfo(user.role)
                  const IconComponent = roleInfo.icon === 'Crown' ? Crown :
                                     roleInfo.icon === 'Shield' ? Shield :
                                     roleInfo.icon === 'Store' ? Store :
                                     roleInfo.icon === 'Users' ? Users :
                                     roleInfo.icon === 'Truck' ? Truck : UserCheck

                  return (
                    <Card key={user.id} className="border-yellow-200 bg-yellow-50">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {user.firstName} {user.lastName}
                              </CardTitle>
                              <CardDescription>{user.email}</CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Pending Approval
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-4 w-4" />
                            <Badge className={roleInfo.color}>
                              {roleInfo.name}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{user.phone}</span>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <div>Applied: {new Date(user.joinDate).toLocaleDateString()}</div>
                          </div>
                          
                          <div className="flex space-x-2 pt-2">
                            <Button 
                              size="sm" 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => approveUser(user.id)}
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-3 w-3" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map(role => {
                const IconComponent = role.icon === 'Crown' ? Crown :
                                   role.icon === 'Shield' ? Shield :
                                   role.icon === 'Store' ? Store :
                                   role.icon === 'Users' ? Users :
                                   role.icon === 'Truck' ? Truck : UserCheck

                const usersInRole = users.filter(u => u.role === role.id).length

                return (
                  <Card key={role.id} className="transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-8 w-8 text-gray-600" />
                        <div>
                          <CardTitle className="text-lg">{role.name}</CardTitle>
                          <CardDescription>{role.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Users in Role:</span>
                          <Badge variant="outline">{usersInRole}</Badge>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">Permissions:</div>
                          <div className="space-y-1">
                            {role.permissions.map((permission, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <div className="w-2 h-2 bg-green-600 rounded-full mr-2" />
                                {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Button size="sm" variant="outline" className="w-full">
                          <Settings className="h-3 w-3 mr-1" />
                          Edit Role
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {users.filter(u => u.status === 'active').slice(0, 6).map(user => {
                const roleInfo = getRoleInfo(user.role)
                const IconComponent = roleInfo.icon === 'Crown' ? Crown :
                                   roleInfo.icon === 'Shield' ? Shield :
                                   roleInfo.icon === 'Store' ? Store :
                                   roleInfo.icon === 'Users' ? Users :
                                   roleInfo.icon === 'Truck' ? Truck : UserCheck

                return (
                  <Card key={user.id}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {user.firstName} {user.lastName}
                          </CardTitle>
                          <CardDescription>{user.email}</CardDescription>
                        </div>
                        <Badge className={roleInfo.color}>
                          {roleInfo.name}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Login Count:</span>
                            <span className="font-medium ml-1">{user.activity.loginCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Last Activity:</span>
                            <span className="font-medium ml-1">
                              {new Date(user.activity.lastActivity).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">Active Devices:</div>
                          <div className="space-y-1">
                            {user.activity.devices.map((device, index) => (
                              <div key={index} className="flex items-center text-sm text-gray-600">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                                {device}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1 text-gray-600" />
                            <span>Email: {user.settings.emailNotifications ? 'On' : 'Off'}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1 text-gray-600" />
                            <span>SMS: {user.settings.smsNotifications ? 'On' : 'Off'}</span>
                          </div>
                          <div className="flex items-center">
                            <Shield className="h-3 w-3 mr-1 text-gray-600" />
                            <span>2FA: {user.settings.twoFactorAuth ? 'On' : 'Off'}</span>
                          </div>
                          <div className="flex items-center">
                            <Activity className="h-3 w-3 mr-1 text-gray-600" />
                            <span>Marketing: {user.settings.marketingEmails ? 'On' : 'Off'}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}