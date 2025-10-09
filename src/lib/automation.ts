import { db } from '@/lib/db'
import { menuSchedulerService } from './menu-scheduler'
import { notificationSchedulerService } from './notification-scheduler'
import { offerEngineService } from './offer-engine'
import { personalizationService } from './personalization'

export interface AutomationTask {
  id: string
  name: string
  type: 'menu_schedule' | 'notification' | 'offer_evaluation' | 'personalization' | 'cleanup'
  schedule: string // cron expression
  isActive: boolean
  lastRun?: Date
  nextRun?: Date
  config: any
}

export interface TaskExecution {
  taskId: string
  startTime: Date
  endTime?: Date
  status: 'running' | 'completed' | 'failed'
  result?: any
  error?: string
}

class AutomationService {
  private tasks: Map<string, NodeJS.Timeout> = new Map()
  private isRunning = false

  async initialize() {
    console.log('Initializing automation service...')
    
    // Start all scheduled tasks
    await this.startScheduledTasks()
    
    // Set up periodic task runner
    this.startTaskRunner()
    
    console.log('Automation service initialized')
  }

  async startScheduledTasks() {
    const defaultTasks = [
      {
        name: 'Process Scheduled Notifications',
        type: 'notification',
        schedule: '*/5 * * * *', // Every 5 minutes
        config: {}
      },
      {
        name: 'Update User Preferences',
        type: 'personalization',
        schedule: '0 */6 * * *', // Every 6 hours
        config: {}
      },
      {
        name: 'Cleanup Old Logs',
        type: 'cleanup',
        schedule: '0 2 * * *', // Daily at 2 AM
        config: { daysToKeep: 30 }
      },
      {
        name: 'Menu Schedule Validation',
        type: 'menu_schedule',
        schedule: '0 * * * *', // Every hour
        config: {}
      }
    ]

    for (const taskData of defaultTasks) {
      await this.scheduleTask(taskData)
    }
  }

  async scheduleTask(taskData: {
    name: string
    type: 'menu_schedule' | 'notification' | 'offer_evaluation' | 'personalization' | 'cleanup'
    schedule: string
    config: any
  }) {
    const task: AutomationTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: taskData.name,
      type: taskData.type,
      schedule: taskData.schedule,
      isActive: true,
      config: taskData.config
    }

    // Calculate next run time
    task.nextRun = this.getNextRunTime(taskData.schedule)

    // Store task (in a real implementation, this would be in the database)
    // For now, we'll keep it in memory
    this.scheduleTaskExecution(task)
    
    console.log(`Scheduled task: ${task.name} (${task.schedule})`)
    
    return task
  }

  private scheduleTaskExecution(task: AutomationTask) {
    const interval = this.getIntervalFromCron(task.schedule)
    const timeout = setTimeout(() => {
      this.executeTask(task)
    }, interval)

    this.tasks.set(task.id, timeout)
  }

  private getIntervalFromCron(cronExpression: string): number {
    // Simple cron parser for basic expressions
    // In a real implementation, use a proper cron library
    const parts = cronExpression.split(' ')
    
    if (parts[0] === '*/5') return 5 * 60 * 1000 // Every 5 minutes
    if (parts[0] === '0' && parts[1] === '*/6') return 6 * 60 * 60 * 1000 // Every 6 hours
    if (parts[0] === '0' && parts[1] === '2') return 24 * 60 * 60 * 1000 // Daily at 2 AM
    if (parts[0] === '0' && parts[1] === '*') return 60 * 60 * 1000 // Every hour
    
    return 60 * 60 * 1000 // Default to hourly
  }

  private getNextRunTime(cronExpression: string): Date {
    const interval = this.getIntervalFromCron(cronExpression)
    return new Date(Date.now() + interval)
  }

  async executeTask(task: AutomationTask) {
    const execution: TaskExecution = {
      taskId: task.id,
      startTime: new Date(),
      status: 'running'
    }

    try {
      console.log(`Executing task: ${task.name}`)
      
      let result
      switch (task.type) {
        case 'notification':
          result = await this.executeNotificationTask(task.config)
          break
        case 'personalization':
          result = await this.executePersonalizationTask(task.config)
          break
        case 'cleanup':
          result = await this.executeCleanupTask(task.config)
          break
        case 'menu_schedule':
          result = await this.executeMenuScheduleTask(task.config)
          break
        default:
          throw new Error(`Unknown task type: ${task.type}`)
      }

      execution.status = 'completed'
      execution.result = result
      execution.endTime = new Date()

      await this.logAutomation('task_execution', {
        taskId: task.id,
        taskName: task.name,
        duration: execution.endTime.getTime() - execution.startTime.getTime(),
        result
      })

      console.log(`Task completed: ${task.name} (${execution.endTime.getTime() - execution.startTime.getTime()}ms)`)

    } catch (error) {
      execution.status = 'failed'
      execution.error = error.message
      execution.endTime = new Date()

      await this.logAutomation('task_execution', {
        taskId: task.id,
        taskName: task.name,
        error: error.message
      })

      console.error(`Task failed: ${task.name}`, error)
    }

    // Schedule next execution
    task.nextRun = this.getNextRunTime(task.schedule)
    this.scheduleTaskExecution(task)
  }

  private async executeNotificationTask(config: any): Promise<any> {
    const results = await notificationSchedulerService.processScheduledNotifications()
    return {
      processedNotifications: results.length,
      totalSent: results.reduce((sum, result) => sum + result.sentCount, 0)
    }
  }

  private async executePersonalizationTask(config: any): Promise<any> {
    // Get all users with recent orders
    const recentOrders = await db.order.findMany({
      where: {
        status: 'DELIVERED',
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      select: {
        userId: true,
        id: true
      },
      distinct: ['userId']
    })

    let updatedUsers = 0
    for (const order of recentOrders) {
      try {
        await personalizationService.updateUserPreferencesFromOrder(order.userId, order.id)
        updatedUsers++
      } catch (error) {
        console.error(`Failed to update preferences for user ${order.userId}:`, error)
      }
    }

    return { updatedUsers }
  }

  private async executeCleanupTask(config: any): Promise<any> {
    const { daysToKeep = 30 } = config
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)

    // Clean up old notification logs
    const deletedLogs = await db.notificationLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    })

    // Clean up old automation logs
    const deletedAutomationLogs = await db.automationLog.deleteMany({
      where: {
        executedAt: {
          lt: cutoffDate
        }
      }
    })

    return {
      deletedNotificationLogs: deletedLogs.count,
      deletedAutomationLogs: deletedAutomationLogs.count
    }
  }

  private async executeMenuScheduleTask(config: any): Promise<any> {
    // Validate all menu schedules and ensure they're properly configured
    const stores = await db.store.findMany({
      where: {
        isActive: true
      }
    })

    let validatedStores = 0
    for (const store of stores) {
      try {
        const currentSchedule = await menuSchedulerService.getCurrentMenuSchedule(store.id)
        if (!currentSchedule) {
          // Initialize default schedules if none exist
          await menuSchedulerService.initializeDefaultSchedules(store.id)
        }
        validatedStores++
      } catch (error) {
        console.error(`Failed to validate menu schedule for store ${store.id}:`, error)
      }
    }

    return { validatedStores }
  }

  private startTaskRunner() {
    if (this.isRunning) return
    
    this.isRunning = true
    
    // Run task health check every minute
    setInterval(() => {
      this.checkTaskHealth()
    }, 60 * 1000)
  }

  private checkTaskHealth() {
    // Check if all tasks are running properly
    for (const [taskId, timeout] of this.tasks) {
      if (!timeout) {
        console.warn(`Task ${taskId} is not running, restarting...`)
        // Restart task
        this.tasks.delete(taskId)
      }
    }
  }

  async logAutomation(action: string, details: any) {
    try {
      await db.automationLog.create({
        data: {
          action,
          details: JSON.stringify(details),
          status: 'success'
        }
      })
    } catch (error) {
      console.error('Failed to log automation:', error)
    }
  }

  async getAutomationStats(): Promise<any> {
    const logs = await db.automationLog.findMany({
      where: {
        executedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    })

    const stats = {
      totalTasks: logs.length,
      successfulTasks: logs.filter(log => log.status === 'success').length,
      failedTasks: logs.filter(log => log.status === 'failed').length,
      tasksByType: {} as Record<string, number>,
      averageExecutionTime: 0
    }

    // Calculate tasks by type
    logs.forEach(log => {
      const details = JSON.parse(log.details || '{}')
      const taskType = details.taskName || 'unknown'
      stats.tasksByType[taskType] = (stats.tasksByType[taskType] || 0) + 1
    })

    // Calculate average execution time
    const executionTimes = logs
      .filter(log => log.status === 'success')
      .map(log => {
        const details = JSON.parse(log.details || '{}')
        return details.duration || 0
      })

    if (executionTimes.length > 0) {
      stats.averageExecutionTime = executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length
    }

    return stats
  }

  async stop() {
    console.log('Stopping automation service...')
    
    // Clear all scheduled tasks
    for (const [taskId, timeout] of this.tasks) {
      clearTimeout(timeout)
    }
    
    this.tasks.clear()
    this.isRunning = false
    
    console.log('Automation service stopped')
  }

  // Manual task execution
  async executeTaskManually(taskType: string, config: any = {}): Promise<any> {
    const task: AutomationTask = {
      id: `manual_${Date.now()}`,
      name: `Manual ${taskType}`,
      type: taskType as any,
      schedule: 'manual',
      isActive: true,
      config
    }

    return await this.executeTask(task)
  }
}

// Global automation service instance
export const automationService = new AutomationService()

// Initialize on module load
if (typeof window === 'undefined') {
  // Server-side only
  automationService.initialize().catch(console.error)
}