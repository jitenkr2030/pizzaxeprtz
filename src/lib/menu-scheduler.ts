import { db } from '@/lib/db'

export interface MenuScheduleItem {
  id: string
  name: string
  description?: string
  type: 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER' | 'LATE_NIGHT' | 'SPECIAL'
  startTime: string
  endTime: string
  daysOfWeek: number[]
  isActive: boolean
  storeId: string
  menuItems: Array<{
    id: string
    name: string
    description?: string
    price: number
    image?: string
    isHighlighted: boolean
    displayOrder: number
  }>
}

export interface TimeSlot {
  type: 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER' | 'LATE_NIGHT' | 'SPECIAL'
  startTime: string
  endTime: string
  label: string
}

export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { type: 'BREAKFAST', startTime: '07:00', endTime: '11:00', label: 'Breakfast' },
  { type: 'LUNCH', startTime: '12:00', endTime: '15:00', label: 'Lunch' },
  { type: 'SNACKS', startTime: '16:00', endTime: '19:00', label: 'Evening Snacks' },
  { type: 'DINNER', startTime: '20:00', endTime: '23:00', label: 'Dinner' },
  { type: 'LATE_NIGHT', startTime: '23:00', endTime: '02:00', label: 'Late Night' },
]

class MenuSchedulerService {
  async getCurrentMenuSchedule(storeId: string): Promise<MenuScheduleItem | null> {
    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5) // HH:mm format
    const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.

    const schedule = await db.menuSchedule.findFirst({
      where: {
        storeId,
        isActive: true,
        daysOfWeek: {
          contains: currentDay.toString()
        }
      },
      include: {
        menuItems: {
          include: {
            menuItem: true
          },
          orderBy: {
            displayOrder: 'asc'
          }
        }
      }
    })

    if (!schedule) return null

    // Check if current time is within the schedule time range
    const isWithinTimeRange = this.isTimeInRange(currentTime, schedule.startTime, schedule.endTime)
    if (!isWithinTimeRange) return null

    return {
      id: schedule.id,
      name: schedule.name,
      description: schedule.description,
      type: schedule.type,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      daysOfWeek: JSON.parse(schedule.daysOfWeek),
      isActive: schedule.isActive,
      storeId: schedule.storeId,
      menuItems: schedule.menuItems.map(item => ({
        id: item.menuItem.id,
        name: item.menuItem.name,
        description: item.menuItem.description,
        price: item.menuItem.price,
        image: item.menuItem.image,
        isHighlighted: item.isHighlighted,
        displayOrder: item.displayOrder
      }))
    }
  }

  async getActiveSchedules(storeId: string): Promise<MenuScheduleItem[]> {
    const schedules = await db.menuSchedule.findMany({
      where: {
        storeId,
        isActive: true
      },
      include: {
        menuItems: {
          include: {
            menuItem: true
          },
          orderBy: {
            displayOrder: 'asc'
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    return schedules.map(schedule => ({
      id: schedule.id,
      name: schedule.name,
      description: schedule.description,
      type: schedule.type,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      daysOfWeek: JSON.parse(schedule.daysOfWeek),
      isActive: schedule.isActive,
      storeId: schedule.storeId,
      menuItems: schedule.menuItems.map(item => ({
        id: item.menuItem.id,
        name: item.menuItem.name,
        description: item.menuItem.description,
        price: item.menuItem.price,
        image: item.menuItem.image,
        isHighlighted: item.isHighlighted,
        displayOrder: item.displayOrder
      }))
    }))
  }

  async createMenuSchedule(data: {
    name: string
    description?: string
    type: 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER' | 'LATE_NIGHT' | 'SPECIAL'
    startTime: string
    endTime: string
    daysOfWeek: number[]
    storeId: string
    menuItemIds: string[]
  }) {
    const schedule = await db.menuSchedule.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        startTime: data.startTime,
        endTime: data.endTime,
        daysOfWeek: JSON.stringify(data.daysOfWeek),
        storeId: data.storeId,
        menuItems: {
          create: data.menuItemIds.map((menuItemId, index) => ({
            menuItemId,
            displayOrder: index
          }))
        }
      },
      include: {
        menuItems: {
          include: {
            menuItem: true
          }
        }
      }
    })

    return schedule
  }

  async updateMenuSchedule(id: string, data: Partial<{
    name: string
    description: string
    startTime: string
    endTime: string
    daysOfWeek: number[]
    isActive: boolean
  }>) {
    const updateData: any = { ...data }
    if (data.daysOfWeek) {
      updateData.daysOfWeek = JSON.stringify(data.daysOfWeek)
    }

    return await db.menuSchedule.update({
      where: { id },
      data: updateData
    })
  }

  async deleteMenuSchedule(id: string) {
    return await db.menuSchedule.delete({
      where: { id }
    })
  }

  async addMenuItemToSchedule(scheduleId: string, menuItemId: string, isHighlighted = false) {
    const lastItem = await db.scheduledMenuItem.findFirst({
      where: { menuScheduleId: scheduleId },
      orderBy: { displayOrder: 'desc' }
    })

    return await db.scheduledMenuItem.create({
      data: {
        menuScheduleId: scheduleId,
        menuItemId,
        isHighlighted,
        displayOrder: lastItem ? lastItem.displayOrder + 1 : 0
      }
    })
  }

  async removeMenuItemFromSchedule(scheduleId: string, menuItemId: string) {
    return await db.scheduledMenuItem.delete({
      where: {
        menuScheduleId_menuItemId: {
          menuScheduleId: scheduleId,
          menuItemId
        }
      }
    })
  }

  private isTimeInRange(currentTime: string, startTime: string, endTime: string): boolean {
    const current = this.timeToMinutes(currentTime)
    const start = this.timeToMinutes(startTime)
    const end = this.timeToMinutes(endTime)

    // Handle overnight schedules (e.g., 23:00 to 02:00)
    if (end < start) {
      return current >= start || current <= end
    }

    return current >= start && current <= end
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  async initializeDefaultSchedules(storeId: string) {
    const existingSchedules = await db.menuSchedule.findMany({
      where: { storeId }
    })

    if (existingSchedules.length > 0) {
      return existingSchedules
    }

    const defaultSchedules = [
      {
        name: 'Breakfast Menu',
        description: 'Start your day with our delicious breakfast options',
        type: 'BREAKFAST' as const,
        startTime: '07:00',
        endTime: '11:00',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6] // All days
      },
      {
        name: 'Lunch Menu',
        description: 'Perfect lunch options for your midday meal',
        type: 'LUNCH' as const,
        startTime: '12:00',
        endTime: '15:00',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      },
      {
        name: 'Evening Snacks',
        description: 'Tasty snacks to satisfy your evening cravings',
        type: 'SNACKS' as const,
        startTime: '16:00',
        endTime: '19:00',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      },
      {
        name: 'Dinner Menu',
        description: 'Enjoy our special dinner offerings',
        type: 'DINNER' as const,
        startTime: '20:00',
        endTime: '23:00',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      }
    ]

    const createdSchedules = []
    for (const scheduleData of defaultSchedules) {
      const schedule = await this.createMenuSchedule({
        ...scheduleData,
        storeId,
        menuItemIds: [] // Will be populated by admin
      })
      createdSchedules.push(schedule)
    }

    return createdSchedules
  }
}

export const menuSchedulerService = new MenuSchedulerService()