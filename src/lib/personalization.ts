import { db } from '@/lib/db'

export interface UserPreferenceData {
  userId: string
  favoriteItems?: string[]
  favoriteCategories?: string[]
  dietaryPreferences?: {
    isVegetarian?: boolean
    isVegan?: boolean
    isGlutenFree?: boolean
    allergies?: string[]
  }
  orderFrequency?: 'low' | 'medium' | 'high'
  avgOrderValue?: number
  preferredTimes?: string[]
  notificationSettings?: {
    pushEnabled?: boolean
    smsEnabled?: boolean
    emailEnabled?: boolean
    offerNotifications?: boolean
    orderUpdates?: boolean
  }
}

export interface PersonalizationRecommendation {
  type: 'menu_item' | 'category' | 'offer' | 'time'
  id: string
  name: string
  score: number
  reason: string
  data?: any
}

class PersonalizationService {
  async updateUserPreferences(userId: string, preferences: Partial<UserPreferenceData>) {
    const existingPreferences = await db.userPreference.findUnique({
      where: { userId }
    })

    if (existingPreferences) {
      return await db.userPreference.update({
        where: { userId },
        data: {
          ...(preferences.favoriteItems && { favoriteItems: JSON.stringify(preferences.favoriteItems) }),
          ...(preferences.favoriteCategories && { favoriteCategories: JSON.stringify(preferences.favoriteCategories) }),
          ...(preferences.dietaryPreferences && { dietaryPreferences: JSON.stringify(preferences.dietaryPreferences) }),
          ...(preferences.orderFrequency && { orderFrequency: preferences.orderFrequency }),
          ...(preferences.avgOrderValue && { avgOrderValue: preferences.avgOrderValue }),
          ...(preferences.preferredTimes && { preferredTimes: JSON.stringify(preferences.preferredTimes) }),
          ...(preferences.notificationSettings && { notificationSettings: JSON.stringify(preferences.notificationSettings) })
        }
      })
    } else {
      return await db.userPreference.create({
        data: {
          userId,
          ...(preferences.favoriteItems && { favoriteItems: JSON.stringify(preferences.favoriteItems) }),
          ...(preferences.favoriteCategories && { favoriteCategories: JSON.stringify(preferences.favoriteCategories) }),
          ...(preferences.dietaryPreferences && { dietaryPreferences: JSON.stringify(preferences.dietaryPreferences) }),
          ...(preferences.orderFrequency && { orderFrequency: preferences.orderFrequency }),
          ...(preferences.avgOrderValue && { avgOrderValue: preferences.avgOrderValue }),
          ...(preferences.preferredTimes && { preferredTimes: JSON.stringify(preferences.preferredTimes) }),
          ...(preferences.notificationSettings && { notificationSettings: JSON.stringify(preferences.notificationSettings) })
        }
      })
    }
  }

  async analyzeUserBehavior(userId: string): Promise<UserPreferenceData> {
    const userOrders = await db.order.findMany({
      where: {
        userId,
        status: 'DELIVERED'
      },
      include: {
        orderItems: {
          include: {
            menuItem: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (userOrders.length === 0) {
      return { userId }
    }

    // Analyze favorite items
    const itemCounts = new Map<string, number>()
    const categoryCounts = new Map<string, number>()
    const orderTimes: string[] = []
    let totalOrderValue = 0

    userOrders.forEach(order => {
      totalOrderValue += order.totalAmount
      
      // Record order time
      const orderHour = order.createdAt.getHours()
      const timeSlot = this.getTimeSlot(orderHour)
      orderTimes.push(timeSlot)

      // Count items and categories
      order.orderItems.forEach(orderItem => {
        const itemId = orderItem.menuItemId
        const categoryId = orderItem.menuItem.categoryId
        
        itemCounts.set(itemId, (itemCounts.get(itemId) || 0) + orderItem.quantity)
        categoryCounts.set(categoryId, (categoryCounts.get(categoryId) || 0) + orderItem.quantity)
      })
    })

    // Get top items and categories
    const favoriteItems = Array.from(itemCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([itemId]) => itemId)

    const favoriteCategories = Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([categoryId]) => categoryId)

    // Calculate order frequency
    const daysSinceFirstOrder = Math.floor(
      (Date.now() - userOrders[userOrders.length - 1].createdAt.getTime()) / (1000 * 60 * 60 * 24)
    )
    const ordersPerMonth = (userOrders.length / daysSinceFirstOrder) * 30
    const orderFrequency = this.getOrderFrequency(ordersPerMonth)

    // Calculate average order value
    const avgOrderValue = totalOrderValue / userOrders.length

    // Get preferred times
    const timeCounts = new Map<string, number>()
    orderTimes.forEach(time => {
      timeCounts.set(time, (timeCounts.get(time) || 0) + 1)
    })
    const preferredTimes = Array.from(timeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([time]) => time)

    // Analyze dietary preferences based on ordered items
    const dietaryPreferences = await this.analyzeDietaryPreferences(userOrders)

    return {
      userId,
      favoriteItems,
      favoriteCategories,
      dietaryPreferences,
      orderFrequency,
      avgOrderValue,
      preferredTimes,
      notificationSettings: {
        pushEnabled: true,
        smsEnabled: false,
        emailEnabled: true,
        offerNotifications: true,
        orderUpdates: true
      }
    }
  }

  async getPersonalizedRecommendations(userId: string, storeId: string): Promise<PersonalizationRecommendation[]> {
    const userPreferences = await db.userPreference.findUnique({
      where: { userId }
    })

    if (!userPreferences) {
      return []
    }

    const recommendations: PersonalizationRecommendation[] = []

    // Get user's order history
    const userOrders = await db.order.findMany({
      where: {
        userId,
        status: 'DELIVERED'
      },
      include: {
        orderItems: {
          include: {
            menuItem: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    })

    // Recommend similar items
    if (userPreferences.favoriteItems) {
      const favoriteItems = JSON.parse(userPreferences.favoriteItems) as string[]
      const similarItems = await this.getSimilarItems(favoriteItems, storeId)
      
      similarItems.forEach(item => {
        recommendations.push({
          type: 'menu_item',
          id: item.id,
          name: item.name,
          score: item.score,
          reason: 'Based on your favorite items',
          data: item
        })
      })
    }

    // Recommend categories
    if (userPreferences.favoriteCategories) {
      const favoriteCategories = JSON.parse(userPreferences.favoriteCategories) as string[]
      const categoryItems = await this.getItemsFromCategories(favoriteCategories, storeId)
      
      categoryItems.forEach(item => {
        recommendations.push({
          type: 'category',
          id: item.id,
          name: item.name,
          score: 0.7,
          reason: 'From your favorite categories',
          data: item
        })
      })
    }

    // Recommend based on dietary preferences
    if (userPreferences.dietaryPreferences) {
      const dietaryPrefs = JSON.parse(userPreferences.dietaryPreferences)
      const dietaryItems = await this.getItemsByDietaryPreferences(dietaryPrefs, storeId)
      
      dietaryItems.forEach(item => {
        recommendations.push({
          type: 'menu_item',
          id: item.id,
          name: item.name,
          score: 0.8,
          reason: 'Matches your dietary preferences',
          data: item
        })
      })
    }

    // Recommend based on order frequency and time
    if (userPreferences.preferredTimes) {
      const preferredTimes = JSON.parse(userPreferences.preferredTimes) as string[]
      const currentTime = this.getCurrentTimeSlot()
      
      if (preferredTimes.includes(currentTime)) {
        const timeBasedItems = await this.getItemsForTimeSlot(currentTime, storeId)
        
        timeBasedItems.forEach(item => {
          recommendations.push({
            type: 'time',
            id: item.id,
            name: item.name,
            score: 0.9,
            reason: `Perfect for ${currentTime}`,
            data: item
          })
        })
      }
    }

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }

  async getPersonalizedOffers(userId: string, storeId: string): Promise<any[]> {
    const userPreferences = await db.userPreference.findUnique({
      where: { userId }
    })

    if (!userPreferences) {
      return []
    }

    // Get all active offers
    const offers = await db.offerRule.findMany({
      where: {
        storeId,
        isActive: true
      }
    })

    const personalizedOffers = []

    for (const offer of offers) {
      const conditions = JSON.parse(offer.conditions)
      let isRelevant = false
      let relevanceScore = 0

      // Check if offer is relevant to user preferences
      for (const condition of conditions) {
        switch (condition.type) {
          case 'USER_FREQUENCY':
            if (userPreferences.orderFrequency === condition.value) {
              isRelevant = true
              relevanceScore += 0.8
            }
            break
          
          case 'ORDER_AMOUNT_ABOVE':
            if (userPreferences.avgOrderValue && userPreferences.avgOrderValue >= condition.value * 0.8) {
              isRelevant = true
              relevanceScore += 0.6
            }
            break
          
          case 'NEW_USER':
            // Check if user is actually new
            const userOrders = await db.order.count({
              where: { userId }
            })
            if (userOrders === 0 && condition.value) {
              isRelevant = true
              relevanceScore += 1.0
            }
            break
        }
      }

      if (isRelevant) {
        personalizedOffers.push({
          ...offer,
          relevanceScore,
          reason: this.getOfferRelevanceReason(conditions, userPreferences)
        })
      }
    }

    return personalizedOffers
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5)
  }

  private async getSimilarItems(favoriteItemIds: string[], storeId: string): Promise<Array<{ id: string; name: string; score: number }>> {
    const favoriteItems = await db.menuItem.findMany({
      where: {
        id: {
          in: favoriteItemIds
        }
      },
      include: {
        category: true
      }
    })

    const allItems = await db.menuItem.findMany({
      where: {
        storeId,
        isActive: true,
        id: {
          notIn: favoriteItemIds
        }
      },
      include: {
        category: true
      }
    })

    const similarItems = allItems.map(item => {
      let score = 0
      
      // Check if same category as favorite items
      const favoriteCategories = favoriteItems.map(fi => fi.categoryId)
      if (favoriteCategories.includes(item.categoryId)) {
        score += 0.7
      }

      // Check price similarity
      const avgFavoritePrice = favoriteItems.reduce((sum, item) => sum + item.price, 0) / favoriteItems.length
      const priceDiff = Math.abs(item.price - avgFavoritePrice)
      if (priceDiff < avgFavoritePrice * 0.3) {
        score += 0.3
      }

      return {
        id: item.id,
        name: item.name,
        score
      }
    })

    return similarItems.filter(item => item.score > 0.3)
  }

  private async getItemsFromCategories(categoryIds: string[], storeId: string): Promise<Array<{ id: string; name: string }>> {
    const items = await db.menuItem.findMany({
      where: {
        storeId,
        isActive: true,
        categoryId: {
          in: categoryIds
        }
      }
    })

    return items.map(item => ({
      id: item.id,
      name: item.name
    }))
  }

  private async getItemsByDietaryPreferences(dietaryPrefs: any, storeId: string): Promise<Array<{ id: string; name: string }>> {
    const whereClause: any = {
      storeId,
      isActive: true
    }

    if (dietaryPrefs.isVegetarian) {
      whereClause.isVegetarian = true
    }
    if (dietaryPrefs.isVegan) {
      whereClause.isVegan = true
    }

    const items = await db.menuItem.findMany({
      where: whereClause
    })

    return items.map(item => ({
      id: item.id,
      name: item.name
    }))
  }

  private async getItemsForTimeSlot(timeSlot: string, storeId: string): Promise<Array<{ id: string; name: string }>> {
    const menuSchedule = await db.menuSchedule.findFirst({
      where: {
        storeId,
        type: timeSlot.toUpperCase() as any,
        isActive: true
      },
      include: {
        menuItems: {
          include: {
            menuItem: true
          }
        }
      }
    })

    if (!menuSchedule) return []

    return menuSchedule.menuItems.map(scheduledItem => ({
      id: scheduledItem.menuItem.id,
      name: scheduledItem.menuItem.name
    }))
  }

  private async analyzeDietaryPreferences(orders: any[]): Promise<any> {
    const vegetarianCount = orders.reduce((count, order) => 
      count + order.orderItems.filter((item: any) => item.menuItem.isVegetarian).length, 0)
    const veganCount = orders.reduce((count, order) => 
      count + order.orderItems.filter((item: any) => item.menuItem.isVegan).length, 0)
    const totalItems = orders.reduce((count, order) => count + order.orderItems.length, 0)

    return {
      isVegetarian: vegetarianCount / totalItems > 0.7,
      isVegan: veganCount / totalItems > 0.5
    }
  }

  private getTimeSlot(hour: number): string {
    if (hour >= 6 && hour < 11) return 'BREAKFAST'
    if (hour >= 11 && hour < 15) return 'LUNCH'
    if (hour >= 15 && hour < 19) return 'SNACKS'
    if (hour >= 19 && hour < 23) return 'DINNER'
    return 'LATE_NIGHT'
  }

  private getCurrentTimeSlot(): string {
    const hour = new Date().getHours()
    return this.getTimeSlot(hour)
  }

  private getOrderFrequency(ordersPerMonth: number): 'low' | 'medium' | 'high' {
    if (ordersPerMonth < 2) return 'low'
    if (ordersPerMonth < 6) return 'medium'
    return 'high'
  }

  private getOfferRelevanceReason(conditions: any[], userPreferences: any): string {
    for (const condition of conditions) {
      switch (condition.type) {
        case 'USER_FREQUENCY':
          return `Based on your ${userPreferences.orderFrequency} ordering frequency`
        case 'ORDER_AMOUNT_ABOVE':
          return `Perfect for your average order value of ₹${userPreferences.avgOrderValue}`
        case 'NEW_USER':
          return 'Special offer for new customers'
      }
    }
    return 'Recommended for you'
  }

  async updateUserPreferencesFromOrder(userId: string, orderId: string) {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            menuItem: {
              include: {
                category: true
              }
            }
          }
        }
      }
    })

    if (!order) return

    // Analyze user behavior and update preferences
    const preferences = await this.analyzeUserBehavior(userId)
    await this.updateUserPreferences(userId, preferences)
  }
}

export const personalizationService = new PersonalizationService()