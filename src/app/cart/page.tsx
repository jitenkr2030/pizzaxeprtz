"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"

interface CartItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  image: string
  isVegetarian: boolean
  isVegan: boolean
  isSpicy: boolean
  customizations?: Array<{
    name: string
    price: number
  }>
}

const sampleCartItems: CartItem[] = [
  {
    id: "1",
    name: "Margherita Classic",
    description: "Fresh mozzarella, tomato sauce, basil leaves",
    price: 12.99,
    quantity: 1,
    image: "/api/placeholder/120/120",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    customizations: [
      { name: "Extra Cheese", price: 2.00 },
      { name: "Large Size", price: 3.00 }
    ]
  },
  {
    id: "2",
    name: "Pepperoni Feast",
    description: "Double pepperoni, mozzarella cheese, tomato sauce",
    price: 15.99,
    quantity: 2,
    image: "/api/placeholder/120/120",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    customizations: [
      { name: "Extra Pepperoni", price: 3.00 }
    ]
  },
  {
    id: "5",
    name: "Garlic Bread",
    description: "Fresh baked bread with garlic butter and herbs",
    price: 6.99,
    quantity: 1,
    image: "/api/placeholder/120/120",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false
  }
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(sampleCartItems)

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const subtotal = cartItems.reduce((total, item) => {
    const customizationsTotal = item.customizations?.reduce((sum, custom) => sum + custom.price, 0) || 0
    return total + (item.price + customizationsTotal) * item.quantity
  }, 0)

  const deliveryFee = subtotal > 20 ? 0 : 2.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Menu
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 ml-8">Shopping Cart</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any delicious pizzas to your cart yet.</p>
            <Link href="/">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                Browse Menu
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Menu
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 ml-8">Shopping Cart</h1>
            </div>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                            
                            {/* Dietary badges */}
                            <div className="flex gap-1 mt-1">
                              {item.isVegetarian && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                  🌱 Veg
                                </Badge>
                              )}
                              {item.isVegan && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                  🌿 Vegan
                                </Badge>
                              )}
                              {item.isSpicy && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                                  🌶️ Spicy
                                </Badge>
                              )}
                            </div>

                            {/* Customizations */}
                            {item.customizations && item.customizations.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-700">Customizations:</p>
                                {item.customizations.map((custom, index) => (
                                  <p key={index} className="text-xs text-gray-600">
                                    + {custom.name} (${custom.price.toFixed(2)})
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-lg text-red-600">
                              ${((item.price + (item.customizations?.reduce((sum, custom) => sum + custom.price, 0) || 0)) * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                      {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  {deliveryFee === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        🎉 Free delivery on orders over $20!
                      </p>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-red-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout">
                    <Button className="w-full bg-red-600 hover:bg-red-700" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-2">Need Help?</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Have questions about your order? Our customer service team is here to help!
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">📞 (555) 123-4567</p>
                    <p className="text-xs text-gray-600">📧 support@pizzaxperts.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}