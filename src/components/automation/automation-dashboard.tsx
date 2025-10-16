'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  BarChart3, 
  Clock, 
  Bell, 
  Gift, 
  User, 
  TrendingUp,
  Zap,
  RefreshCw
} from 'lucide-react'

import { DynamicMenu } from './dynamic-menu'
import { OfferEngine } from './offer-engine'
import { NotificationScheduler } from './notification-scheduler'

interface AutomationDashboardProps {
  storeId: string
  userId?: string
  isAdmin?: boolean
}

interface SystemStats {
  totalTasks: number
  successfulTasks: number
  failedTasks: number
  tasksByType: Record<string, number>
  averageExecutionTime: number
}

export function AutomationDashboard({ storeId, userId, isAdmin = false }: AutomationDashboardProps) {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState<Array<{
    menuItemId: string
    quantity: number
    price: number
  }>>([])
  const [subtotal, setSubtotal] = useState(0)

  useEffect(() => {
    if (isAdmin) {
      fetchSystemStats()
    }
  }, [isAdmin])

  const fetchSystemStats = async () => {
    try {
      const response = await fetch('/api/automation/system?action=stats')
      const data = await response.json()
      setSystemStats(data.stats)
    } catch (error) {
      console.error('Error fetching system stats:', error)
    }
  }

  const initializeStore = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/automation/system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'initializeStore',
          storeId
        })
      })

      const data = await response.json()
      if (data.success) {
        // Refresh the page to show new data
        window.location.reload()
      }
    } catch (error) {
      console.error('Error initializing store:', error)
    } finally {
      setLoading(false)
    }
  }

  const executeTask = async (taskType: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/automation/system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'executeTask',
          taskType
        })
      })

      const data = await response.json()
      console.log('Task executed:', data.result)
      
      // Refresh stats
      if (isAdmin) {
        fetchSystemStats()
      }
    } catch (error) {
      console.error('Error executing task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMenuItemSelect = (item: any) => {
    // Add item to cart
    const existingItem = cartItems.find(cartItem => cartItem.menuItemId === item.id)
    if (existingItem) {
      setCartItems(cartItems.map(cartItem => 
        cartItem.menuItemId === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCartItems([...cartItems, {
        menuItemId: item.id,
        quantity: 1,
        price: item.price
      }])
    }
    
    setSubtotal(prev => prev + item.price)
  }

  const handleOfferApply = (offer: any) => {
    console.log('Offer applied:', offer)
    // Handle offer application logic
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Automation Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage automated menus, offers, and notifications
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button onClick={initializeStore} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Initialize Store
            </Button>
          )}
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Stats (Admin Only) */}
      {isAdmin && systemStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              System Statistics
            </CardTitle>
            <CardDescription>
              Overview of automation system performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {systemStats.totalTasks}
                </div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {systemStats.successfulTasks}
                </div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {systemStats.failedTasks}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {systemStats.averageExecutionTime.toFixed(0)}ms
                </div>
                <div className="text-sm text-gray-600">Avg Time</div>
              </div>
            </div>
            
            {Object.keys(systemStats.tasksByType).length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Tasks by Type:</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(systemStats.tasksByType).map(([type, count]) => (
                    <Badge key={type} variant="outline">
                      {type}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions (Admin Only) */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Execute automation tasks manually
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => executeTask('notification')} 
                variant="outline"
                disabled={loading}
              >
                <Bell className="h-4 w-4 mr-2" />
                Process Notifications
              </Button>
              <Button 
                onClick={() => executeTask('personalization')} 
                variant="outline"
                disabled={loading}
              >
                <User className="h-4 w-4 mr-2" />
                Update Preferences
              </Button>
              <Button 
                onClick={() => executeTask('cleanup')} 
                variant="outline"
                disabled={loading}
              >
                <Settings className="h-4 w-4 mr-2" />
                Cleanup Logs
              </Button>
              <Button 
                onClick={() => executeTask('menu_schedule')} 
                variant="outline"
                disabled={loading}
              >
                <Clock className="h-4 w-4 mr-2" />
                Validate Menus
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="menu" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Menu Schedule
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Offers
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          {userId && (
            <TabsTrigger value="personalized" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              For You
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="menu" className="space-y-4">
          <DynamicMenu 
            storeId={storeId} 
            onMenuItemSelect={handleMenuItemSelect}
          />
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <OfferEngine 
            storeId={storeId}
            userId={userId}
            cartItems={cartItems}
            subtotal={subtotal}
            onOfferApply={handleOfferApply}
          />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationScheduler 
            storeId={storeId}
            userId={userId}
          />
        </TabsContent>

        {userId && (
          <TabsContent value="personalized" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Personalized Recommendations
                </CardTitle>
                <CardDescription>
                  Recommendations based on your preferences and order history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Personalization Coming Soon
                  </h3>
                  <p className="text-gray-500">
                    We're working on bringing you personalized recommendations based on your preferences
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Current Cart Summary */}
      {cartItems.length > 0 && (
        <Card className="sticky bottom-4">
          <CardHeader>
            <CardTitle className="text-lg">Current Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">
                    {item.quantity}x Item {item.menuItemId}
                  </span>
                  <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2">
                <div className="flex justify-between items-center font-bold">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}