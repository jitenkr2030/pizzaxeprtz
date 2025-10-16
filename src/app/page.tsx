"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthButton } from "@/components/auth-button"
import { Search, Star, Clock, Leaf, ChefHat, ShoppingCart, Brain, Zap } from "lucide-react"
import Link from "next/link"
import { formatINRWithRs } from "@/lib/currency"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  isVegetarian: boolean
  isVegan: boolean
  isSpicy: boolean
  preparationTime: number
  category: string
  portionSizes?: Array<{
    name: string
    price: number
    weight?: string
    description?: string
  }>
  sizes?: Array<{
    name: string
    price: number
    diameter?: string
    servings?: number
  }>
  weights?: Array<{
    name: string
    price: number
    weight: string
    description?: string
  }>
}

const sampleMenuItems: MenuItem[] = [
  // Indian Flavour Pizzas
  {
    id: "1",
    name: "Paneer Tikka Pizza",
    description: "Marinated paneer tikka with onions, capsicum, and Indian spices on pizza base",
    price: 499,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 20,
    category: "indian-pizzas",
    sizes: [
      { name: "Small", price: 499, diameter: "9\"", servings: 2 },
      { name: "Medium", price: 699, diameter: "12\"", servings: 3 },
      { name: "Large", price: 899, diameter: "15\"", servings: 4 }
    ]
  },
  {
    id: "2",
    name: "Tandoori Chicken Pizza",
    description: "Tandoori chicken pieces with mint chutney and cheese",
    price: 599,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 22,
    category: "indian-pizzas",
    sizes: [
      { name: "Small", price: 599, diameter: "9\"", servings: 2 },
      { name: "Medium", price: 799, diameter: "12\"", servings: 3 },
      { name: "Large", price: 999, diameter: "15\"", servings: 4 }
    ]
  },
  {
    id: "3",
    name: "Butter Chicken Pizza",
    description: "Creamy butter chicken sauce with mozzarella cheese",
    price: 649,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 25,
    category: "indian-pizzas",
    sizes: [
      { name: "Small", price: 649, diameter: "9\"", servings: 2 },
      { name: "Medium", price: 849, diameter: "12\"", servings: 3 },
      { name: "Large", price: 1049, diameter: "15\"", servings: 4 }
    ]
  },
  {
    id: "4",
    name: "Achari Paneer Pizza",
    description: "Paneer with pickling spices and tangy achari flavor",
    price: 549,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 20,
    category: "indian-pizzas",
    sizes: [
      { name: "Small", price: 549, diameter: "9\"", servings: 2 },
      { name: "Medium", price: 749, diameter: "12\"", servings: 3 },
      { name: "Large", price: 949, diameter: "15\"", servings: 4 }
    ]
  },
  {
    id: "5",
    name: "Masala Corn Pizza",
    description: "Sweet corn with Indian masala spices and cheese",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 18,
    category: "indian-pizzas",
    sizes: [
      { name: "Small", price: 449, diameter: "9\"", servings: 2 },
      { name: "Medium", price: 649, diameter: "12\"", servings: 3 },
      { name: "Large", price: 849, diameter: "15\"", servings: 4 }
    ]
  },
  {
    id: "6",
    name: "Keema Masala Pizza",
    description: "Minced meat with aromatic Indian spices",
    price: 699,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 25,
    category: "indian-pizzas",
    sizes: [
      { name: "Small", price: 699, diameter: "9\"", servings: 2 },
      { name: "Medium", price: 899, diameter: "12\"", servings: 3 },
      { name: "Large", price: 1099, diameter: "15\"", servings: 4 }
    ]
  },
  {
    id: "7",
    name: "Amritsari Fish Pizza",
    description: "Premium Amritsari fish with Indian herbs and spices",
    price: 849,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 28,
    category: "indian-pizzas",
    sizes: [
      { name: "Small", price: 849, diameter: "9\"", servings: 2 },
      { name: "Medium", price: 1049, diameter: "12\"", servings: 3 },
      { name: "Large", price: 1249, diameter: "15\"", servings: 4 }
    ]
  },

  // Indian Starters & Sides
  {
    id: "8",
    name: "Veg Samosa (2 pcs)",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 199,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 10,
    category: "starters",
    portionSizes: [
      { name: "2 pcs", price: 199, weight: "120g", description: "Perfect for one person" },
      { name: "4 pcs", price: 349, weight: "240g", description: "Good for sharing" },
      { name: "6 pcs", price: 499, weight: "360g", description: "Party size" }
    ]
  },
  {
    id: "9",
    name: "Paneer Pakora",
    description: "Crispy fried paneer with gram flour batter",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 12,
    category: "starters",
    portionSizes: [
      { name: "Regular", price: 299, weight: "200g", description: "6 pieces" },
      { name: "Large", price: 449, weight: "300g", description: "10 pieces" }
    ]
  },
  {
    id: "10",
    name: "Chicken Pakora",
    description: "Tender chicken pieces fried in spiced gram flour",
    price: 349,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "starters",
    portionSizes: [
      { name: "Regular", price: 349, weight: "200g", description: "6 pieces" },
      { name: "Large", price: 499, weight: "300g", description: "10 pieces" }
    ]
  },
  {
    id: "11",
    name: "Fish Fingers",
    description: "Crispy fish fingers with tartar sauce",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 12,
    category: "starters",
    portionSizes: [
      { name: "4 pcs", price: 449, weight: "150g", description: "Regular portion" },
      { name: "8 pcs", price: 799, weight: "300g", description: "Large portion" }
    ]
  },
  {
    id: "12",
    name: "Onion Rings with Masala Dip",
    description: "Crispy onion rings with special masala dip",
    price: 249,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 8,
    category: "starters",
    portionSizes: [
      { name: "Regular", price: 249, weight: "120g", description: "8 rings" },
      { name: "Large", price: 399, weight: "200g", description: "12 rings" }
    ]
  },
  {
    id: "13",
    name: "Garlic Naan Sticks",
    description: "Soft naan sticks with garlic butter and cheese dip",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 10,
    category: "starters",
    portionSizes: [
      { name: "4 pcs", price: 299, weight: "200g", description: "Regular portion" },
      { name: "8 pcs", price: 499, weight: "400g", description: "Sharing portion" }
    ]
  },
  {
    id: "14",
    name: "Hara Bhara Kabab",
    description: "Spinach and green peas kababs with mint chutney",
    price: 349,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 15,
    category: "starters",
    portionSizes: [
      { name: "4 pcs", price: 349, weight: "200g", description: "Regular portion" },
      { name: "6 pcs", price: 499, weight: "300g", description: "Large portion" }
    ]
  },
  {
    id: "15",
    name: "Veg Cutlet",
    description: "Mixed vegetable cutlets with spicy ketchup",
    price: 249,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 12,
    category: "starters",
    portionSizes: [
      { name: "2 pcs", price: 249, weight: "150g", description: "Regular portion" },
      { name: "4 pcs", price: 399, weight: "300g", description: "Large portion" }
    ]
  },

  // Indian Burgers / Wraps
  {
    id: "16",
    name: "Aloo Tikki Burger",
    description: "Spiced potato patty with Indian spices in burger bun",
    price: 349,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 12,
    category: "burgers-wraps"
  },
  {
    id: "17",
    name: "Paneer Tikka Burger",
    description: "Grilled paneer tikka with Indian spices in burger",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "burgers-wraps"
  },
  {
    id: "18",
    name: "Chicken Seekh Burger",
    description: "Minced chicken seekh kebab in burger bun",
    price: 499,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "burgers-wraps"
  },
  {
    id: "19",
    name: "Paneer Kathi Roll",
    description: "Paneer tikka wrapped in Indian flatbread with chutney",
    price: 399,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 12,
    category: "burgers-wraps"
  },
  {
    id: "20",
    name: "Chicken Kathi Roll",
    description: "Grilled chicken wrapped in Indian flatbread",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 12,
    category: "burgers-wraps"
  },
  {
    id: "21",
    name: "Egg Roll",
    description: "Spiced egg wrapped in Indian flatbread with vegetables",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 10,
    category: "burgers-wraps"
  },

  // Indian Main Course Combos
  {
    id: "22",
    name: "Butter Chicken + Naan/Paratha",
    description: "Creamy butter chicken with 2 butter naans or parathas",
    price: 599,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 25,
    category: "main-course"
  },
  {
    id: "23",
    name: "Dal Makhani + Jeera Rice",
    description: "Creamy black lentils with cumin rice",
    price: 549,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 20,
    category: "main-course"
  },
  {
    id: "24",
    name: "Paneer Butter Masala + Naan",
    description: "Cottage cheese in creamy tomato gravy with butter naan",
    price: 579,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 20,
    category: "main-course"
  },
  {
    id: "25",
    name: "Rajma Chawal",
    description: "Red kidney beans curry with steamed rice",
    price: 499,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 15,
    category: "main-course"
  },
  {
    id: "26",
    name: "Chole Chawal",
    description: "Chickpea curry with steamed rice",
    price: 499,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 15,
    category: "main-course"
  },
  {
    id: "27",
    name: "Chicken Curry + Rice Combo",
    description: "Spicy chicken curry with steamed basmati rice",
    price: 649,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 25,
    category: "main-course"
  },
  {
    id: "28",
    name: "Veg Thali (Mini)",
    description: "Mini thali with roti, sabzi, dal, rice, and pickle",
    price: 549,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 20,
    category: "main-course"
  },
  {
    id: "29",
    name: "Chicken Thali (Mini)",
    description: "Mini thali with roti, chicken curry, dal, rice, and pickle",
    price: 699,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 25,
    category: "main-course"
  },

  // Indian Street Food
  {
    id: "30",
    name: "Pav Bhaji",
    description: "Spiced mashed vegetables with buttered pav bread",
    price: 399,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "street-food",
    portionSizes: [
      { name: "Single", price: 399, weight: "400g", description: "2 pav with bhaji" },
      { name: "Double", price: 599, weight: "600g", description: "4 pav with extra bhaji" }
    ]
  },
  {
    id: "31",
    name: "Vada Pav",
    description: "Spiced potato fritter in bun with chutneys",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 10,
    category: "street-food",
    portionSizes: [
      { name: "1 pc", price: 299, weight: "150g", description: "Single vada pav" },
      { name: "2 pcs", price: 499, weight: "300g", description: "Two vada pav" }
    ]
  },
  {
    id: "32",
    name: "Misal Pav",
    description: "Spicy sprouted curry with pav bread",
    price: 349,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "street-food",
    portionSizes: [
      { name: "Regular", price: 349, weight: "350g", description: "2 pav with misal" },
      { name: "Large", price: 499, weight: "500g", description: "4 pav with extra misal" }
    ]
  },
  {
    id: "33",
    name: "Bhel Puri",
    description: "Puffed rice with vegetables, chutneys, and sev",
    price: 249,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 5,
    category: "street-food",
    portionSizes: [
      { name: "Regular", price: 249, weight: "200g", description: "Single serving" },
      { name: "Large", price: 399, weight: "350g", description: "Sharing size" }
    ]
  },
  {
    id: "34",
    name: "Dahi Puri",
    description: "Crispy puris filled with yogurt and chutneys",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 8,
    category: "street-food",
    portionSizes: [
      { name: "6 pcs", price: 299, weight: "250g", description: "Regular portion" },
      { name: "12 pcs", price: 499, weight: "450g", description: "Large portion" }
    ]
  },
  {
    id: "35",
    name: "Sev Puri",
    description: "Crispy puris with potatoes, chutneys, and sev",
    price: 249,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 5,
    category: "street-food",
    portionSizes: [
      { name: "6 pcs", price: 249, weight: "200g", description: "Regular portion" },
      { name: "12 pcs", price: 399, weight: "350g", description: "Large portion" }
    ]
  },
  {
    id: "36",
    name: "Pani Puri (6 pcs)",
    description: "Hollow puris with spicy water and fillings",
    price: 199,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 8,
    category: "street-food",
    portionSizes: [
      { name: "6 pcs", price: 199, weight: "180g", description: "Regular portion" },
      { name: "12 pcs", price: 349, weight: "350g", description: "Large portion" }
    ]
  },
  {
    id: "37",
    name: "Aloo Tikki Chaat",
    description: "Spiced potato patties with chutneys and yogurt",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 10,
    category: "street-food",
    portionSizes: [
      { name: "2 pcs", price: 299, weight: "200g", description: "Regular portion" },
      { name: "4 pcs", price: 499, weight: "350g", description: "Large portion" }
    ]
  },

  // Indian Snacks & Finger Food
  {
    id: "38",
    name: "Veg Momos (6 pcs)",
    description: "Steamed vegetable dumplings with spicy chutney",
    price: 349,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 12,
    category: "snacks",
    portionSizes: [
      { name: "6 pcs", price: 349, weight: "200g", description: "Regular portion" },
      { name: "12 pcs", price: 599, weight: "400g", description: "Large portion" }
    ]
  },
  {
    id: "39",
    name: "Chicken Momos (6 pcs)",
    description: "Steamed chicken dumplings with spicy chutney",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 12,
    category: "snacks",
    portionSizes: [
      { name: "6 pcs", price: 449, weight: "250g", description: "Regular portion" },
      { name: "12 pcs", price: 799, weight: "500g", description: "Large portion" }
    ]
  },
  {
    id: "40",
    name: "Tandoori Veg Momos (6 pcs)",
    description: "Tandoori roasted vegetable momos with mint chutney",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 15,
    category: "snacks",
    portionSizes: [
      { name: "6 pcs", price: 449, weight: "220g", description: "Regular portion" },
      { name: "12 pcs", price: 799, weight: "440g", description: "Large portion" }
    ]
  },
  {
    id: "41",
    name: "Paneer Malai Tikka",
    description: "Creamy paneer tikka with aromatic spices",
    price: 499,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 18,
    category: "snacks",
    portionSizes: [
      { name: "6 pcs", price: 499, weight: "300g", description: "Regular portion" },
      { name: "10 pcs", price: 799, weight: "500g", description: "Large portion" }
    ]
  },
  {
    id: "42",
    name: "Chicken Malai Tikka",
    description: "Creamy chicken tikka with aromatic spices",
    price: 549,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 18,
    category: "snacks",
    portionSizes: [
      { name: "6 pcs", price: 549, weight: "350g", description: "Regular portion" },
      { name: "10 pcs", price: 899, weight: "550g", description: "Large portion" }
    ]
  },
  {
    id: "43",
    name: "Veg Seekh Kabab",
    description: "Mixed vegetable seekh kababs with mint chutney",
    price: 399,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 15,
    category: "snacks",
    portionSizes: [
      { name: "4 pcs", price: 399, weight: "250g", description: "Regular portion" },
      { name: "8 pcs", price: 699, weight: "500g", description: "Large portion" }
    ]
  },
  {
    id: "44",
    name: "Chicken Seekh Kabab",
    description: "Minced chicken seekh kababs with mint chutney",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "snacks",
    portionSizes: [
      { name: "4 pcs", price: 449, weight: "300g", description: "Regular portion" },
      { name: "8 pcs", price: 799, weight: "600g", description: "Large portion" }
    ]
  },
  {
    id: "45",
    name: "Mini Samosa (6 pcs)",
    description: "Small crispy samosas with spiced potatoes",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 10,
    category: "snacks",
    portionSizes: [
      { name: "6 pcs", price: 299, weight: "150g", description: "Regular portion" },
      { name: "12 pcs", price: 499, weight: "300g", description: "Large portion" }
    ]
  },
  {
    id: "46",
    name: "Kachori (4 pcs)",
    description: "Crispy lentil-filled pastries with chutney",
    price: 249,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 8,
    category: "snacks",
    portionSizes: [
      { name: "4 pcs", price: 249, weight: "160g", description: "Regular portion" },
      { name: "8 pcs", price: 399, weight: "320g", description: "Large portion" }
    ]
  },

  // Indian Biryani & Rice
  {
    id: "47",
    name: "Veg Dum Biryani",
    description: "Aromatic vegetable biryani cooked in dum style",
    price: 549,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 25,
    category: "biryani-rice",
    portionSizes: [
      { name: "Half", price: 549, weight: "400g", description: "Serves 1-2" },
      { name: "Full", price: 899, weight: "800g", description: "Serves 3-4" }
    ]
  },
  {
    id: "48",
    name: "Chicken Dum Biryani",
    description: "Aromatic chicken biryani cooked in dum style",
    price: 649,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 30,
    category: "biryani-rice",
    portionSizes: [
      { name: "Half", price: 649, weight: "450g", description: "Serves 1-2" },
      { name: "Full", price: 999, weight: "900g", description: "Serves 3-4" }
    ]
  },
  {
    id: "49",
    name: "Egg Biryani",
    description: "Aromatic biryani with boiled eggs and spices",
    price: 599,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 25,
    category: "biryani-rice",
    portionSizes: [
      { name: "Half", price: 599, weight: "400g", description: "Serves 1-2" },
      { name: "Full", price: 899, weight: "800g", description: "Serves 3-4" }
    ]
  },
  {
    id: "50",
    name: "Hyderabadi Mutton Biryani",
    description: "Authentic Hyderabadi mutton biryani with aromatic spices",
    price: 849,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 35,
    category: "biryani-rice",
    portionSizes: [
      { name: "Half", price: 849, weight: "500g", description: "Serves 1-2" },
      { name: "Full", price: 1299, weight: "1000g", description: "Serves 3-4" }
    ]
  },
  {
    id: "51",
    name: "Veg Pulao",
    description: "Mild vegetable pulao with aromatic spices",
    price: 499,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 20,
    category: "biryani-rice",
    portionSizes: [
      { name: "Half", price: 499, weight: "350g", description: "Serves 1-2" },
      { name: "Full", price: 799, weight: "700g", description: "Serves 3-4" }
    ]
  },

  // Beverages
  {
    id: "52",
    name: "Masala Chai",
    description: "Traditional Indian spiced tea",
    price: 99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 5,
    category: "beverages",
    weights: [
      { name: "Regular", price: 99, weight: "200ml", description: "Standard cup" },
      { name: "Large", price: 149, weight: "300ml", description: "Big cup" }
    ]
  },
  {
    id: "53",
    name: "Cold Coffee",
    description: "Refreshing cold coffee with ice cream",
    price: 149,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 3,
    category: "beverages",
    weights: [
      { name: "Regular", price: 149, weight: "250ml", description: "Standard glass" },
      { name: "Large", price: 199, weight: "400ml", description: "Big glass" }
    ]
  },
  {
    id: "54",
    name: "Fresh Lime Soda",
    description: "Fresh lime with soda and spices",
    price: 119,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 2,
    category: "beverages",
    weights: [
      { name: "Regular", price: 119, weight: "250ml", description: "Standard glass" },
      { name: "Large", price: 169, weight: "400ml", description: "Big glass" }
    ]
  },
  {
    id: "55",
    name: "Mango Lassi",
    description: "Sweet mango yogurt drink",
    price: 179,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 3,
    category: "beverages",
    weights: [
      { name: "Regular", price: 179, weight: "300ml", description: "Standard glass" },
      { name: "Large", price: 249, weight: "450ml", description: "Big glass" }
    ]
  },
  {
    id: "56",
    name: "Salted Lassi",
    description: "Traditional salty yogurt drink",
    price: 149,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 3,
    category: "beverages",
    weights: [
      { name: "Regular", price: 149, weight: "300ml", description: "Standard glass" },
      { name: "Large", price: 199, weight: "450ml", description: "Big glass" }
    ]
  },
  {
    id: "57",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 199,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 2,
    category: "beverages",
    weights: [
      { name: "Regular", price: 199, weight: "250ml", description: "Standard glass" },
      { name: "Large", price: 299, weight: "400ml", description: "Big glass" }
    ]
  },
  {
    id: "58",
    name: "Mineral Water",
    description: "Chilled mineral water",
    price: 49,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 1,
    category: "beverages",
    weights: [
      { name: "500ml", price: 49, weight: "500ml", description: "Standard bottle" },
      { name: "1L", price: 79, weight: "1L", description: "Large bottle" }
    ]
  },

  // Desserts
  {
    id: "59",
    name: "Gulab Jamun (2 pcs)",
    description: "Soft milk dumplings in sugar syrup",
    price: 149,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "desserts",
    portionSizes: [
      { name: "2 pcs", price: 149, weight: "100g", description: "Regular portion" },
      { name: "4 pcs", price: 249, weight: "200g", description: "Large portion" }
    ]
  },
  {
    id: "60",
    name: "Rasgulla (2 pcs)",
    description: "Soft cottage cheese balls in sugar syrup",
    price: 129,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "desserts",
    portionSizes: [
      { name: "2 pcs", price: 129, weight: "120g", description: "Regular portion" },
      { name: "4 pcs", price: 229, weight: "240g", description: "Large portion" }
    ]
  },
  {
    id: "61",
    name: "Kaju Katli",
    description: "Traditional cashew sweet",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 2,
    category: "desserts",
    weights: [
      { name: "250g", price: 299, weight: "250g", description: "Standard pack" },
      { name: "500g", price: 549, weight: "500g", description: "Large pack" }
    ]
  },
  {
    id: "62",
    name: "Ice Cream Scoop",
    description: "Vanilla/Chocolate/Strawberry",
    price: 149,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 2,
    category: "desserts",
    weights: [
      { name: "1 Scoop", price: 149, weight: "100g", description: "Single scoop" },
      { name: "2 Scoops", price: 249, weight: "200g", description: "Double scoop" },
      { name: "3 Scoops", price: 349, weight: "300g", description: "Triple scoop" }
    ]
  },
  {
    id: "63",
    name: "Kulfi",
    description: "Traditional Indian ice cream",
    price: 199,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 3,
    category: "desserts",
    weights: [
      { name: "Regular", price: 199, weight: "100ml", description: "Single stick" },
      { name: "Large", price: 299, weight: "150ml", description: "Large stick" }
    ]
  },

  // Combos & Special Offers
  {
    id: "64",
    name: "Family Meal Deal",
    description: "2 Large Pizzas + 4 Starters + 4 Beverages",
    price: 1299,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 45,
    category: "combos"
  },
  {
    id: "65",
    name: "Couple Special",
    description: "1 Medium Pizza + 2 Starters + 2 Beverages",
    price: 899,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 30,
    category: "combos"
  },
  {
    id: "66",
    name: "Lunch Express",
    description: "1 Main Course + 1 Starter + 1 Beverage",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 20,
    category: "combos"
  },
  {
    id: "67",
    name: "Midnight Cravings",
    description: "1 Medium Pizza + 1 Dessert + 1 Beverage",
    price: 599,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 25,
    category: "combos"
  }
]

export default function Home() {
  const [cartItems, setCartItems] = useState<MenuItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  // State for selected sizes/portion/weights
  const [selectedSizes, setSelectedSizes] = useState<{[key: string]: any}>({})
  const [selectedPortions, setSelectedPortions] = useState<{[key: string]: any}>({})
  const [selectedWeights, setSelectedWeights] = useState<{[key: string]: any}>({})

  const categories = [
    { id: "all", name: "All Items" },
    { id: "indian-pizzas", name: "Indian Pizzas" },
    { id: "starters", name: "Starters" },
    { id: "burgers-wraps", name: "Burgers & Wraps" },
    { id: "main-course", name: "Main Course" },
    { id: "street-food", name: "Street Food" },
    { id: "snacks", name: "Snacks" },
    { id: "biryani-rice", name: "Biryani & Rice" },
    { id: "beverages", name: "Beverages" },
    { id: "desserts", name: "Desserts" },
    { id: "combos", name: "Combos & Special Offers" }
  ]

  const filteredItems = sampleMenuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (item: MenuItem) => {
    // Get selected options
    const selectedSize = selectedSizes[item.id]
    const selectedPortion = selectedPortions[item.id]
    const selectedWeight = selectedWeights[item.id]
    
    // Calculate final price based on selections
    let finalPrice = item.price
    let selectedOption = ""
    
    if (selectedSize) {
      finalPrice = selectedSize.price
      selectedOption = `${selectedSize.name} (${selectedSize.diameter || ''})`
    } else if (selectedPortion) {
      finalPrice = selectedPortion.price
      selectedOption = `${selectedPortion.name} (${selectedPortion.weight || ''})`
    } else if (selectedWeight) {
      finalPrice = selectedWeight.price
      selectedOption = `${selectedWeight.name} (${selectedWeight.weight})`
    }
    
    // Create cart item with selected options
    const cartItem = {
      ...item,
      price: finalPrice,
      selectedOption,
      selectedSize,
      selectedPortion,
      selectedWeight
    }
    
    setCartItems(prev => [...prev, cartItem])
  }

  const removeFromCart = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index))
  }

  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0)
  const formattedCartTotal = formatINRWithRs(cartTotal)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-orange-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">BoGoPizza</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-32 md:w-64"
                />
              </div>
              
              <AuthButton cartItemCount={cartItems.length} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">Welcome to BoGoPizza</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8">Authentic Indian Flavors & Fusion Pizzas made with traditional spices and love</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100 w-full sm:w-auto">
              Order Indian Food
            </Button>
            <Link href="/builder" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 w-full sm:w-auto">
                Build Your Pizza
              </Button>
            </Link>
          </div>
        </div>
      </section>

  

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Our Indian Menu</h3>
              
              {/* Mobile Category Selector */}
              <div className="sm:hidden mb-6">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Desktop Tabs */}
              <div className="hidden sm:block">
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
                    {categories.map(category => (
                      <TabsTrigger key={category.id} value={category.id} className="text-xs sm:text-sm">
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  <TabsContent value={selectedCategory} className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredItems.map(item => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gray-200 relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex gap-1">
                            {item.isVegetarian && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Leaf className="h-3 w-3 mr-1" />
                                Veg
                              </Badge>
                            )}
                            {item.isVegan && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Vegan
                              </Badge>
                            )}
                            {item.isSpicy && (
                              <Badge variant="secondary" className="bg-red-100 text-red-800">
                                🌶️ Spicy
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <CardHeader>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {item.preparationTime} min
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                              4.8
                            </div>
                          </div>
                          
                          {/* Size/Portion/Weight Selector */}
                          {item.sizes && (
                            <div className="mb-4">
                              <Label className="text-sm font-medium mb-2 block">Size:</Label>
                              <Select 
                                value={selectedSizes[item.id]?.name || ""} 
                                onValueChange={(value) => {
                                  const selected = item.sizes?.find(s => s.name === value)
                                  if (selected) {
                                    setSelectedSizes(prev => ({...prev, [item.id]: selected}))
                                    setSelectedPortions(prev => ({...prev, [item.id]: null}))
                                    setSelectedWeights(prev => ({...prev, [item.id]: null}))
                                  }
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                  {item.sizes.map((size) => (
                                    <SelectItem key={size.name} value={size.name}>
                                      {size.name} - {formatINRWithRs(size.price)} {size.diameter && `(${size.diameter})`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          
                          {item.portionSizes && (
                            <div className="mb-4">
                              <Label className="text-sm font-medium mb-2 block">Portion:</Label>
                              <Select 
                                value={selectedPortions[item.id]?.name || ""} 
                                onValueChange={(value) => {
                                  const selected = item.portionSizes?.find(p => p.name === value)
                                  if (selected) {
                                    setSelectedPortions(prev => ({...prev, [item.id]: selected}))
                                    setSelectedSizes(prev => ({...prev, [item.id]: null}))
                                    setSelectedWeights(prev => ({...prev, [item.id]: null}))
                                  }
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select portion" />
                                </SelectTrigger>
                                <SelectContent>
                                  {item.portionSizes.map((portion) => (
                                    <SelectItem key={portion.name} value={portion.name}>
                                      {portion.name} - {formatINRWithRs(portion.price)} {portion.weight && `(${portion.weight})`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          
                          {item.weights && (
                            <div className="mb-4">
                              <Label className="text-sm font-medium mb-2 block">Weight:</Label>
                              <Select 
                                value={selectedWeights[item.id]?.name || ""} 
                                onValueChange={(value) => {
                                  const selected = item.weights?.find(w => w.name === value)
                                  if (selected) {
                                    setSelectedWeights(prev => ({...prev, [item.id]: selected}))
                                    setSelectedSizes(prev => ({...prev, [item.id]: null}))
                                    setSelectedPortions(prev => ({...prev, [item.id]: null}))
                                  }
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select weight" />
                                </SelectTrigger>
                                <SelectContent>
                                  {item.weights.map((weight) => (
                                    <SelectItem key={weight.name} value={weight.name}>
                                      {weight.name} - {formatINRWithRs(weight.price)} ({weight.weight})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </CardContent>
                        
                        <CardFooter className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-orange-600">
                              {formatINRWithRs(
                                selectedSizes[item.id]?.price || 
                                selectedPortions[item.id]?.price || 
                                selectedWeights[item.id]?.price || 
                                item.price
                              )}
                            </span>
                            {(selectedSizes[item.id] || selectedPortions[item.id] || selectedWeights[item.id]) && (
                              <p className="text-sm text-gray-500 mt-1">
                                {selectedSizes[item.id]?.name || selectedPortions[item.id]?.name || selectedWeights[item.id]?.name}
                              </p>
                            )}
                          </div>
                          <Button onClick={() => addToCart(item)} className="bg-orange-600 hover:bg-orange-700">
                            Add to Cart
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              </div>
              
              {/* Mobile Content */}
              <div className="sm:hidden">
                <div className="grid grid-cols-1 gap-6">
                  {filteredItems.map(item => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gray-200 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          {item.isVegetarian && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <Leaf className="h-3 w-3 mr-1" />
                              Veg
                            </Badge>
                          )}
                          {item.isVegan && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Vegan
                            </Badge>
                          )}
                          {item.isSpicy && (
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              🌶️ Spicy
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {item.preparationTime} min
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                            4.8
                          </div>
                        </div>
                        
                        {/* Size/Portion/Weight Selector */}
                        {item.sizes && (
                          <div className="mb-4">
                            <Label className="text-sm font-medium mb-2 block">Size:</Label>
                            <Select 
                              value={selectedSizes[item.id]?.name || ""} 
                              onValueChange={(value) => {
                                const selected = item.sizes?.find(s => s.name === value)
                                if (selected) {
                                  setSelectedSizes(prev => ({...prev, [item.id]: selected}))
                                  setSelectedPortions(prev => ({...prev, [item.id]: null}))
                                  setSelectedWeights(prev => ({...prev, [item.id]: null}))
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                {item.sizes.map((size) => (
                                  <SelectItem key={size.name} value={size.name}>
                                    {size.name} - {formatINRWithRs(size.price)} {size.diameter && `(${size.diameter})`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        {item.portionSizes && (
                          <div className="mb-4">
                            <Label className="text-sm font-medium mb-2 block">Portion:</Label>
                            <Select 
                              value={selectedPortions[item.id]?.name || ""} 
                              onValueChange={(value) => {
                                const selected = item.portionSizes?.find(p => p.name === value)
                                if (selected) {
                                  setSelectedPortions(prev => ({...prev, [item.id]: selected}))
                                  setSelectedSizes(prev => ({...prev, [item.id]: null}))
                                  setSelectedWeights(prev => ({...prev, [item.id]: null}))
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select portion" />
                              </SelectTrigger>
                              <SelectContent>
                                {item.portionSizes.map((portion) => (
                                  <SelectItem key={portion.name} value={portion.name}>
                                    {portion.name} - {formatINRWithRs(portion.price)} {portion.weight && `(${portion.weight})`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        {item.weights && (
                          <div className="mb-4">
                            <Label className="text-sm font-medium mb-2 block">Weight:</Label>
                            <Select 
                              value={selectedWeights[item.id]?.name || ""} 
                              onValueChange={(value) => {
                                const selected = item.weights?.find(w => w.name === value)
                                if (selected) {
                                  setSelectedWeights(prev => ({...prev, [item.id]: selected}))
                                  setSelectedSizes(prev => ({...prev, [item.id]: null}))
                                  setSelectedPortions(prev => ({...prev, [item.id]: null}))
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select weight" />
                              </SelectTrigger>
                              <SelectContent>
                                {item.weights.map((weight) => (
                                  <SelectItem key={weight.name} value={weight.name}>
                                    {weight.name} - {formatINRWithRs(weight.price)} ({weight.weight})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-orange-600">
                            {formatINRWithRs(
                              selectedSizes[item.id]?.price || 
                              selectedPortions[item.id]?.price || 
                              selectedWeights[item.id]?.price || 
                              item.price
                            )}
                          </span>
                          {(selectedSizes[item.id] || selectedPortions[item.id] || selectedWeights[item.id]) && (
                            <p className="text-sm text-gray-500 mt-1">
                              {selectedSizes[item.id]?.name || selectedPortions[item.id]?.name || selectedWeights[item.id]?.name}
                            </p>
                          )}
                        </div>
                        <Button onClick={() => addToCart(item)} className="bg-orange-600 hover:bg-orange-700">
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Your Cart
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-gray-500 text-xs">{formatINRWithRs(item.price)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-orange-600">{formattedCartTotal}</span>
                      </div>
                      
                      <Link href="/checkout">
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          Proceed to Checkout
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}