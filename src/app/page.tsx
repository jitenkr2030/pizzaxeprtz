"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthButton } from "@/components/auth-button"
import { Search, Star, Clock, Leaf, ChefHat, ShoppingCart, Brain, Zap } from "lucide-react"
import Link from "next/link"

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
}

const sampleMenuItems: MenuItem[] = [
  // Indian Flavour Pizzas
  {
    id: "1",
    name: "Paneer Tikka Pizza",
    description: "Marinated paneer tikka with onions, capsicum, and Indian spices on pizza base",
    price: 16.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 20,
    category: "indian-pizzas"
  },
  {
    id: "2",
    name: "Tandoori Chicken Pizza",
    description: "Tandoori chicken pieces with mint chutney and cheese",
    price: 18.99,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 22,
    category: "indian-pizzas"
  },
  {
    id: "3",
    name: "Butter Chicken Pizza",
    description: "Creamy butter chicken sauce with mozzarella cheese",
    price: 19.99,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 25,
    category: "indian-pizzas"
  },
  {
    id: "4",
    name: "Achari Paneer Pizza",
    description: "Paneer with pickling spices and tangy achari flavor",
    price: 17.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 20,
    category: "indian-pizzas"
  },
  {
    id: "5",
    name: "Masala Corn Pizza",
    description: "Sweet corn with Indian masala spices and cheese",
    price: 15.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 18,
    category: "indian-pizzas"
  },
  {
    id: "6",
    name: "Keema Masala Pizza",
    description: "Minced meat with aromatic Indian spices",
    price: 20.99,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 25,
    category: "indian-pizzas"
  },
  {
    id: "7",
    name: "Amritsari Fish Pizza",
    description: "Premium Amritsari fish with Indian herbs and spices",
    price: 24.99,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 28,
    category: "indian-pizzas"
  },

  // Indian Starters & Sides
  {
    id: "8",
    name: "Veg Samosa (2 pcs)",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 6.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 10,
    category: "starters"
  },
  {
    id: "9",
    name: "Paneer Pakora",
    description: "Crispy fried paneer with gram flour batter",
    price: 8.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 12,
    category: "starters"
  },
  {
    id: "10",
    name: "Chicken Pakora",
    description: "Tender chicken pieces fried in spiced gram flour",
    price: 9.99,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "starters"
  },
  {
    id: "11",
    name: "Fish Fingers",
    description: "Crispy fish fingers with tartar sauce",
    price: 12.99,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 12,
    category: "starters"
  },
  {
    id: "12",
    name: "Onion Rings with Masala Dip",
    description: "Crispy onion rings with special masala dip",
    price: 7.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 8,
    category: "starters"
  },
  {
    id: "13",
    name: "Garlic Naan Sticks",
    description: "Soft naan sticks with garlic butter and cheese dip",
    price: 8.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 10,
    category: "starters"
  },
  {
    id: "14",
    name: "Hara Bhara Kabab",
    description: "Spinach and green peas kababs with mint chutney",
    price: 9.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 15,
    category: "starters"
  },
  {
    id: "15",
    name: "Veg Cutlet",
    description: "Mixed vegetable cutlets with spicy ketchup",
    price: 7.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 12,
    category: "starters"
  },

  // Indian Burgers / Wraps
  {
    id: "16",
    name: "Aloo Tikki Burger",
    description: "Spiced potato patty with Indian spices in burger bun",
    price: 9.99,
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
    price: 12.99,
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
    price: 13.99,
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
    price: 11.99,
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
    price: 12.99,
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
    price: 8.99,
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
    price: 18.99,
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
    price: 16.99,
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
    price: 17.99,
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
    price: 14.99,
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
    price: 14.99,
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
    price: 19.99,
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
    price: 15.99,
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
    price: 20.99,
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
    price: 12.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "street-food"
  },
  {
    id: "31",
    name: "Vada Pav",
    description: "Spiced potato fritter in bun with chutneys",
    price: 8.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 10,
    category: "street-food"
  },
  {
    id: "32",
    name: "Misal Pav",
    description: "Spicy sprouted curry with pav bread",
    price: 11.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "street-food"
  },
  {
    id: "33",
    name: "Bhel Puri",
    description: "Puffed rice with vegetables, chutneys, and sev",
    price: 7.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 5,
    category: "street-food"
  },
  {
    id: "34",
    name: "Dahi Puri",
    description: "Crispy puris filled with yogurt and chutneys",
    price: 8.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 8,
    category: "street-food"
  },
  {
    id: "35",
    name: "Sev Puri",
    description: "Crispy puris with potatoes, chutneys, and sev",
    price: 7.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 5,
    category: "street-food"
  },
  {
    id: "36",
    name: "Pani Puri (6 pcs)",
    description: "Hollow puris with spicy water and fillings",
    price: 6.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 8,
    category: "street-food"
  },
  {
    id: "37",
    name: "Aloo Tikki Chaat",
    description: "Spiced potato patties with chutneys and yogurt",
    price: 8.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 10,
    category: "street-food"
  },

  // Indian Snacks & Finger Food
  {
    id: "38",
    name: "Veg Momos (6 pcs)",
    description: "Steamed vegetable dumplings with spicy chutney",
    price: 9.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 12,
    category: "snacks"
  },
  {
    id: "39",
    name: "Chicken Momos (6 pcs)",
    description: "Steamed chicken dumplings with spicy chutney",
    price: 11.99,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 12,
    category: "snacks"
  },
  {
    id: "40",
    name: "Tandoori Veg Momos (6 pcs)",
    description: "Tandoori roasted vegetable momos with mint chutney",
    price: 11.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 15,
    category: "snacks"
  },
  {
    id: "41",
    name: "Paneer Malai Tikka",
    description: "Creamy paneer tikka with aromatic spices",
    price: 13.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 18,
    category: "snacks"
  },
  {
    id: "42",
    name: "Chicken Malai Tikka",
    description: "Creamy chicken tikka with aromatic spices",
    price: 15.99,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 18,
    category: "snacks"
  },
  {
    id: "43",
    name: "Veg Seekh Kabab",
    description: "Mixed vegetable seekh kababs with mint chutney",
    price: 10.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 15,
    category: "snacks"
  },
  {
    id: "44",
    name: "Chicken Seekh Kabab",
    description: "Minced chicken seekh kababs with mint chutney",
    price: 12.99,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "snacks"
  },
  {
    id: "45",
    name: "Mini Samosa (6 pcs)",
    description: "Small crispy samosas with spiced potatoes",
    price: 8.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 10,
    category: "snacks"
  },
  {
    id: "46",
    name: "Kachori (4 pcs)",
    description: "Crispy lentil-filled pastries with chutney",
    price: 7.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 8,
    category: "snacks"
  },

  // Indian Biryani & Rice
  {
    id: "47",
    name: "Veg Dum Biryani",
    description: "Aromatic vegetable biryani cooked in dum style",
    price: 16.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 25,
    category: "biryani-rice"
  },
  {
    id: "48",
    name: "Chicken Dum Biryani",
    description: "Aromatic chicken biryani cooked in dum style",
    price: 19.99,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 30,
    category: "biryani-rice"
  },
  {
    id: "49",
    name: "Egg Biryani",
    description: "Aromatic biryani with boiled eggs and spices",
    price: 17.99,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 25,
    category: "biryani-rice"
  },
  {
    id: "50",
    name: "Hyderabadi Mutton Biryani",
    description: "Authentic Hyderabadi mutton biryani with aromatic spices",
    price: 24.99,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 35,
    category: "biryani-rice"
  },
  {
    id: "51",
    name: "Veg Pulao",
    description: "Mild vegetable pulao with aromatic spices",
    price: 14.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 20,
    category: "biryani-rice"
  },
  {
    id: "52",
    name: "Lemon Rice",
    description: "Tangy lemon rice with peanuts and curry leaves",
    price: 12.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 15,
    category: "biryani-rice"
  },

  // Indian Salads & Raita
  {
    id: "53",
    name: "Kachumber Salad",
    description: "Fresh chopped cucumber, tomato, onion with lemon dressing",
    price: 6.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 5,
    category: "salads-raita"
  },
  {
    id: "54",
    name: "Sprouts Chaat",
    description: "Mixed sprouts with onions, tomatoes, and spices",
    price: 7.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 8,
    category: "salads-raita"
  },
  {
    id: "55",
    name: "Boondi Raita",
    description: "Yogurt with crispy boondi and spices",
    price: 5.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "salads-raita"
  },
  {
    id: "56",
    name: "Pineapple Raita",
    description: "Sweet and tangy pineapple raita with spices",
    price: 6.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "salads-raita"
  },
  {
    id: "57",
    name: "Cucumber Mint Raita",
    description: "Cool cucumber and mint raita perfect for spicy dishes",
    price: 5.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "salads-raita"
  },

  // Indian Desserts
  {
    id: "58",
    name: "Gulab Jamun (2 pcs)",
    description: "Soft milk dumplings soaked in sugar syrup",
    price: 6.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "desserts"
  },
  {
    id: "59",
    name: "Stuffed Gulab Jamun (2 pcs)",
    description: "Gulab jamun stuffed with nuts and saffron",
    price: 8.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "desserts"
  },
  {
    id: "60",
    name: "Jalebi with Rabri",
    description: "Crispy jalebi served with thick rabri",
    price: 8.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 8,
    category: "desserts"
  },
  {
    id: "61",
    name: "Rasgulla (2 pcs)",
    description: "Soft spongy cottage cheese balls in sugar syrup",
    price: 6.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "desserts"
  },
  {
    id: "62",
    name: "Rasmalai (2 pcs)",
    description: "Cottage cheese dumplings in thickened milk",
    price: 7.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "desserts"
  },
  {
    id: "63",
    name: "Gajar ka Halwa",
    description: "Warm carrot pudding with nuts and ghee",
    price: 7.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 8,
    category: "desserts"
  },
  {
    id: "64",
    name: "Phirni",
    description: "Rice pudding with almonds and cardamom",
    price: 6.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "desserts"
  },
  {
    id: "65",
    name: "Malai Kulfi",
    description: "Traditional Indian ice cream with malai flavor",
    price: 6.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "desserts"
  },
  {
    id: "66",
    name: "Pista Kulfi",
    description: "Traditional Indian ice cream with pistachio flavor",
    price: 7.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "desserts"
  },
  {
    id: "67",
    name: "Mango Kulfi",
    description: "Traditional Indian ice cream with mango flavor",
    price: 7.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "desserts"
  },
  {
    id: "68",
    name: "Chocolate Samosa (2 pcs)",
    description: "Fusion dessert with chocolate-filled samosas",
    price: 8.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 8,
    category: "desserts"
  },

  // Indian Beverages
  {
    id: "69",
    name: "Masala Chai",
    description: "Traditional Indian tea with aromatic spices",
    price: 3.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 5,
    category: "beverages"
  },
  {
    id: "70",
    name: "Elaichi Chai",
    description: "Cardamom-flavored Indian tea",
    price: 3.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 5,
    category: "beverages"
  },
  {
    id: "71",
    name: "Cold Coffee Desi Style",
    description: "Indian-style cold coffee with spices",
    price: 5.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "beverages"
  },
  {
    id: "72",
    name: "Sweet Lassi",
    description: "Sweet yogurt drink with cardamom",
    price: 4.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 3,
    category: "beverages"
  },
  {
    id: "73",
    name: "Salted Lassi",
    description: "Salty yogurt drink with roasted cumin",
    price: 4.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 3,
    category: "beverages"
  },
  {
    id: "74",
    name: "Mango Lassi",
    description: "Mango-flavored sweet yogurt drink",
    price: 5.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 3,
    category: "beverages"
  },
  {
    id: "75",
    name: "Buttermilk (Chaas)",
    description: "Spiced buttermilk with herbs and spices",
    price: 3.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 3,
    category: "beverages"
  },
  {
    id: "76",
    name: "Fresh Lime Soda (Sweet)",
    description: "Refreshing lime soda with sweet syrup",
    price: 4.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 3,
    category: "beverages"
  },
  {
    id: "77",
    name: "Fresh Lime Soda (Salty)",
    description: "Refreshing lime soda with salt and spices",
    price: 4.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 3,
    category: "beverages"
  },
  {
    id: "78",
    name: "Badam Milk (Hot)",
    description: "Hot almond milk with saffron and cardamom",
    price: 5.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 8,
    category: "beverages"
  },
  {
    id: "79",
    name: "Badam Milk (Cold)",
    description: "Cold almond milk with saffron and cardamom",
    price: 5.99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "beverages"
  }
]

export default function Home() {
  const [cartItems, setCartItems] = useState<MenuItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Items" },
    { id: "indian-pizzas", name: "Indian Pizzas" },
    { id: "starters", name: "Starters" },
    { id: "burgers-wraps", name: "Burgers & Wraps" },
    { id: "main-course", name: "Main Course" },
    { id: "street-food", name: "Street Food" },
    { id: "snacks", name: "Snacks" },
    { id: "biryani-rice", name: "Biryani & Rice" },
    { id: "salads-raita", name: "Salads & Raita" },
    { id: "desserts", name: "Desserts" },
    { id: "beverages", name: "Beverages" }
  ]

  const filteredItems = sampleMenuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => [...prev, item])
  }

  const removeFromCart = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index))
  }

  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-orange-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">PizzaXpertz</h1>
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
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">Welcome to PizzaXpertz</h2>
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

      {/* Automation Showcase */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powered by Advanced Automation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the future of food delivery with our cutting-edge automation technology that ensures 
              seamless service, personalized experiences, and operational excellence 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">AI-powered menu scheduling and order timing optimization</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Intelligent Analytics</h3>
              <p className="text-gray-600">Predictive insights and business intelligence</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Automation</h3>
              <p className="text-gray-600">End-to-end automated operations and customer service</p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/automation-demo">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Explore Automation Demo
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
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {item.preparationTime} min
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                              4.8
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-orange-600">${item.price.toFixed(2)}</span>
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
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {item.preparationTime} min
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                            4.8
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-orange-600">${item.price.toFixed(2)}</span>
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
                          <p className="text-gray-500 text-xs">${item.price.toFixed(2)}</p>
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
                        <span className="text-2xl font-bold text-orange-600">${cartTotal.toFixed(2)}</span>
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