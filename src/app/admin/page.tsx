"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  ChefHat,
  Truck,
  Star,
  ArrowLeft,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  activeUsers: number
  pendingOrders: number
  todayOrders: number
  todayRevenue: number
  averageOrderValue: number
  customerSatisfaction: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  status: string
  totalAmount: number
  createdAt: Date
  estimatedDelivery?: Date
}

interface LowStockItem {
  id: string
  name: string
  currentStock: number
  minStock: number
  unit: string
}

const sampleStats: DashboardStats = {
  totalOrders: 1247,
  totalRevenue: 45678.50,
  activeUsers: 892,
  pendingOrders: 12,
  todayOrders: 45,
  todayRevenue: 1234.56,
  averageOrderValue: 36.67,
  customerSatisfaction: 4.8,
}

const recentOrders: RecentOrder[] = [
  {
    id: "1",
    orderNumber: "PX-2024-045",
    customerName: "John Doe",
    status: "PREPARING",
    totalAmount: 32.97,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000),
  },
  {
    id: "2",
    orderNumber: "PX-2024-044",
    customerName: "Jane Smith",
    status: "OUT_FOR_DELIVERY",
    totalAmount: 24.99,
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000),
  },
  {
    id: "3",
    orderNumber: "PX-2024-043",
    customerName: "Mike Johnson",
    status: "PENDING",
    totalAmount: 18.50,
    createdAt: new Date(Date.now() - 35 * 60 * 1000),
  },
  {
    id: "4",
    orderNumber: "PX-2024-042",
    customerName: "Sarah Wilson",
    status: "DELIVERED",
    totalAmount: 45.67,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
]

const lowStockItems: LowStockItem[] = [
  {
    id: "1",
    name: "Mozzarella Cheese",
    currentStock: 15,
    minStock: 20,
    unit: "kg",
  },
  {
    id: "2",
    name: "Pepperoni",
    currentStock: 8,
    minStock: 15,
    unit: "kg",
  },
  {
    id: "3",
    name: "Pizza Dough",
    currentStock: 25,
    minStock: 50,
    unit: "portions",
  },
]

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  ACCEPTED: { label: "Accepted", color: "bg-blue-100 text-blue-800" },
  PREPARING: { label: "Preparing", color: "bg-orange-100 text-orange-800" },
  READY_FOR_PICKUP: { label: "Ready", color: "bg-purple-100 text-purple-800" },
  OUT_FOR_DELIVERY: { label: "Delivering", color: "bg-indigo-100 text-indigo-800" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
}

export default function AdminDashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>(sampleStats)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // In a real app, this would fetch data from the API
    // For now, we'll use the sample data
  }, [])

  const getStatusInfo = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes === 1) return "1 min ago"
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours === 1) return "1 hour ago"
    return `${diffInHours} hours ago`
  }

  if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "MANAGER")) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You don't have permission to access the admin dashboard.</p>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-2"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Store
            </Link>
            <h1 className="text-xl font-bold text-gray-900 ml-4">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{session.user?.name}</p>
              <p className="text-xs text-gray-500">{session.user?.role}</p>
            </div>
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="flex flex-col h-full pt-16">
            <nav className="flex-1 px-4 py-6 space-y-2">
              <Link href="/admin" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
                <TrendingUp className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
              <Link href="/admin/orders" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 mr-3" />
                Orders
              </Link>
              <Link href="/admin/menu" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <ChefHat className="h-5 w-5 mr-3" />
                Menu Management
              </Link>
              <Link href="/admin/inventory" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 mr-3" />
                Inventory
              </Link>
              <Link href="/admin/customers" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Users className="h-5 w-5 mr-3" />
                Customers
              </Link>
              <Link href="/admin/delivery" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Truck className="h-5 w-5 mr-3" />
                Delivery
              </Link>
              <Link href="/admin/analytics" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <TrendingUp className="h-5 w-5 mr-3" />
                Analytics
              </Link>
              <Link href="/admin/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Link>
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +5% from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Requires attention
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Today's Performance</CardTitle>
                  <CardDescription>Key metrics for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{stats.todayOrders}</div>
                      <p className="text-sm text-gray-600">Orders Today</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">${stats.todayRevenue.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">Revenue Today</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">${stats.averageOrderValue.toFixed(2)}</div>
                      <p className="text-sm text-gray-600">Avg Order Value</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600">{stats.customerSatisfaction}</div>
                      <p className="text-sm text-gray-600">Satisfaction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Low Stock Alerts</CardTitle>
                  <CardDescription>Items that need restocking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-red-600">
                            {item.currentStock} / {item.minStock} {item.unit}
                          </p>
                        </div>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    View All Inventory
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map(order => {
                    const statusInfo = getStatusInfo(order.status)
                    
                    return (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium">Order #{order.orderNumber}</h4>
                            <p className="text-sm text-gray-600">{order.customerName}</p>
                            <p className="text-xs text-gray-500">{formatTimeAgo(order.createdAt)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                          <div className="text-right">
                            <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                            {order.estimatedDelivery && (
                              <p className="text-xs text-gray-500">
                                Est: {formatTime(order.estimatedDelivery)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 text-center">
                  <Link href="/admin/orders">
                    <Button variant="outline">View All Orders</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}