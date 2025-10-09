"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ChefHat, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Clock, Star, Package } from "lucide-react"

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  customerCount: number
  popularItems: { name: string; orders: number; revenue: number }[]
  hourlySales: { hour: string; orders: number; revenue: number }[]
  dailySales: { date: string; orders: number; revenue: number }[]
  topCustomers: { name: string; orders: number; spent: number }[]
  deliveryStats: { onTime: number; late: number; averageTime: number }
  inventoryValue: number
  lowStockItems: number
}

const sampleAnalytics: AnalyticsData = {
  totalRevenue: 15420.50,
  totalOrders: 342,
  averageOrderValue: 45.09,
  customerCount: 189,
  popularItems: [
    { name: "Margherita Classic", orders: 89, revenue: 1156.11 },
    { name: "Pepperoni Feast", orders: 76, revenue: 1215.24 },
    { name: "BBQ Chicken", orders: 65, revenue: 1104.35 },
    { name: "Veggie Supreme", orders: 58, revenue: 869.42 },
    { name: "Garlic Bread", orders: 45, revenue: 314.55 }
  ],
  hourlySales: [
    { hour: "11:00", orders: 12, revenue: 540.50 },
    { hour: "12:00", orders: 28, revenue: 1260.00 },
    { hour: "13:00", orders: 35, revenue: 1575.00 },
    { hour: "14:00", orders: 22, revenue: 990.00 },
    { hour: "15:00", orders: 15, revenue: 675.00 },
    { hour: "16:00", orders: 18, revenue: 810.00 },
    { hour: "17:00", orders: 25, revenue: 1125.00 },
    { hour: "18:00", orders: 42, revenue: 1890.00 },
    { hour: "19:00", orders: 38, revenue: 1710.00 },
    { hour: "20:00", orders: 31, revenue: 1395.00 },
    { hour: "21:00", orders: 24, revenue: 1080.00 },
    { hour: "22:00", orders: 16, revenue: 720.00 }
  ],
  dailySales: [
    { date: "Mon", orders: 45, revenue: 2025.00 },
    { date: "Tue", orders: 52, revenue: 2340.00 },
    { date: "Wed", orders: 48, revenue: 2160.00 },
    { date: "Thu", orders: 55, revenue: 2475.00 },
    { date: "Fri", orders: 68, revenue: 3060.00 },
    { date: "Sat", orders: 72, revenue: 3240.00 },
    { date: "Sun", orders: 62, revenue: 2790.00 }
  ],
  topCustomers: [
    { name: "John Smith", orders: 12, spent: 542.88 },
    { name: "Sarah Johnson", orders: 10, spent: 489.50 },
    { name: "Mike Davis", orders: 8, spent: 398.25 },
    { name: "Emily Brown", orders: 7, spent: 342.10 },
    { name: "David Wilson", orders: 6, spent: 298.75 }
  ],
  deliveryStats: {
    onTime: 285,
    late: 45,
    averageTime: 28.5
  },
  inventoryValue: 3240.75,
  lowStockItems: 8
}

export default function AnalyticsDashboard() {
  const [analytics] = useState<AnalyticsData>(sampleAnalytics)
  const [timeRange, setTimeRange] = useState("week")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  const getChangePercentage = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1)
  }

  const getPeakHours = () => {
    return analytics.hourlySales
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 3)
      .map(item => item.hour)
  }

  const getDeliveryPerformance = () => {
    const total = analytics.deliveryStats.onTime + analytics.deliveryStats.late
    const onTimePercentage = (analytics.deliveryStats.onTime / total * 100).toFixed(1)
    return {
      onTimePercentage,
      totalDeliveries: total
    }
  }

  const deliveryPerformance = getDeliveryPerformance()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Pizzaxperts Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${analytics.totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+8.2%</span>
                  </div>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">${analytics.averageOrderValue.toFixed(2)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+3.8%</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.customerCount}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+15.3%</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Menu Items</CardTitle>
                  <CardDescription>Top selling items by order count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.popularItems.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-bold text-red-600">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-600">{item.orders} orders</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${item.revenue.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Peak Hours */}
              <Card>
                <CardHeader>
                  <CardTitle>Peak Hours</CardTitle>
                  <CardDescription>Busiest times of the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.hourlySales
                      .sort((a, b) => b.orders - a.orders)
                      .slice(0, 6)
                      .map((hour, index) => (
                        <div key={hour.hour} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{hour.hour}</span>
                            <span>{hour.orders} orders</span>
                          </div>
                          <Progress 
                            value={(hour.orders / Math.max(...analytics.hourlySales.map(h => h.orders))) * 100} 
                            className="h-2"
                          />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Sales Trend</CardTitle>
                <CardDescription>Revenue and orders over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.dailySales.map(day => (
                    <div key={day.date} className="flex items-center justify-between">
                      <div className="w-16 font-medium">{day.date}</div>
                      <div className="flex-1 mx-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{day.orders} orders</span>
                          <span>${day.revenue.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(day.revenue / Math.max(...analytics.dailySales.map(d => d.revenue))) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hourly Sales Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Hourly Sales Breakdown</CardTitle>
                  <CardDescription>Detailed hourly performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.hourlySales.map(hour => (
                      <div key={hour.hour} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium">{hour.hour}</div>
                        <div className="text-right">
                          <div className="font-medium">${hour.revenue.toFixed(2)}</div>
                          <div className="text-sm text-gray-600">{hour.orders} orders</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sales Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Key sales indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Revenue per Hour</div>
                        <div className="text-2xl font-bold">${(analytics.totalRevenue / 12).toFixed(2)}</div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Orders per Hour</div>
                        <div className="text-2xl font-bold">{Math.round(analytics.totalOrders / 12)}</div>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-blue-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Peak Hour Revenue</div>
                        <div className="text-2xl font-bold">
                          ${Math.max(...analytics.hourlySales.map(h => h.revenue)).toFixed(2)}
                        </div>
                      </div>
                      <Star className="h-8 w-8 text-yellow-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Slowest Hour</div>
                        <div className="text-2xl font-bold">
                          ${Math.min(...analytics.hourlySales.map(h => h.revenue)).toFixed(2)}
                        </div>
                      </div>
                      <TrendingDown className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Customers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                  <CardDescription>Most valuable customers by spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topCustomers.map((customer, index) => (
                      <div key={customer.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-600">{customer.orders} orders</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${customer.spent.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Analytics</CardTitle>
                  <CardDescription>Customer behavior insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Average Orders per Customer</div>
                        <div className="text-2xl font-bold">
                          {(analytics.totalOrders / analytics.customerCount).toFixed(1)}
                        </div>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Average Spend per Customer</div>
                        <div className="text-2xl font-bold">
                          ${(analytics.totalRevenue / analytics.customerCount).toFixed(2)}
                        </div>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Customer Retention Rate</div>
                        <div className="text-2xl font-bold">78.5%</div>
                      </div>
                      <Star className="h-8 w-8 text-yellow-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">New Customers This Week</div>
                        <div className="text-2xl font-bold">24</div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Delivery Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Performance</CardTitle>
                  <CardDescription>On-time delivery metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">On-Time Rate</div>
                        <div className="text-2xl font-bold">{deliveryPerformance.onTimePercentage}%</div>
                      </div>
                      <Clock className="h-8 w-8 text-green-600" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>On-Time Deliveries</span>
                        <span>{analytics.deliveryStats.onTime}</span>
                      </div>
                      <Progress value={parseFloat(deliveryPerformance.onTimePercentage)} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Average Delivery Time</div>
                        <div className="text-2xl font-bold">{analytics.deliveryStats.averageTime} min</div>
                      </div>
                      <Clock className="h-8 w-8 text-blue-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Total Deliveries</div>
                        <div className="text-2xl font-bold">{deliveryPerformance.totalDeliveries}</div>
                      </div>
                      <Package className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operational Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Operational Efficiency</CardTitle>
                  <CardDescription>Key operational indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Orders per Hour (Peak)</div>
                        <div className="text-2xl font-bold">
                          {Math.max(...analytics.hourlySales.map(h => h.orders))}
                        </div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Revenue per Hour (Peak)</div>
                        <div className="text-2xl font-bold">
                          ${Math.max(...analytics.hourlySales.map(h => h.revenue)).toFixed(2)}
                        </div>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Average Order Value</div>
                        <div className="text-2xl font-bold">${analytics.averageOrderValue.toFixed(2)}</div>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Peak Hours</div>
                        <div className="text-lg font-bold">{getPeakHours().join(', ')}</div>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inventory Value */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Value</CardTitle>
                  <CardDescription>Current inventory valuation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Total Inventory Value</div>
                        <div className="text-2xl font-bold">${analytics.inventoryValue.toFixed(2)}</div>
                      </div>
                      <Package className="h-8 w-8 text-green-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Low Stock Items</div>
                        <div className="text-2xl font-bold">{analytics.lowStockItems}</div>
                      </div>
                      <Package className="h-8 w-8 text-yellow-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Inventory Turnover</div>
                        <div className="text-2xl font-bold">4.2x</div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Days of Inventory</div>
                        <div className="text-2xl font-bold">12 days</div>
                      </div>
                      <Clock className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inventory Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Alerts</CardTitle>
                  <CardDescription>Items requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-red-800">Critical Stock</div>
                          <div className="text-sm text-red-600">3 items out of stock</div>
                        </div>
                        <Badge className="bg-red-100 text-red-800">Action Required</Badge>
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-yellow-800">Low Stock</div>
                          <div className="text-sm text-yellow-600">5 items below minimum</div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Monitor</Badge>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-blue-800">Expiring Soon</div>
                          <div className="text-sm text-blue-600">2 items expiring in 3 days</div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Schedule</Badge>
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-green-800">Well Stocked</div>
                          <div className="text-sm text-green-600">24 items at optimal levels</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Good</Badge>
                      </div>
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