'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Utensils, Star, TrendingUp } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  isHighlighted: boolean
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
  menuItems: MenuItem[]
}

interface DynamicMenuProps {
  storeId: string
  onMenuItemSelect?: (item: MenuItem) => void
}

export function DynamicMenu({ storeId, onMenuItemSelect }: DynamicMenuProps) {
  const [currentSchedule, setCurrentSchedule] = useState<MenuSchedule | null>(null)
  const [allSchedules, setAllSchedules] = useState<MenuSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null)

  useEffect(() => {
    fetchMenuSchedules()
  }, [storeId])

  const fetchMenuSchedules = async () => {
    try {
      const [currentResponse, allResponse] = await Promise.all([
        fetch(`/api/automation/menu-schedules?storeId=${storeId}&current=true`),
        fetch(`/api/automation/menu-schedules?storeId=${storeId}`)
      ])

      const currentData = await currentResponse.json()
      const allData = await allResponse.json()

      setCurrentSchedule(currentData.schedule)
      setAllSchedules(allData.schedules || [])
      
      if (currentData.schedule) {
        setSelectedSchedule(currentData.schedule.id)
      }
    } catch (error) {
      console.error('Error fetching menu schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScheduleIcon = (type: string) => {
    switch (type) {
      case 'BREAKFAST':
        return <Utensils className="h-4 w-4" />
      case 'LUNCH':
        return <Utensils className="h-4 w-4" />
      case 'SNACKS':
        return <Utensils className="h-4 w-4" />
      case 'DINNER':
        return <Utensils className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
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

  const displaySchedule = selectedSchedule 
    ? allSchedules.find(s => s.id === selectedSchedule) 
    : currentSchedule

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Schedule Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Menu Schedules
          </CardTitle>
          <CardDescription>
            Select a menu schedule to view available items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {allSchedules.map((schedule) => (
              <Button
                key={schedule.id}
                variant={selectedSchedule === schedule.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSchedule(schedule.id)}
                className="flex items-center gap-2"
              >
                {getScheduleIcon(schedule.type)}
                {schedule.name}
                {schedule.id === currentSchedule?.id && (
                  <Badge variant="secondary" className="ml-1">
                    Current
                  </Badge>
                )}
              </Button>
            ))}
          </div>
          
          {currentSchedule && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Currently Active:</strong> {currentSchedule.name} 
                ({formatTime(currentSchedule.startTime)} - {formatTime(currentSchedule.endTime)})
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Items */}
      {displaySchedule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getScheduleIcon(displaySchedule.type)}
              {displaySchedule.name}
            </CardTitle>
            <CardDescription>
              {displaySchedule.description}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(displaySchedule.startTime)} - {formatTime(displaySchedule.endTime)}
                </span>
                <span>{getDaysString(displaySchedule.daysOfWeek)}</span>
                <Badge className={getScheduleColor(displaySchedule.type)}>
                  {displaySchedule.type}
                </Badge>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {displaySchedule.menuItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No menu items available for this schedule
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displaySchedule.menuItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      item.isHighlighted ? 'ring-2 ring-yellow-400' : ''
                    }`}
                    onClick={() => onMenuItemSelect?.(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        {item.isHighlighted && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                          ₹{item.price.toFixed(2)}
                        </span>
                        <Button size="sm" variant="outline">
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!displaySchedule && (
        <Card>
          <CardContent className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Active Menu Schedule
            </h3>
            <p className="text-gray-500">
              Select a schedule from above to view menu items
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}