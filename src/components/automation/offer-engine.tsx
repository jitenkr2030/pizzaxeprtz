'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Gift, Clock, Percent, Star, Zap } from 'lucide-react'

interface Offer {
  id: string
  name: string
  description?: string
  type: 'BUY_ONE_GET_ONE' | 'PERCENTAGE_DISCOUNT' | 'FIXED_AMOUNT_DISCOUNT' | 'FREE_ITEM' | 'COMBO_DEAL' | 'LOYALTY_BONUS'
  conditions: any[]
  actions: any[]
  startTime: string
  endTime: string
  daysOfWeek: number[]
  isActive: boolean
  priority: number
  maxUsage?: number
  usageCount: number
  relevanceScore?: number
  reason?: string
}

interface OfferEngineProps {
  storeId: string
  userId?: string
  cartItems?: Array<{
    menuItemId: string
    quantity: number
    price: number
  }>
  subtotal?: number
  onOfferApply?: (offer: Offer) => void
}

export function OfferEngine({ storeId, userId, cartItems = [], subtotal = 0, onOfferApply }: OfferEngineProps) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [applicableOffers, setApplicableOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [evaluating, setEvaluating] = useState(false)

  useEffect(() => {
    fetchOffers()
  }, [storeId, userId])

  const fetchOffers = async () => {
    try {
      let url = `/api/automation/offers?storeId=${storeId}`
      if (userId) {
        url += `&action=personalized&userId=${userId}`
      }

      const response = await fetch(url)
      const data = await response.json()
      setOffers(data.offers || [])
    } catch (error) {
      console.error('Error fetching offers:', error)
    } finally {
      setLoading(false)
    }
  }

  const evaluateOffers = async () => {
    if (!userId || cartItems.length === 0) return

    setEvaluating(true)
    try {
      const response = await fetch('/api/automation/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate',
          userId,
          storeId,
          items: cartItems,
          subtotal
        })
      })

      const data = await response.json()
      setApplicableOffers(data.evaluation?.applicableOffers || [])
    } catch (error) {
      console.error('Error evaluating offers:', error)
    } finally {
      setEvaluating(false)
    }
  }

  const applyOffer = async (offer: Offer) => {
    if (!userId) return

    try {
      await fetch('/api/automation/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'applyToUser',
          userId,
          offerRuleId: offer.id
        })
      })

      onOfferApply?.(offer)
      fetchOffers() // Refresh offers
    } catch (error) {
      console.error('Error applying offer:', error)
    }
  }

  const getOfferIcon = (type: string) => {
    switch (type) {
      case 'BUY_ONE_GET_ONE':
        return <Gift className="h-4 w-4" />
      case 'PERCENTAGE_DISCOUNT':
        return <Percent className="h-4 w-4" />
      case 'FIXED_AMOUNT_DISCOUNT':
        return <Gift className="h-4 w-4" />
      case 'FREE_ITEM':
        return <Star className="h-4 w-4" />
      case 'COMBO_DEAL':
        return <Zap className="h-4 w-4" />
      default:
        return <Gift className="h-4 w-4" />
    }
  }

  const getOfferColor = (type: string) => {
    switch (type) {
      case 'BUY_ONE_GET_ONE':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'PERCENTAGE_DISCOUNT':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'FIXED_AMOUNT_DISCOUNT':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'FREE_ITEM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'COMBO_DEAL':
        return 'bg-red-100 text-red-800 border-red-200'
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

  const getDaysString = (days: any[]) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days.map(day => dayNames[day]).join(', ')
  }

  const getOfferDescription = (offer: Offer) => {
    const action = offer.actions[0]
    if (!action) return offer.description || ''

    switch (action.type) {
      case 'PERCENTAGE_DISCOUNT':
        return `${action.value}% off on your order`
      case 'FIXED_AMOUNT_DISCOUNT':
        return `₹${action.value} discount on your order`
      case 'BUY_ONE_GET_ONE':
        return 'Buy 1 Get 1 Free'
      case 'FREE_ITEM':
        return 'Get a free item with your order'
      case 'COMBO_PRICE':
        return `Special combo price: ₹${action.value}`
      default:
        return offer.description || ''
    }
  }

  const isOfferActive = (offer: Offer) => {
    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5)
    const currentDay = now.getDay()
    
    const daysOfWeek = offer.daysOfWeek
    if (!daysOfWeek.includes(currentDay)) return false

    const startTime = offer.startTime
    const endTime = offer.endTime
    
    const current = timeToMinutes(currentTime)
    const start = timeToMinutes(startTime)
    const end = timeToMinutes(endTime)

    if (end < start) {
      return current >= start || current <= end
    }

    return current >= start && current <= end
  }

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Offer Evaluation */}
      {userId && cartItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Available Offers for Your Cart
            </CardTitle>
            <CardDescription>
              Check which offers you can apply to your current order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={evaluateOffers} 
                disabled={evaluating}
                className="w-full"
              >
                {evaluating ? 'Evaluating...' : 'Check Available Offers'}
              </Button>
              
              {applicableOffers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700">
                    {applicableOffers.length} offer(s) applicable!
                  </h4>
                  {applicableOffers.map((offer, index) => (
                    <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-green-800">{offer.ruleName}</h5>
                          <p className="text-sm text-green-700">{offer.description}</p>
                          <p className="text-sm font-medium text-green-600 mt-1">
                            Save: ₹{offer.discountAmount.toFixed(2)}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => applyOffer(offer)}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {applicableOffers.length === 0 && evaluating === false && (
                <div className="text-center py-4 text-gray-500">
                  No applicable offers found for your current cart
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Offers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Available Offers
          </CardTitle>
          <CardDescription>
            Discover amazing deals and discounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {offers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Gift className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Active Offers
              </h3>
              <p className="text-gray-500">
                Check back later for exciting deals and discounts
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map((offer) => {
                const isActive = isOfferActive(offer)
                const isPersonalized = offer.relevanceScore !== undefined
                
                return (
                  <Card 
                    key={offer.id} 
                    className={`transition-all hover:shadow-md ${
                      isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                    } ${isPersonalized ? 'ring-2 ring-blue-200' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {getOfferIcon(offer.type)}
                          <h3 className="font-semibold">{offer.name}</h3>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={getOfferColor(offer.type)}>
                            {offer.type.replace('_', ' ')}
                          </Badge>
                          {isActive && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Active Now
                            </Badge>
                          )}
                          {isPersonalized && (
                            <Badge variant="outline" className="border-blue-200 text-blue-700">
                              For You
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {getOfferDescription(offer)}
                      </p>
                      
                      {offer.description && (
                        <p className="text-xs text-gray-500 mb-3">
                          {offer.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(offer.startTime)} - {formatTime(offer.endTime)}
                        </span>
                        <span>{getDaysString(offer.daysOfWeek)}</span>
                      </div>
                      
                      {isPersonalized && offer.reason && (
                        <div className="p-2 bg-blue-50 rounded text-xs text-blue-700 mb-3">
                          <strong>Why you'll like this:</strong> {offer.reason}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          {offer.maxUsage && (
                            <span>{offer.usageCount}/{offer.maxUsage} used</span>
                          )}
                        </div>
                        {userId && isActive && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => applyOffer(offer)}
                          >
                            Claim Offer
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}