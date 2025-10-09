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
import { Progress } from "@/components/ui/progress"
import { ChefHat, Plus, Building, Users, DollarSign, TrendingUp, Settings, MapPin, Phone, Mail, Calendar, Activity, BarChart3, Store } from "lucide-react"

interface Store {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  manager: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  plan: 'basic' | 'professional' | 'enterprise'
  subscriptionStart: string
  subscriptionEnd: string
  monthlyRevenue: number
  totalOrders: number
  customerCount: number
  staffCount: number
  deliveryPartners: number
  menuItems: number
  inventoryValue: number
  lastActive: string
  features: string[]
  settings: {
    onlineOrdering: boolean
    delivery: boolean
    pickup: boolean
    reservations: boolean
    loyaltyProgram: boolean
    analytics: boolean
    inventoryManagement: boolean
    staffManagement: boolean
  }
}

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  maxStores: number
  maxStaff: number
  maxMenuItems: number
  support: string
  popular?: boolean
}

const sampleStores: Store[] = [
  {
    id: "1",
    name: "Pizzaxperts Downtown",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    phone: "+1 (555) 123-4567",
    email: "downtown@pizzaxperts.com",
    manager: "John Smith",
    status: "active",
    plan: "enterprise",
    subscriptionStart: "2024-01-01",
    subscriptionEnd: "2024-12-31",
    monthlyRevenue: 45200,
    totalOrders: 1234,
    customerCount: 856,
    staffCount: 12,
    deliveryPartners: 8,
    menuItems: 45,
    inventoryValue: 15420,
    lastActive: "2024-01-20T18:30:00",
    features: ["online-ordering", "delivery", "pickup", "reservations", "loyalty", "analytics", "inventory", "staff"],
    settings: {
      onlineOrdering: true,
      delivery: true,
      pickup: true,
      reservations: true,
      loyaltyProgram: true,
      analytics: true,
      inventoryManagement: true,
      staffManagement: true
    }
  },
  {
    id: "2",
    name: "Pizzaxperts Brooklyn",
    address: "456 Pizza Avenue",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11201",
    phone: "+1 (555) 987-6543",
    email: "brooklyn@pizzaxperts.com",
    manager: "Sarah Johnson",
    status: "active",
    plan: "professional",
    subscriptionStart: "2024-01-15",
    subscriptionEnd: "2024-07-15",
    monthlyRevenue: 28500,
    totalOrders: 856,
    customerCount: 623,
    staffCount: 8,
    deliveryPartners: 5,
    menuItems: 32,
    inventoryValue: 8900,
    lastActive: "2024-01-20T17:45:00",
    features: ["online-ordering", "delivery", "pickup", "analytics", "inventory"],
    settings: {
      onlineOrdering: true,
      delivery: true,
      pickup: true,
      reservations: false,
      loyaltyProgram: false,
      analytics: true,
      inventoryManagement: true,
      staffManagement: false
    }
  },
  {
    id: "3",
    name: "Pizzaxperts Queens",
    address: "789 Elm Street",
    city: "Queens",
    state: "NY",
    zipCode: "11101",
    phone: "+1 (555) 456-7890",
    email: "queens@pizzaxperts.com",
    manager: "Mike Davis",
    status: "pending",
    plan: "basic",
    subscriptionStart: "2024-01-20",
    subscriptionEnd: "2024-04-20",
    monthlyRevenue: 0,
    totalOrders: 0,
    customerCount: 0,
    staffCount: 3,
    deliveryPartners: 0,
    menuItems: 0,
    inventoryValue: 0,
    lastActive: "2024-01-20T16:00:00",
    features: ["online-ordering", "pickup"],
    settings: {
      onlineOrdering: true,
      delivery: false,
      pickup: true,
      reservations: false,
      loyaltyProgram: false,
      analytics: false,
      inventoryManagement: false,
      staffManagement: false
    }
  }
]

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for small pizza shops",
    price: 49,
    features: ["Online Ordering", "Pickup Management", "Basic Analytics", "Email Support"],
    maxStores: 1,
    maxStaff: 5,
    maxMenuItems: 25,
    support: "Email"
  },
  {
    id: "professional",
    name: "Professional",
    description: "Great for growing businesses",
    price: 99,
    features: ["Everything in Basic", "Delivery Management", "Advanced Analytics", "Inventory Management", "Priority Support"],
    maxStores: 3,
    maxStaff: 15,
    maxMenuItems: 50,
    support: "Priority",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large pizza chains",
    price: 299,
    features: ["Everything in Professional", "Multi-Store Management", "Advanced Features", "24/7 Phone Support", "Custom Integrations"],
    maxStores: 10,
    maxStaff: 50,
    maxMenuItems: 100,
    support: "24/7 Phone"
  }
]

export default function SuperAdminDashboard() {
  const [stores, setStores] = useState<Store[]>(sampleStores)
  const [plans] = useState<SubscriptionPlan[]>(subscriptionPlans)
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

  const toggleStoreStatus = (storeId: string) => {
    setStores(prev => prev.map(store => {
      if (store.id === storeId) {
        const newStatus = store.status === 'active' ? 'inactive' : 'active'
        return { ...store, status: newStatus }
      }
      return store
    }))
  }

  const getStatusColor = (status: Store['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanColor = (plan: Store['plan']) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800'
      case 'professional': return 'bg-purple-100 text-purple-800'
      case 'enterprise': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTotalRevenue = () => {
    return stores.reduce((total, store) => total + store.monthlyRevenue, 0)
  }

  const getTotalOrders = () => {
    return stores.reduce((total, store) => total + store.totalOrders, 0)
  }

  const getTotalCustomers = () => {
    return stores.reduce((total, store) => total + store.customerCount, 0)
  }

  const getActiveStores = () => stores.filter(s => s.status === 'active')
  const getPendingStores = () => stores.filter(s => s.status === 'pending')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Multi-Store Management</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Stores</p>
                  <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${getTotalRevenue().toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalCustomers().toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalOrders().toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Store Management Tabs */}
        <Tabs defaultValue="stores" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full grid-cols-4 max-w-lg">
              <TabsTrigger value="stores">Stores</TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <Dialog open={isAddStoreOpen} onOpenChange={setIsAddStoreOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Store
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Store</DialogTitle>
                  <DialogDescription>
                    Create a new store location in your multi-store network.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="storeName" className="text-right">
                      Store Name
                    </Label>
                    <Input
                      id="storeName"
                      className="col-span-3"
                      placeholder="e.g., Pizzaxperts Downtown"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input
                      id="address"
                      className="col-span-3"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="city" className="text-right">
                      City
                    </Label>
                    <Input
                      id="city"
                      className="col-span-3"
                      placeholder="New York"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="manager" className="text-right">
                      Manager
                    </Label>
                    <Input
                      id="manager"
                      className="col-span-3"
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="plan" className="text-right">
                      Plan
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map(plan => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - ${plan.price}/month
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddStoreOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddStoreOpen(false)} className="bg-red-600 hover:bg-red-700">
                    Create Store
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="stores" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stores.map(store => (
                <Card key={store.id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          <Store className="h-5 w-5 mr-2" />
                          {store.name}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {store.address}, {store.city}, {store.state} {store.zipCode}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={store.status === 'active'}
                          onCheckedChange={() => toggleStoreStatus(store.id)}
                        />
                        <Badge className={getStatusColor(store.status)}>
                          {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                        </Badge>
                        <Badge className={getPlanColor(store.plan)}>
                          {store.plan.charAt(0).toUpperCase() + store.plan.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-600" />
                          <span>{store.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-600" />
                          <span>{store.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-600" />
                          <span>Manager: {store.manager}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                          <span>Until: {new Date(store.subscriptionEnd).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600">${store.monthlyRevenue.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Monthly Revenue</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">{store.totalOrders}</div>
                          <div className="text-xs text-gray-600">Total Orders</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{store.customerCount}</div>
                          <div className="text-xs text-gray-600">Customers</div>
                        </div>
                      </div>

                      {/* Store Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Staff:</span>
                          <span>{store.staffCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Partners:</span>
                          <span>{store.deliveryPartners}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Menu Items:</span>
                          <span>{store.menuItems}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Inventory Value:</span>
                          <span>${store.inventoryValue.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Active Features:</div>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(store.settings)
                            .filter(([_, enabled]) => enabled)
                            .map(([feature, _]) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setSelectedStore(store)}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Manage
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Activity className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <BarChart3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map(plan => (
                <Card key={plan.id} className={`transition-all hover:shadow-lg ${plan.popular ? 'border-red-200 ring-2 ring-red-200' : ''}`}>
                  {plan.popular && (
                    <div className="bg-red-600 text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="text-3xl font-bold text-red-600">
                      ${plan.price}
                      <span className="text-sm text-gray-600">/month</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Features:</h4>
                        <ul className="space-y-1 text-sm">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-green-600 rounded-full mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Max Stores:</span>
                          <span className="font-medium">{plan.maxStores}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Staff:</span>
                          <span className="font-medium">{plan.maxStaff}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Menu Items:</span>
                          <span className="font-medium">{plan.maxMenuItems}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Support:</span>
                          <span className="font-medium">{plan.support}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                      >
                        Choose Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue by Store */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Store</CardTitle>
                  <CardDescription>Monthly revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stores
                      .filter(store => store.status === 'active')
                      .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
                      .map(store => (
                        <div key={store.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{store.name}</span>
                            <span>${store.monthlyRevenue.toLocaleString()}</span>
                          </div>
                          <Progress 
                            value={(store.monthlyRevenue / Math.max(...stores.map(s => s.monthlyRevenue))) * 100} 
                            className="h-2"
                          />
                        </div>
                      ))}
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
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Average Revenue per Store</div>
                        <div className="text-2xl font-bold">
                          ${(getTotalRevenue() / getActiveStores().length).toFixed(2)}
                        </div>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Average Orders per Store</div>
                        <div className="text-2xl font-bold">
                          {Math.round(getTotalOrders() / getActiveStores().length)}
                        </div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Customer Retention Rate</div>
                        <div className="text-2xl font-bold">78.5%</div>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Active Stores</div>
                        <div className="text-2xl font-bold">{getActiveStores().length}</div>
                      </div>
                      <Building className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Global Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Global Settings</CardTitle>
                  <CardDescription>Platform-wide configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">New Store Registration</div>
                        <div className="text-sm text-gray-600">Allow new store registrations</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-gray-600">Send system-wide notifications</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Analytics Tracking</div>
                        <div className="text-sm text-gray-600">Collect usage analytics</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Auto Updates</div>
                        <div className="text-sm text-gray-600">Automatic system updates</div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Platform health and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Platform Status</div>
                        <div className="text-sm text-gray-600">All systems operational</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Database Status</div>
                        <div className="text-sm text-gray-600">Connected and healthy</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">API Response Time</div>
                        <div className="text-sm text-gray-600">Average response time</div>
                      </div>
                      <span className="font-medium">245ms</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Active Users</div>
                        <div className="text-sm text-gray-600">Currently online</div>
                      </div>
                      <span className="font-medium">1,247</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}