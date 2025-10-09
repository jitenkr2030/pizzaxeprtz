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
import { ChefHat, Plus, Gift, Percent, Calendar, Users, Copy, Trash2, Edit, Eye, TrendingUp } from "lucide-react"

interface Promotion {
  id: string
  title: string
  description: string
  code: string
  type: 'percentage' | 'fixed' | 'buy-one-get-one' | 'free-delivery'
  value: number
  minOrderAmount: number
  maxDiscountAmount?: number
  usageLimit: number
  usedCount: number
  startDate: string
  endDate: string
  isActive: boolean
  applicableItems: string[]
  customerSegments: string[]
  terms: string
}

interface Campaign {
  id: string
  name: string
  description: string
  type: 'holiday' | 'seasonal' | 'loyalty' | 'new-customer' | 'clearance'
  startDate: string
  endDate: string
  budget: number
  spent: number
  promotions: string[]
  status: 'active' | 'scheduled' | 'ended' | 'paused'
  targetAudience: string
  expectedReach: number
  actualReach: number
}

const samplePromotions: Promotion[] = [
  {
    id: "1",
    title: "Welcome Offer",
    description: "Get 20% off your first order",
    code: "WELCOME20",
    type: "percentage",
    value: 20,
    minOrderAmount: 15,
    usageLimit: 1000,
    usedCount: 342,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true,
    applicableItems: ["all"],
    customerSegments: ["new-customers"],
    terms: "Valid for first-time customers only. Minimum order value $15."
  },
  {
    id: "2",
    title: "Weekend Special",
    description: "$5 off orders over $30",
    code: "WEEKEND5",
    type: "fixed",
    value: 5,
    minOrderAmount: 30,
    maxDiscountAmount: 5,
    usageLimit: 500,
    usedCount: 127,
    startDate: "2024-01-15",
    endDate: "2024-03-31",
    isActive: true,
    applicableItems: ["all"],
    customerSegments: ["all"],
    terms: "Valid on weekends only. Minimum order value $30."
  },
  {
    id: "3",
    title: "Free Delivery Tuesday",
    description: "Free delivery on all orders",
    code: "FREETUES",
    type: "free-delivery",
    value: 0,
    minOrderAmount: 0,
    usageLimit: 200,
    usedCount: 89,
    startDate: "2024-01-20",
    endDate: "2024-01-27",
    isActive: true,
    applicableItems: ["all"],
    customerSegments: ["all"],
    terms: "Valid on Tuesdays only. Delivery fee waived."
  },
  {
    id: "4",
    title: "BOGO Pizza",
    description: "Buy one pizza, get one free",
    code: "BOGOPIZZA",
    type: "buy-one-get-one",
    value: 1,
    minOrderAmount: 20,
    usageLimit: 100,
    usedCount: 45,
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    isActive: true,
    applicableItems: ["pizzas"],
    customerSegments: ["all"],
    terms: "Buy one pizza, get one of equal or lesser value free."
  }
]

const sampleCampaigns: Campaign[] = [
  {
    id: "1",
    name: "New Year Campaign",
    description: "Start the year with great deals",
    type: "holiday",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    budget: 5000,
    spent: 3200,
    promotions: ["1", "2"],
    status: "active",
    targetAudience: "All customers",
    expectedReach: 10000,
    actualReach: 8450
  },
  {
    id: "2",
    name: "Valentine's Special",
    description: "Share the love with our Valentine's deals",
    type: "seasonal",
    startDate: "2024-02-01",
    endDate: "2024-02-14",
    budget: 3000,
    spent: 0,
    promotions: [],
    status: "scheduled",
    targetAudience: "Couples",
    expectedReach: 5000,
    actualReach: 0
  }
]

export default function PromotionsManagement() {
  const [promotions, setPromotions] = useState<Promotion[]>(samplePromotions)
  const [campaigns, setCampaigns] = useState<Campaign[]>(sampleCampaigns)
  const [isAddPromotionOpen, setIsAddPromotionOpen] = useState(false)
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false)
  const [newPromotion, setNewPromotion] = useState({
    title: "",
    description: "",
    code: "",
    type: "percentage" as Promotion['type'],
    value: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 100,
    startDate: "",
    endDate: "",
    applicableItems: ["all"],
    customerSegments: ["all"],
    terms: ""
  })

  const togglePromotionStatus = (id: string) => {
    setPromotions(prev => prev.map(promo => 
      promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
    ))
  }

  const addNewPromotion = () => {
    const promotion: Promotion = {
      id: Date.now().toString(),
      title: newPromotion.title,
      description: newPromotion.description,
      code: newPromotion.code,
      type: newPromotion.type,
      value: newPromotion.value,
      minOrderAmount: newPromotion.minOrderAmount,
      maxDiscountAmount: newPromotion.maxDiscountAmount || undefined,
      usageLimit: newPromotion.usageLimit,
      usedCount: 0,
      startDate: newPromotion.startDate,
      endDate: newPromotion.endDate,
      isActive: true,
      applicableItems: newPromotion.applicableItems,
      customerSegments: newPromotion.customerSegments,
      terms: newPromotion.terms
    }
    
    setPromotions(prev => [...prev, promotion])
    setNewPromotion({
      title: "",
      description: "",
      code: "",
      type: "percentage",
      value: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 100,
      startDate: "",
      endDate: "",
      applicableItems: ["all"],
      customerSegments: ["all"],
      terms: ""
    })
    setIsAddPromotionOpen(false)
  }

  const getTypeColor = (type: Promotion['type']) => {
    switch (type) {
      case 'percentage': return 'bg-blue-100 text-blue-800'
      case 'fixed': return 'bg-green-100 text-green-800'
      case 'buy-one-get-one': return 'bg-purple-100 text-purple-800'
      case 'free-delivery': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCampaignStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'ended': return 'bg-gray-100 text-gray-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTotalSavings = () => {
    return promotions.reduce((total, promo) => {
      if (promo.type === 'percentage') {
        return total + (promo.usedCount * promo.value * 25) // Assuming avg order of $25
      } else if (promo.type === 'fixed') {
        return total + (promo.usedCount * promo.value)
      }
      return total
    }, 0)
  }

  const getActivePromotions = () => promotions.filter(p => p.isActive)
  const getActiveCampaigns = () => campaigns.filter(c => c.status === 'active')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Promotions Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Marketing Tools</span>
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
                <Gift className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Promotions</p>
                  <p className="text-2xl font-bold text-gray-900">{getActivePromotions().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Percent className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Redemptions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {promotions.reduce((total, p) => total + p.usedCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Customer Savings</p>
                  <p className="text-2xl font-bold text-gray-900">${getTotalSavings().toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{getActiveCampaigns().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Promotions and Campaigns Tabs */}
        <Tabs defaultValue="promotions" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="promotions">Promotions</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <Dialog open={isAddPromotionOpen} onOpenChange={setIsAddPromotionOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Promotion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Promotion</DialogTitle>
                    <DialogDescription>
                      Create a new discount code or promotion offer.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={newPromotion.title}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, title: e.target.value }))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={newPromotion.description}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, description: e.target.value }))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="code" className="text-right">
                        Code
                      </Label>
                      <Input
                        id="code"
                        value={newPromotion.code}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        className="col-span-3"
                        placeholder="e.g., WELCOME20"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Select value={newPromotion.type} onValueChange={(value: Promotion['type']) => setNewPromotion(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage Discount</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="buy-one-get-one">Buy One Get One</SelectItem>
                          <SelectItem value="free-delivery">Free Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="value" className="text-right">
                        Value
                      </Label>
                      <Input
                        id="value"
                        type="number"
                        value={newPromotion.value}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="minOrder" className="text-right">
                        Min Order
                      </Label>
                      <Input
                        id="minOrder"
                        type="number"
                        value={newPromotion.minOrderAmount}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, minOrderAmount: parseFloat(e.target.value) || 0 }))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="usageLimit" className="text-right">
                        Usage Limit
                      </Label>
                      <Input
                        id="usageLimit"
                        type="number"
                        value={newPromotion.usageLimit}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, usageLimit: parseInt(e.target.value) || 100 }))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="startDate" className="text-right">
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newPromotion.startDate}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, startDate: e.target.value }))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="endDate" className="text-right">
                        End Date
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newPromotion.endDate}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, endDate: e.target.value }))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="terms" className="text-right">
                        Terms
                      </Label>
                      <Input
                        id="terms"
                        value={newPromotion.terms}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, terms: e.target.value }))}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddPromotionOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addNewPromotion} className="bg-red-600 hover:bg-red-700">
                      Create Promotion
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="promotions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map(promotion => (
                <Card key={promotion.id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{promotion.title}</CardTitle>
                        <CardDescription>{promotion.description}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={promotion.isActive}
                          onCheckedChange={() => togglePromotionStatus(promotion.id)}
                        />
                        <Badge className={getTypeColor(promotion.type)}>
                          {promotion.type === 'percentage' ? '%' : 
                           promotion.type === 'fixed' ? '$' :
                           promotion.type === 'buy-one-get-one' ? 'BOGO' : 'Free'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Code:</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{promotion.code}</Badge>
                          <Button size="sm" variant="ghost">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Value:</span>
                        <span className="font-medium">
                          {promotion.type === 'percentage' ? `${promotion.value}%` :
                           promotion.type === 'fixed' ? `$${promotion.value}` :
                           promotion.type === 'buy-one-get-one' ? 'BOGO' : 'Free Delivery'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Min Order:</span>
                        <span className="font-medium">${promotion.minOrderAmount}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Usage:</span>
                        <span className="font-medium">
                          {promotion.usedCount}/{promotion.usageLimit}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Period:</span>
                        <span className="text-sm">
                          {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Progress:</span>
                          <span className="text-sm font-medium">
                            {Math.round((promotion.usedCount / promotion.usageLimit) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full transition-all"
                            style={{ width: `${(promotion.usedCount / promotion.usageLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-2">
                        {promotion.terms}
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map(campaign => (
                <Card key={campaign.id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <CardDescription>{campaign.description}</CardDescription>
                      </div>
                      <Badge className={getCampaignStatusColor(campaign.status)}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Type:</span>
                        <Badge variant="outline">{campaign.type}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Budget:</span>
                        <span className="font-medium">
                          ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Reach:</span>
                        <span className="font-medium">
                          {campaign.actualReach.toLocaleString()} / {campaign.expectedReach.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Target:</span>
                        <span className="text-sm">{campaign.targetAudience}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Period:</span>
                        <span className="text-sm">
                          {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Budget Usage:</span>
                          <span className="text-sm font-medium">
                            {Math.round((campaign.spent / campaign.budget) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Reach Progress:</span>
                          <span className="text-sm font-medium">
                            {Math.round((campaign.actualReach / campaign.expectedReach) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${(campaign.actualReach / campaign.expectedReach) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}