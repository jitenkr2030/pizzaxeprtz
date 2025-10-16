"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ChefHat, User, Mail, Phone, MapPin, Calendar, ShoppingCart, CreditCard, Shield, Bell, Settings, Activity, Edit, Save, Eye, Trash2, Plus, Clock, Truck, CheckCircle, AlertCircle, Star } from "lucide-react"
import Link from "next/link"
import { PaymentService, Order } from "@/lib/payment"

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'customer' | 'admin' | 'manager' | 'staff' | 'delivery'
  status: 'active' | 'inactive'
  joinDate: string
  lastLogin: string
  avatar: string
  
  // Personal Information
  dateOfBirth: string
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  bio: string
  
  // Address
  addresses: {
    id: string
    type: 'home' | 'work' | 'other'
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    isDefault: boolean
  }[]
  
  // Order History
  totalOrders: number
  totalSpent: number
  favoriteItems: string[]
  recentOrders: Order[]
  
  // Payment Methods
  paymentMethods: {
    id: string
    type: 'credit-card' | 'debit-card' | 'paypal' | 'cash'
    last4: string
    expiryDate: string
    isDefault: boolean
  }[]
  
  // Preferences
  preferences: {
    emailNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
    orderUpdates: boolean
    promotionalOffers: boolean
    dietaryPreferences: string[]
    favoriteCuisines: string[]
  }
  
  // Security
  security: {
    twoFactorEnabled: boolean
    lastPasswordChange: string
    loginHistory: {
      date: string
      device: string
      location: string
      ip: string
    }[]
    activeSessions: {
      id: string
      device: string
      location: string
      lastActivity: string
    }[]
  }
}

const sampleProfile: UserProfile = {
  id: "1",
  firstName: "Emily",
  lastName: "Brown",
  email: "emily.brown@email.com",
  phone: "+1 (555) 234-5678",
  role: "customer",
  status: "active",
  joinDate: "2023-08-15",
  lastLogin: "2024-01-20T15:30:00",
  avatar: "/api/placeholder/80/80",
  
  dateOfBirth: "1990-05-15",
  gender: "female",
  bio: "Pizza lover and food enthusiast. Enjoy trying new combinations and sharing with friends.",
  
  addresses: [
    {
      id: "1",
      type: "home",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      isDefault: true
    },
    {
      id: "2",
      type: "work",
      street: "456 Office Boulevard",
      city: "New York",
      state: "NY",
      zipCode: "10005",
      country: "United States",
      isDefault: false
    }
  ],
  
  totalOrders: 24,
  totalSpent: 486.50,
  favoriteItems: ["Margherita Classic", "BBQ Chicken", "Garlic Bread"],
  recentOrders: [
    {
      id: "order_1705789200000_abc123",
      userId: "1",
      items: [
        { id: "1", name: "Paneer Tikka Pizza", price: 16.99, quantity: 2 },
        { id: "8", name: "Veg Samosa (2 pcs)", price: 6.99, quantity: 1 }
      ],
      totalAmount: 42.97,
      status: "delivered" as const,
      paymentStatus: "paid" as const,
      deliveryAddress: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        phone: "+1 (555) 234-5678"
      },
      orderDate: new Date("2024-01-20T15:30:00"),
      estimatedDeliveryTime: new Date("2024-01-20T16:15:00"),
      paymentMethod: "credit_card",
      transactionId: "txn_1705789200000_abc123"
    },
    {
      id: "order_1705616400000_def456",
      userId: "1",
      items: [
        { id: "2", name: "Tandoori Chicken Pizza", price: 18.99, quantity: 1 },
        { id: "69", name: "Masala Chai", price: 3.99, quantity: 2 }
      ],
      totalAmount: 26.97,
      status: "delivered" as const,
      paymentStatus: "paid" as const,
      deliveryAddress: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        phone: "+1 (555) 234-5678"
      },
      orderDate: new Date("2024-01-18T18:45:00"),
      estimatedDeliveryTime: new Date("2024-01-18T19:30:00"),
      paymentMethod: "credit_card",
      transactionId: "txn_1705616400000_def456"
    },
    {
      id: "order_1705443600000_ghi789",
      userId: "1",
      items: [
        { id: "47", name: "Veg Dum Biryani", price: 16.99, quantity: 1 },
        { id: "55", name: "Boondi Raita", price: 5.99, quantity: 1 }
      ],
      totalAmount: 25.98,
      status: "delivered" as const,
      paymentStatus: "paid" as const,
      deliveryAddress: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        phone: "+1 (555) 234-5678"
      },
      orderDate: new Date("2024-01-15T12:20:00"),
      estimatedDeliveryTime: new Date("2024-01-15T13:05:00"),
      paymentMethod: "credit_card",
      transactionId: "txn_1705443600000_ghi789"
    }
  ],
  
  paymentMethods: [
    {
      id: "1",
      type: "credit-card",
      last4: "4242",
      expiryDate: "12/25",
      isDefault: true
    },
    {
      id: "2",
      type: "paypal",
      last4: "",
      expiryDate: "",
      isDefault: false
    }
  ],
  
  preferences: {
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: true,
    orderUpdates: true,
    promotionalOffers: true,
    dietaryPreferences: ["vegetarian-options"],
    favoriteCuisines: ["italian", "american", "asian"]
  },
  
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: "2024-01-10",
    loginHistory: [
      {
        date: "2024-01-20T15:30:00",
        device: "Chrome on Windows",
        location: "New York, NY",
        ip: "192.168.1.1"
      },
      {
        date: "2024-01-19T18:45:00",
        device: "Safari on iPhone",
        location: "New York, NY",
        ip: "192.168.1.2"
      },
      {
        date: "2024-01-18T12:20:00",
        device: "Mobile App",
        location: "New York, NY",
        ip: "192.168.1.3"
      }
    ],
    activeSessions: [
      {
        id: "1",
        device: "Chrome on Windows",
        location: "New York, NY",
        lastActivity: "2024-01-20T15:30:00"
      },
      {
        id: "2",
        device: "Mobile App",
        location: "New York, NY",
        lastActivity: "2024-01-20T14:15:00"
      }
    ]
  }
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile>(sampleProfile)
  const [orders, setOrders] = useState<Order[]>(sampleProfile.recentOrders)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile>(sampleProfile)

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const updatePreference = (key: keyof UserProfile['preferences'], value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-blue-100 text-blue-800'
      case 'manager': return 'bg-green-100 text-green-800'
      case 'staff': return 'bg-orange-100 text-orange-800'
      case 'delivery': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isEditing ? (
                <div className="flex space-x-2">
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-red-600 hover:bg-red-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </span>
              </div>
              <CardTitle className="text-xl">
                {profile.firstName} {profile.lastName}
              </CardTitle>
              <CardDescription>{profile.email}</CardDescription>
              <Badge className={getRoleColor(profile.role)}>
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </Badge>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-600" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                  <span>Member since {new Date(profile.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm">
                  <ShoppingCart className="h-4 w-4 mr-2 text-gray-600" />
                  <span>{profile.totalOrders} orders • ${profile.totalSpent.toFixed(2)} spent</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{profile.totalOrders}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${profile.totalSpent.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{profile.addresses.length}</div>
                  <div className="text-sm text-gray-600">Saved Addresses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{profile.paymentMethods.length}</div>
                  <div className="text-sm text-gray-600">Payment Methods</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your personal details and account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          value={editedProfile.firstName}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      ) : (
                        <div className="mt-1 text-sm">{profile.firstName}</div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          value={editedProfile.lastName}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      ) : (
                        <div className="mt-1 text-sm">{profile.lastName}</div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                        />
                      ) : (
                        <div className="mt-1 text-sm">{profile.email}</div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      ) : (
                        <div className="mt-1 text-sm">{profile.phone}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={editedProfile.dateOfBirth}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        />
                      ) : (
                        <div className="mt-1 text-sm">{new Date(profile.dateOfBirth).toLocaleDateString()}</div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      {isEditing ? (
                        <Select value={editedProfile.gender} onValueChange={(value) => setEditedProfile(prev => ({ ...prev, gender: value as any }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="mt-1 text-sm">{profile.gender.replace('-', ' ')}</div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      {isEditing ? (
                        <textarea
                          id="bio"
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                          rows={3}
                          value={editedProfile.bio}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                        />
                      ) : (
                        <div className="mt-1 text-sm">{profile.bio}</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses</CardDescription>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.addresses.map(address => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{address.type}</Badge>
                            {address.isDefault && (
                              <Badge className="bg-green-100 text-green-800">Default</Badge>
                            )}
                          </div>
                          <div className="text-sm">
                            <div>{address.street}</div>
                            <div>{address.city}, {address.state} {address.zipCode}</div>
                            <div>{address.country}</div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View your recent orders and track their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      {/* Order Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium text-lg">Order #{order.id}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(order.orderDate).toLocaleDateString()} • {new Date(order.orderDate).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${order.totalAmount.toFixed(2)}</div>
                          <Badge className={
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                            order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      {/* Order Status Timeline */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className={`flex items-center ${order.status === 'confirmed' || order.status === 'preparing' || order.status === 'out_for_delivery' || order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirmed
                          </div>
                          <div className={`flex items-center ${order.status === 'preparing' || order.status === 'out_for_delivery' || order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                            <ChefHat className="h-4 w-4 mr-1" />
                            Preparing
                          </div>
                          <div className={`flex items-center ${order.status === 'out_for_delivery' || order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                            <Truck className="h-4 w-4 mr-1" />
                            On the way
                          </div>
                          <div className={`flex items-center ${order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Delivered
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-3">
                        <div className="text-sm font-medium mb-2">Items:</div>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm text-gray-600 flex justify-between">
                              <span>{item.quantity}x {item.name}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Information */}
                      <div className="mb-3">
                        <div className="text-sm font-medium mb-1">Delivery Address:</div>
                        <div className="text-sm text-gray-600">
                          {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                        </div>
                        <div className="text-sm text-gray-600">Phone: {order.deliveryAddress.phone}</div>
                      </div>

                      {/* Payment Information */}
                      <div className="mb-3">
                        <div className="text-sm font-medium mb-1">Payment:</div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Method: {order.paymentMethod.replace('_', ' ')}</span>
                          <Badge className="bg-green-100 text-green-800">Paid</Badge>
                          {order.transactionId && (
                            <span className="font-mono text-xs">ID: {order.transactionId}</span>
                          )}
                        </div>
                      </div>

                      {/* Estimated Delivery */}
                      {order.status !== 'delivered' && (
                        <div className="mb-3">
                          <div className="text-sm font-medium mb-1 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Estimated Delivery:
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(order.estimatedDeliveryTime).toLocaleString()}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-2">
                        {order.status === 'delivered' && (
                          <Button size="sm" variant="outline">
                            <Star className="h-3 w-3 mr-1" />
                            Rate Order
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        {order.status === 'delivered' && (
                          <Link href="/">
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                              Reorder
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}

                  {orders.length === 0 && (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                      <Link href="/">
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          Start Ordering
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Order Statistics</CardTitle>
                <CardDescription>Your ordering activity and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${orders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      ${orders.length > 0 ? (orders.reduce((total, order) => total + order.totalAmount, 0) / orders.length).toFixed(2) : '0.00'}
                    </div>
                    <div className="text-sm text-gray-600">Average Order</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {orders.filter(order => order.status === 'delivered').length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment options</CardDescription>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.paymentMethods.map(method => (
                    <div key={method.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-8 w-8 text-gray-600" />
                          <div>
                            <div className="font-medium">
                              {method.type === 'credit-card' ? 'Credit Card' : 
                               method.type === 'debit-card' ? 'Debit Card' : 
                               method.type === 'paypal' ? 'PayPal' : 'Cash'}
                            </div>
                            {method.type !== 'paypal' && method.type !== 'cash' && (
                              <div className="text-sm text-gray-600">•••• {method.last4}</div>
                            )}
                            {method.expiryDate && (
                              <div className="text-sm text-gray-600">Expires {method.expiryDate}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {method.isDefault && (
                            <Badge className="bg-green-100 text-green-800">Default</Badge>
                          )}
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-600">Receive updates via email</div>
                    </div>
                    <Switch
                      checked={editedProfile.preferences.emailNotifications}
                      onCheckedChange={(checked) => updatePreference('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-sm text-gray-600">Receive updates via text message</div>
                    </div>
                    <Switch
                      checked={editedProfile.preferences.smsNotifications}
                      onCheckedChange={(checked) => updatePreference('smsNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Marketing Emails</div>
                      <div className="text-sm text-gray-600">Receive promotional offers and updates</div>
                    </div>
                    <Switch
                      checked={editedProfile.preferences.marketingEmails}
                      onCheckedChange={(checked) => updatePreference('marketingEmails', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Order Updates</div>
                      <div className="text-sm text-gray-600">Get notified about order status changes</div>
                    </div>
                    <Switch
                      checked={editedProfile.preferences.orderUpdates}
                      onCheckedChange={(checked) => updatePreference('orderUpdates', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Promotional Offers</div>
                      <div className="text-sm text-gray-600">Receive special discounts and offers</div>
                    </div>
                    <Switch
                      checked={editedProfile.preferences.promotionalOffers}
                      onCheckedChange={(checked) => updatePreference('promotionalOffers', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-gray-600">Add an extra layer of security</div>
                      </div>
                      <Switch
                        checked={editedProfile.security.twoFactorEnabled}
                        onCheckedChange={(checked) => {
                          setEditedProfile(prev => ({
                            ...prev,
                            security: { ...prev.security, twoFactorEnabled: checked }
                          }))
                        }}
                      />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="text-sm text-gray-600 mb-2">Last Password Change</div>
                      <div className="font-medium">{new Date(profile.security.lastPasswordChange).toLocaleDateString()}</div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>Manage your logged-in devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.security.activeSessions.map(session => (
                      <div key={session.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{session.device}</div>
                          <div className="text-sm text-gray-600">{session.location}</div>
                          <div className="text-xs text-gray-500">
                            Last activity: {new Date(session.lastActivity).toLocaleString()}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Login History</CardTitle>
                <CardDescription>Recent account activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.security.loginHistory.map((login, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium">{login.device}</div>
                        <div className="text-gray-600">{login.location} • {login.ip}</div>
                      </div>
                      <div className="text-gray-500">
                        {new Date(login.date).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}