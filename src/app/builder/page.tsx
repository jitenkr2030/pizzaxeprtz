"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AuthButton } from "@/components/auth-button"
import { ChefHat, Plus, Minus, ShoppingCart, Leaf, Star } from "lucide-react"
import Link from "next/link"

interface PizzaOption {
  id: string
  name: string
  description: string
  price: number
  isVegetarian?: boolean
  isVegan?: boolean
  category: string
}

interface CustomPizza {
  size: PizzaOption | null
  base: PizzaOption | null
  sauce: PizzaOption | null
  cheese: PizzaOption | null
  toppings: PizzaOption[]
  extras: PizzaOption[]
}

const pizzaSizes: PizzaOption[] = [
  { id: "small", name: "Small", description: "10\"", price: 8.99, category: "size" },
  { id: "medium", name: "Medium", description: "12\"", price: 12.99, category: "size" },
  { id: "large", name: "Large", description: "14\"", price: 16.99, category: "size" },
  { id: "xlarge", name: "Extra Large", description: "16\"", price: 20.99, category: "size" }
]

const pizzaBases: PizzaOption[] = [
  { id: "thin", name: "Thin Crust", description: "Classic thin and crispy", price: 0, category: "base" },
  { id: "thick", name: "Thick Crust", description: "Soft and chewy", price: 0, category: "base" },
  { id: "stuffed", name: "Stuffed Crust", description: "Cheese-filled crust", price: 2.99, category: "base" },
  { id: "gluten-free", name: "Gluten Free", description: "Gluten-free base", price: 3.99, category: "base" }
]

const pizzaSauces: PizzaOption[] = [
  { id: "tomato", name: "Tomato Sauce", description: "Classic tomato base", price: 0, category: "sauce" },
  { id: "bbq", name: "BBQ Sauce", description: "Sweet and smoky BBQ", price: 0, category: "sauce" },
  { id: "white", name: "White Sauce", description: "Creamy garlic sauce", price: 0, category: "sauce" },
  { id: "pesto", name: "Pesto Sauce", description: "Fresh basil pesto", price: 1.99, category: "sauce" }
]

const pizzaCheeses: PizzaOption[] = [
  { id: "mozzarella", name: "Mozzarella", description: "Classic Italian cheese", price: 0, category: "cheese" },
  { id: "cheddar", name: "Cheddar", description: "Sharp cheddar cheese", price: 0, category: "cheese" },
  { id: "parmesan", name: "Parmesan", description: "Aged parmesan", price: 0.99, category: "cheese" },
  { id: "vegan", name: "Vegan Cheese", description: "Plant-based cheese", price: 1.99, category: "cheese" }
]

const pizzaToppings: PizzaOption[] = [
  { id: "pepperoni", name: "Pepperoni", description: "Spicy pepperoni slices", price: 1.99, category: "topping" },
  { id: "mushrooms", name: "Mushrooms", description: "Fresh mushrooms", price: 1.49, category: "topping", isVegetarian: true, isVegan: true },
  { id: "onions", name: "Onions", description: "Fresh red onions", price: 0.99, category: "topping", isVegetarian: true, isVegan: true },
  { id: "bell-peppers", name: "Bell Peppers", description: "Colorful bell peppers", price: 1.49, category: "topping", isVegetarian: true, isVegan: true },
  { id: "olives", name: "Olives", description: "Kalamata olives", price: 1.49, category: "topping", isVegetarian: true, isVegan: true },
  { id: "tomatoes", name: "Tomatoes", description: "Fresh cherry tomatoes", price: 1.49, category: "topping", isVegetarian: true, isVegan: true },
  { id: "chicken", name: "Grilled Chicken", description: "Tender grilled chicken", price: 2.99, category: "topping" },
  { id: "bacon", name: "Bacon", description: "Crispy bacon bits", price: 2.49, category: "topping" },
  { id: "pineapple", name: "Pineapple", description: "Sweet pineapple chunks", price: 1.99, category: "topping", isVegetarian: true, isVegan: true },
  { id: "jalapenos", name: "Jalapeños", description: "Spicy jalapeño peppers", price: 0.99, category: "topping", isVegetarian: true, isVegan: true }
]

const pizzaExtras: PizzaOption[] = [
  { id: "extra-cheese", name: "Extra Cheese", description: "Double the cheese", price: 2.99, category: "extra" },
  { id: "stuffed-crust", name: "Stuffed Crust", description: "Cheese-stuffed crust", price: 3.99, category: "extra" },
  { id: "garlic-butter", name: "Garlic Butter Crust", description: "Garlic butter brushed crust", price: 1.99, category: "extra" },
  { id: "spicy-oil", name: "Spicy Oil Drizzle", description: "Chili oil drizzle", price: 0.99, category: "extra" }
]

export default function PizzaBuilder() {
  const [customPizza, setCustomPizza] = useState<CustomPizza>({
    size: null,
    base: null,
    sauce: null,
    cheese: null,
    toppings: [],
    extras: []
  })

  const [cartItems, setCartItems] = useState<any[]>([])

  const calculatePrice = () => {
    let total = 0
    
    if (customPizza.size) total += customPizza.size.price
    if (customPizza.base) total += customPizza.base.price
    if (customPizza.sauce) total += customPizza.sauce.price
    if (customPizza.cheese) total += customPizza.cheese.price
    
    customPizza.toppings.forEach(topping => total += topping.price)
    customPizza.extras.forEach(extra => total += extra.price)
    
    return total
  }

  const getProgress = () => {
    const steps = ['size', 'base', 'sauce', 'cheese']
    const completedSteps = steps.filter(step => customPizza[step as keyof CustomPizza] !== null).length
    return (completedSteps / steps.length) * 100
  }

  const selectOption = (option: PizzaOption, category: keyof CustomPizza) => {
    if (category === 'toppings') {
      setCustomPizza(prev => ({
        ...prev,
        toppings: prev.toppings.some(t => t.id === option.id)
          ? prev.toppings.filter(t => t.id !== option.id)
          : [...prev.toppings, option]
      }))
    } else if (category === 'extras') {
      setCustomPizza(prev => ({
        ...prev,
        extras: prev.extras.some(e => e.id === option.id)
          ? prev.extras.filter(e => e.id !== option.id)
          : [...prev.extras, option]
      }))
    } else {
      setCustomPizza(prev => ({ ...prev, [category]: option }))
    }
  }

  const isSelected = (option: PizzaOption, category: keyof CustomPizza) => {
    if (category === 'toppings') {
      return customPizza.toppings.some(t => t.id === option.id)
    } else if (category === 'extras') {
      return customPizza.extras.some(e => e.id === option.id)
    } else {
      return customPizza[category]?.id === option.id
    }
  }

  const addToCart = () => {
    if (!customPizza.size || !customPizza.base || !customPizza.sauce || !customPizza.cheese) {
      alert("Please complete all required fields")
      return
    }

    const pizzaItem = {
      id: `custom-${Date.now()}`,
      name: "Custom Pizza",
      description: `${customPizza.size.name} ${customPizza.base.name} with ${customPizza.sauce.name}, ${customPizza.cheese.name}`,
      price: calculatePrice(),
      customPizza: { ...customPizza },
      quantity: 1
    }

    setCartItems(prev => [...prev, pizzaItem])
    alert("Custom pizza added to cart!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Pizzaxperts</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <AuthButton cartItemCount={cartItems.length} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Build Your Perfect Pizza</h2>
          <p className="text-lg mb-6">Create your own masterpiece with our fresh ingredients</p>
          
          <div className="max-w-md mx-auto mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Builder Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Size Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                  Choose Your Size
                </CardTitle>
                <CardDescription>Select the perfect size for your pizza</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pizzaSizes.map(size => (
                    <div
                      key={size.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected(size, 'size') ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-400'
                      }`}
                      onClick={() => selectOption(size, 'size')}
                    >
                      <h3 className="font-semibold text-center">{size.name}</h3>
                      <p className="text-sm text-gray-600 text-center">{size.description}</p>
                      <p className="text-lg font-bold text-red-600 text-center">${size.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Base Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                  Choose Your Base
                </CardTitle>
                <CardDescription>Select your preferred crust style</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pizzaBases.map(base => (
                    <div
                      key={base.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected(base, 'base') ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-400'
                      }`}
                      onClick={() => selectOption(base, 'base')}
                    >
                      <h3 className="font-semibold text-center">{base.name}</h3>
                      <p className="text-sm text-gray-600 text-center">{base.description}</p>
                      {base.price > 0 && (
                        <p className="text-lg font-bold text-red-600 text-center">+${base.price.toFixed(2)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sauce Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                  Choose Your Sauce
                </CardTitle>
                <CardDescription>Pick your favorite sauce base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pizzaSauces.map(sauce => (
                    <div
                      key={sauce.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected(sauce, 'sauce') ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-400'
                      }`}
                      onClick={() => selectOption(sauce, 'sauce')}
                    >
                      <h3 className="font-semibold text-center">{sauce.name}</h3>
                      <p className="text-sm text-gray-600 text-center">{sauce.description}</p>
                      {sauce.price > 0 && (
                        <p className="text-lg font-bold text-red-600 text-center">+${sauce.price.toFixed(2)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cheese Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
                  Choose Your Cheese
                </CardTitle>
                <CardDescription>Select your cheese preference</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pizzaCheeses.map(cheese => (
                    <div
                      key={cheese.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected(cheese, 'cheese') ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-400'
                      }`}
                      onClick={() => selectOption(cheese, 'cheese')}
                    >
                      <h3 className="font-semibold text-center">{cheese.name}</h3>
                      <p className="text-sm text-gray-600 text-center">{cheese.description}</p>
                      {cheese.price > 0 && (
                        <p className="text-lg font-bold text-red-600 text-center">+${cheese.price.toFixed(2)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Toppings Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">5</span>
                  Add Toppings
                </CardTitle>
                <CardDescription>Select as many toppings as you like</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {pizzaToppings.map(topping => (
                    <div
                      key={topping.id}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected(topping, 'toppings') ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-400'
                      }`}
                      onClick={() => selectOption(topping, 'toppings')}
                    >
                      <h3 className="font-semibold text-sm text-center">{topping.name}</h3>
                      <p className="text-xs text-gray-600 text-center">{topping.description}</p>
                      <p className="text-sm font-bold text-red-600 text-center">+${topping.price.toFixed(2)}</p>
                      {topping.isVegetarian && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs mt-1">
                          <Leaf className="h-2 w-2 mr-1" />
                          Veg
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Extras Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">6</span>
                  Add Extras
                </CardTitle>
                <CardDescription>Enhance your pizza with extra options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pizzaExtras.map(extra => (
                    <div
                      key={extra.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected(extra, 'extras') ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-400'
                      }`}
                      onClick={() => selectOption(extra, 'extras')}
                    >
                      <h3 className="font-semibold text-center">{extra.name}</h3>
                      <p className="text-sm text-gray-600 text-center">{extra.description}</p>
                      <p className="text-lg font-bold text-red-600 text-center">+${extra.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Your Custom Pizza
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {customPizza.size && (
                    <div className="flex justify-between">
                      <span className="text-sm">Size: {customPizza.size.name}</span>
                      <span className="text-sm font-medium">${customPizza.size.price.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {customPizza.base && (
                    <div className="flex justify-between">
                      <span className="text-sm">Base: {customPizza.base.name}</span>
                      <span className="text-sm font-medium">${customPizza.base.price.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {customPizza.sauce && (
                    <div className="flex justify-between">
                      <span className="text-sm">Sauce: {customPizza.sauce.name}</span>
                      <span className="text-sm font-medium">${customPizza.sauce.price.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {customPizza.cheese && (
                    <div className="flex justify-between">
                      <span className="text-sm">Cheese: {customPizza.cheese.name}</span>
                      <span className="text-sm font-medium">${customPizza.cheese.price.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {customPizza.toppings.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Toppings:</div>
                      {customPizza.toppings.map(topping => (
                        <div key={topping.id} className="flex justify-between text-sm">
                          <span>{topping.name}</span>
                          <span className="font-medium">+${topping.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {customPizza.extras.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Extras:</div>
                      {customPizza.extras.map(extra => (
                        <div key={extra.id} className="flex justify-between text-sm">
                          <span>{extra.name}</span>
                          <span className="font-medium">+${extra.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-red-600">${calculatePrice().toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={addToCart}
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={!customPizza.size || !customPizza.base || !customPizza.sauce || !customPizza.cheese}
                    >
                      Add to Cart
                    </Button>
                    
                    <Link href="/cart">
                      <Button variant="outline" className="w-full">
                        View Cart
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {!customPizza.size || !customPizza.base || !customPizza.sauce || !customPizza.cheese ? (
                  <div className="text-sm text-gray-500 text-center">
                    Please complete all required fields to add to cart
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}