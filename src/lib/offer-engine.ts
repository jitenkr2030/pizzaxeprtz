import { db } from '@/lib/db'

export interface OfferRule {
  id: string
  name: string
  description?: string
  type: 'BUY_ONE_GET_ONE' | 'PERCENTAGE_DISCOUNT' | 'FIXED_AMOUNT_DISCOUNT' | 'FREE_ITEM' | 'COMBO_DEAL' | 'LOYALTY_BONUS'
  conditions: OfferCondition[]
  actions: OfferAction[]
  startTime: string
  endTime: string
  daysOfWeek: number[]
  isActive: boolean
  priority: number
  maxUsage?: number
  usageCount: number
  storeId: string
}

export interface OfferCondition {
  type: 'ORDER_AMOUNT_ABOVE' | 'TIME_BASED' | 'DAY_BASED' | 'USER_FREQUENCY' | 'ITEM_SPECIFIC' | 'CATEGORY_SPECIFIC' | 'NEW_USER' | 'LOYALTY_TIER'
  value: any
}

export interface OfferAction {
  type: 'PERCENTAGE_DISCOUNT' | 'FIXED_AMOUNT_DISCOUNT' | 'FREE_ITEM' | 'BUY_ONE_GET_ONE' | 'COMBO_PRICE'
  value: any
}

export interface OfferEvaluation {
  isEligible: boolean
  applicableOffers: ApplicableOffer[]
  totalDiscount: number
  messages: string[]
}

export interface ApplicableOffer {
  ruleId: string
  ruleName: string
  description: string
  discountAmount: number
  discountType: 'percentage' | 'fixed' | 'free_item' | 'bogo'
  priority: number
}

class OfferEngineService {
  async createOfferRule(data: {
    name: string
    description?: string
    type: 'BUY_ONE_GET_ONE' | 'PERCENTAGE_DISCOUNT' | 'FIXED_AMOUNT_DISCOUNT' | 'FREE_ITEM' | 'COMBO_DEAL' | 'LOYALTY_BONUS'
    conditions: OfferCondition[]
    actions: OfferAction[]
    startTime: string
    endTime: string
    daysOfWeek: number[]
    priority?: number
    maxUsage?: number
    storeId: string
  }) {
    return await db.offerRule.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        conditions: JSON.stringify(data.conditions),
        actions: JSON.stringify(data.actions),
        startTime: data.startTime,
        endTime: data.endTime,
        daysOfWeek: JSON.stringify(data.daysOfWeek),
        priority: data.priority || 0,
        maxUsage: data.maxUsage,
        storeId: data.storeId
      }
    })
  }

  async evaluateOffers(orderData: {
    userId?: string
    storeId: string
    items: Array<{
      menuItemId: string
      quantity: number
      price: number
    }>
    subtotal: number
    orderTime?: Date
  }): Promise<OfferEvaluation> {
    const { userId, storeId, items, subtotal, orderTime = new Date() } = orderData

    // Get all active offer rules for the store
    const rules = await db.offerRule.findMany({
      where: {
        storeId,
        isActive: true,
        OR: [
          { maxUsage: null },
          { usageCount: { lt: db.offerRule.fields.maxUsage } }
        ]
      },
      orderBy: {
        priority: 'desc'
      }
    })

    const applicableOffers: ApplicableOffer[] = []
    const messages: string[] = []
    let totalDiscount = 0

    // Get user data if userId is provided
    let userPreferences = null
    let userOrderHistory = []
    if (userId) {
      userPreferences = await db.userPreference.findUnique({
        where: { userId }
      })
      
      userOrderHistory = await db.order.findMany({
        where: {
          userId,
          status: 'DELIVERED'
        },
        include: {
          orderItems: {
            include: {
              menuItem: true
            }
          }
        }
      })
    }

    const currentTime = orderTime.toTimeString().slice(0, 5)
    const currentDay = orderTime.getDay()

    for (const rule of rules) {
      const conditions = JSON.parse(rule.conditions) as OfferCondition[]
      const actions = JSON.parse(rule.actions) as OfferAction[]

      // Check if rule is currently active based on time
      const daysOfWeek = JSON.parse(rule.daysOfWeek) as number[]
      if (!daysOfWeek.includes(currentDay)) {
        continue
      }

      if (!this.isTimeInRange(currentTime, rule.startTime, rule.endTime)) {
        continue
      }

      // Check all conditions
      const conditionResults = await Promise.all(
        conditions.map(condition => this.evaluateCondition(condition, {
          userId,
          items,
          subtotal,
          userPreferences,
          userOrderHistory,
          currentTime,
          currentDay
        }))
      )

      const allConditionsMet = conditionResults.every(result => result.met)
      
      if (allConditionsMet) {
        // Calculate discount from actions
        const actionResults = await Promise.all(
          actions.map(action => this.calculateActionDiscount(action, { items, subtotal }))
        )

        const ruleDiscount = actionResults.reduce((sum, result) => sum + result.discount, 0)
        
        if (ruleDiscount > 0) {
          applicableOffers.push({
            ruleId: rule.id,
            ruleName: rule.name,
            description: rule.description || '',
            discountAmount: ruleDiscount,
            discountType: this.getDiscountType(actions[0]?.type),
            priority: rule.priority
          })
          
          totalDiscount += ruleDiscount
          messages.push(conditionResults[0]?.message || `Applied offer: ${rule.name}`)
        }
      }
    }

    // Sort applicable offers by priority and apply the best ones
    applicableOffers.sort((a, b) => b.priority - a.priority)

    return {
      isEligible: applicableOffers.length > 0,
      applicableOffers,
      totalDiscount,
      messages
    }
  }

  private async evaluateCondition(condition: OfferCondition, context: any): Promise<{ met: boolean; message?: string }> {
    const { type, value } = condition

    switch (type) {
      case 'ORDER_AMOUNT_ABOVE':
        const minAmount = value
        return {
          met: context.subtotal >= minAmount,
          message: context.subtotal >= minAmount ? `Order amount above ₹${minAmount}` : undefined
        }

      case 'TIME_BASED':
        const currentTime = context.currentTime
        const { startTime, endTime } = value
        return {
          met: this.isTimeInRange(currentTime, startTime, endTime),
          message: this.isTimeInRange(currentTime, startTime, endTime) ? 'Time-based offer active' : undefined
        }

      case 'USER_FREQUENCY':
        const frequency = value
        const userFrequency = context.userPreferences?.orderFrequency
        return {
          met: userFrequency === frequency,
          message: userFrequency === frequency ? `User frequency: ${frequency}` : undefined
        }

      case 'ITEM_SPECIFIC':
        const itemIds = value as string[]
        const hasSpecificItem = context.items.some((item: any) => itemIds.includes(item.menuItemId))
        return {
          met: hasSpecificItem,
          message: hasSpecificItem ? 'Contains specific items' : undefined
        }

      case 'CATEGORY_SPECIFIC':
        const categoryIds = value as string[]
        const hasSpecificCategory = await this.hasItemsFromCategories(context.items, categoryIds)
        return {
          met: hasSpecificCategory,
          message: hasSpecificCategory ? 'Contains specific categories' : undefined
        }

      case 'NEW_USER':
        const isNewUser = value
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const actualIsNewUser = context.userOrderHistory.length === 0
        return {
          met: isNewUser === actualIsNewUser,
          message: isNewUser === actualIsNewUser ? 'New user offer' : undefined
        }

      case 'LOYALTY_TIER':
        const requiredTier = value
        const userTier = this.getUserLoyaltyTier(context.userOrderHistory)
        return {
          met: userTier === requiredTier,
          message: userTier === requiredTier ? `Loyalty tier: ${requiredTier}` : undefined
        }

      default:
        return { met: false }
    }
  }

  private async calculateActionDiscount(action: OfferAction, context: any): Promise<{ discount: number; message?: string }> {
    const { type, value } = action

    switch (type) {
      case 'PERCENTAGE_DISCOUNT':
        const percentage = value
        const discount = (context.subtotal * percentage) / 100
        return { discount, message: `${percentage}% discount applied` }

      case 'FIXED_AMOUNT_DISCOUNT':
        const amount = value
        return { discount: amount, message: `₹${amount} discount applied` }

      case 'FREE_ITEM':
        // Find the cheapest item to make it free
        const cheapestItem = context.items.reduce((min: any, item: any) => 
          item.price < min.price ? item : min, context.items[0])
        return { discount: cheapestItem.price, message: 'Free item applied' }

      case 'BUY_ONE_GET_ONE':
        // Find items with quantity >= 2 and give 50% discount on the second item
        const bogoItems = context.items.filter((item: any) => item.quantity >= 2)
        const bogoDiscount = bogoItems.reduce((sum: number, item: any) => 
          sum + (item.price * Math.floor(item.quantity / 2)), 0)
        return { discount: bogoDiscount, message: 'Buy 1 Get 1 applied' }

      case 'COMBO_PRICE':
        const comboPrice = value
        const originalPrice = context.subtotal
        const comboDiscount = Math.max(0, originalPrice - comboPrice)
        return { discount: comboDiscount, message: `Combo price: ₹${comboPrice}` }

      default:
        return { discount: 0 }
    }
  }

  private async hasItemsFromCategories(items: any[], categoryIds: string[]): Promise<boolean> {
    const menuItemIds = items.map(item => item.menuItemId)
    
    const menuItems = await db.menuItem.findMany({
      where: {
        id: {
          in: menuItemIds
        }
      },
      select: {
        categoryId: true
      }
    })

    const itemCategoryIds = menuItems.map(item => item.categoryId)
    return categoryIds.some(categoryId => itemCategoryIds.includes(categoryId))
  }

  private getUserLoyaltyTier(orderHistory: any[]): 'bronze' | 'silver' | 'gold' | 'platinum' {
    const totalOrders = orderHistory.length
    const totalSpent = orderHistory.reduce((sum, order) => sum + order.totalAmount, 0)

    if (totalOrders >= 50 || totalSpent >= 10000) return 'platinum'
    if (totalOrders >= 20 || totalSpent >= 5000) return 'gold'
    if (totalOrders >= 10 || totalSpent >= 2000) return 'silver'
    return 'bronze'
  }

  private getDiscountType(actionType: string): 'percentage' | 'fixed' | 'free_item' | 'bogo' {
    switch (actionType) {
      case 'PERCENTAGE_DISCOUNT':
        return 'percentage'
      case 'FIXED_AMOUNT_DISCOUNT':
        return 'fixed'
      case 'FREE_ITEM':
        return 'free_item'
      case 'BUY_ONE_GET_ONE':
        return 'bogo'
      default:
        return 'fixed'
    }
  }

  private isTimeInRange(currentTime: string, startTime: string, endTime: string): boolean {
    const current = this.timeToMinutes(currentTime)
    const start = this.timeToMinutes(startTime)
    const end = this.timeToMinutes(endTime)

    // Handle overnight schedules
    if (end < start) {
      return current >= start || current <= end
    }

    return current >= start && current <= end
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  async applyOfferToUser(userId: string, offerRuleId: string): Promise<void> {
    await db.userOffer.create({
      data: {
        userId,
        offerRuleId
      }
    })

    // Increment usage count
    await db.offerRule.update({
      where: { id: offerRuleId },
      data: {
        usageCount: {
          increment: 1
        }
      }
    })
  }

  async getUserOffers(userId: string): Promise<any[]> {
    return await db.userOffer.findMany({
      where: {
        userId,
        isUsed: false
      },
      include: {
        offerRule: true
      }
    })
  }

  async markOfferAsUsed(userOfferId: string): Promise<void> {
    await db.userOffer.update({
      where: { id: userOfferId },
      data: {
        isUsed: true,
        usedAt: new Date()
      }
    })
  }

  async initializeDefaultOffers(storeId: string) {
    const defaultOffers = [
      {
        name: 'Happy Hours BOGO',
        description: 'Buy 1 Get 1 Free during happy hours',
        type: 'BUY_ONE_GET_ONE' as const,
        conditions: [
          { type: 'TIME_BASED', value: { startTime: '15:00', endTime: '18:00' } }
        ],
        actions: [
          { type: 'BUY_ONE_GET_ONE', value: {} }
        ],
        startTime: '15:00',
        endTime: '18:00',
        daysOfWeek: [1, 2, 3, 4, 5],
        priority: 10,
        maxUsage: 100
      },
      {
        name: 'Free Drink on Large Orders',
        description: 'Get a free drink on orders above ₹299',
        type: 'FREE_ITEM' as const,
        conditions: [
          { type: 'ORDER_AMOUNT_ABOVE', value: 299 }
        ],
        actions: [
          { type: 'FREE_ITEM', value: {} }
        ],
        startTime: '00:00',
        endTime: '23:59',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        priority: 5,
        maxUsage: 50
      },
      {
        name: 'Weekend Special',
        description: '20% off on all weekend orders',
        type: 'PERCENTAGE_DISCOUNT' as const,
        conditions: [
          { type: 'DAY_BASED', value: [0, 6] } // Saturday, Sunday
        ],
        actions: [
          { type: 'PERCENTAGE_DISCOUNT', value: 20 }
        ],
        startTime: '00:00',
        endTime: '23:59',
        daysOfWeek: [0, 6],
        priority: 8,
        maxUsage: 200
      }
    ]

    const createdOffers = []
    for (const offerData of defaultOffers) {
      const offer = await this.createOfferRule({
        ...offerData,
        storeId
      })
      createdOffers.push(offer)
    }

    return createdOffers
  }
}

export const offerEngineService = new OfferEngineService()