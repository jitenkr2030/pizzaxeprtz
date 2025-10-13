"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  ChefHat,
  Leaf,
  Star,
  Clock,
  Image as ImageIcon,
  Save,
  X,
  Upload
} from "lucide-react"
import Link from "next/link"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  isActive: boolean
  isVegetarian: boolean
  isVegan: boolean
  isSpicy: boolean
  preparationTime: number
  categoryId: string
  category: {
    id: string
    name: string
  }
  customizations?: Array<{
    id: string
    name: string
    type: string
    priceAdjustment: number
    isAvailable: boolean
  }>
}

interface Category {
  id: string
  name: string
  description?: string
  isActive: boolean
  displayOrder: number
}

const sampleCategories: Category[] = [
  { id: "1", name: "Pizzas", description: "Our signature pizzas", isActive: true, displayOrder: 1 },
  { id: "2", name: "Sides", description: "Delicious sides", isActive: true, displayOrder: 2 },
  { id: "3", name: "Drinks", description: "Refreshing beverages", isActive: true, displayOrder: 3 },
  { id: "4", name: "Desserts", description: "Sweet treats", isActive: true, displayOrder: 4 },
]

const sampleMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Margherita Classic",
    description: "Fresh mozzarella, tomato sauce, basil leaves",
    price: 12.99,
    image: "/api/placeholder/300/200",
    isActive: true,
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 15,
    categoryId: "1",
    category: { id: "1", name: "Pizzas" },
    customizations: [
      { id: "1", name: "Large Size", type: "size", priceAdjustment: 3.00, isAvailable: true },
      { id: "2", name: "Extra Cheese", type: "extra", priceAdjustment: 2.00, isAvailable: true },
    ]
  },
  {
    id: "2",
    name: "Pepperoni Feast",
    description: "Double pepperoni, mozzarella cheese, tomato sauce",
    price: 15.99,
    image: "/api/placeholder/300/200",
    isActive: true,
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 18,
    categoryId: "1",
    category: { id: "1", name: "Pizzas" },
    customizations: [
      { id: "3", name: "Extra Pepperoni", type: "topping", priceAdjustment: 3.00, isAvailable: true },
    ]
  },
  {
    id: "3",
    name: "Garlic Bread",
    description: "Fresh baked bread with garlic butter and herbs",
    price: 6.99,
    image: "/api/placeholder/300/200",
    isActive: true,
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 8,
    categoryId: "2",
    category: { id: "2", name: "Sides" },
  }
]

export default function AdminMenuPage() {
  const { data: session } = useSession()
  const [menuItems, setMenuItems] = useState<MenuItem[]>(sampleMenuItems)
  const [categories, setCategories] = useState<Category[]>(sampleCategories)
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(sampleMenuItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeFilter, setActiveFilter] = useState("all")
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Form states
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: 0,
    isActive: true,
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 15,
    categoryId: "",
  })

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    isActive: true,
    displayOrder: 0,
  })

  useEffect(() => {
    let filtered = menuItems

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.categoryId === categoryFilter)
    }

    // Apply active filter
    if (activeFilter === "active") {
      filtered = filtered.filter(item => item.isActive)
    } else if (activeFilter === "inactive") {
      filtered = filtered.filter(item => !item.isActive)
    }

    setFilteredItems(filtered)
  }, [menuItems, searchTerm, categoryFilter, activeFilter])

  const handleAddItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      ...itemForm,
      category: categories.find(c => c.id === itemForm.categoryId)!,
    }
    setMenuItems(prev => [...prev, newItem])
    setItemForm({
      name: "",
      description: "",
      price: 0,
      isActive: true,
      isVegetarian: false,
      isVegan: false,
      isSpicy: false,
      preparationTime: 15,
      categoryId: "",
    })
    setIsAddItemOpen(false)
  }

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item)
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price,
      isActive: item.isActive,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isSpicy: item.isSpicy,
      preparationTime: item.preparationTime,
      categoryId: item.categoryId,
    })
  }

  const handleUpdateItem = () => {
    if (!editingItem) return
    
    setMenuItems(prev => prev.map(item => 
      item.id === editingItem.id 
        ? { 
            ...item, 
            ...itemForm,
            category: categories.find(c => c.id === itemForm.categoryId)!
          } 
        : item
    ))
    setEditingItem(null)
    setItemForm({
      name: "",
      description: "",
      price: 0,
      isActive: true,
      isVegetarian: false,
      isVegan: false,
      isSpicy: false,
      preparationTime: 15,
      categoryId: "",
    })
  }

  const handleDeleteItem = (itemId: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      setMenuItems(prev => prev.filter(item => item.id !== itemId))
    }
  }

  const handleToggleItemStatus = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isActive: !item.isActive } : item
    ))
  }

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      ...categoryForm,
    }
    setCategories(prev => [...prev, newCategory])
    setCategoryForm({
      name: "",
      description: "",
      isActive: true,
      displayOrder: categories.length + 1,
    })
    setIsAddCategoryOpen(false)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
      displayOrder: category.displayOrder,
    })
  }

  const handleUpdateCategory = () => {
    if (!editingCategory) return
    
    setCategories(prev => prev.map(cat => 
      cat.id === editingCategory.id ? { ...cat, ...categoryForm } : cat
    ))
    setEditingCategory(null)
    setCategoryForm({
      name: "",
      description: "",
      isActive: true,
      displayOrder: 0,
    })
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? Items in this category will be uncategorized.")) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
      setMenuItems(prev => prev.map(item => 
        item.categoryId === categoryId ? { ...item, categoryId: "", category: { id: "", name: "Uncategorized" } } : item
      ))
    }
  }

  if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "MANAGER")) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold text-gray-900 ml-4">Menu Management</h1>
          </div>
          
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>
                  Create a new menu item for your restaurant.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={itemForm.name}
                      onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={itemForm.price}
                      onChange={(e) => setItemForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={itemForm.description}
                    onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={itemForm.categoryId} onValueChange={(value) => setItemForm(prev => ({ ...prev, categoryId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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
                  <div>
                    <Label htmlFor="preparationTime">Preparation Time (minutes)</Label>
                    <Input
                      id="preparationTime"
                      type="number"
                      value={itemForm.preparationTime}
                      onChange={(e) => setItemForm(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 15 }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={itemForm.isActive}
                      onCheckedChange={(checked) => setItemForm(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isVegetarian"
                      checked={itemForm.isVegetarian}
                      onCheckedChange={(checked) => setItemForm(prev => ({ ...prev, isVegetarian: checked }))}
                    />
                    <Label htmlFor="isVegetarian">Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isVegan"
                      checked={itemForm.isVegan}
                      onCheckedChange={(checked) => setItemForm(prev => ({ ...prev, isVegan: checked }))}
                    />
                    <Label htmlFor="isVegan">Vegan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isSpicy"
                      checked={itemForm.isSpicy}
                      onCheckedChange={(checked) => setItemForm(prev => ({ ...prev, isSpicy: checked }))}
                    />
                    <Label htmlFor="isSpicy">Spicy</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem}>
                  <Save className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="items" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="items">Menu Items</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="mt-6">
              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={activeFilter} onValueChange={setActiveFilter}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-200 relative">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Badge variant={item.isActive ? "default" : "secondary"}>
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {item.isVegetarian && (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            <Leaf className="h-3 w-3 mr-1" />
                            Veg
                          </Badge>
                        )}
                        {item.isSpicy && (
                          <Badge variant="outline" className="bg-red-100 text-red-800">
                            🌶️
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
                          <span className="text-lg font-bold text-red-600">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{item.category.name}</Badge>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleItemStatus(item.id)}
                          >
                            {item.isActive ? "Hide" : "Show"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No menu items found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your filters or add a new menu item.</p>
                    <Button onClick={() => setIsAddItemOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Menu Item
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="categories" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Categories</h2>
                <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                      <DialogDescription>
                        Create a new category for organizing your menu items.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="categoryName">Name *</Label>
                        <Input
                          id="categoryName"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoryDescription">Description</Label>
                        <Textarea
                          id="categoryDescription"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="categoryActive"
                          checked={categoryForm.isActive}
                          onCheckedChange={(checked) => setCategoryForm(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="categoryActive">Active</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddCategory}>
                        <Save className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(category => (
                  <Card key={category.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{category.name}</CardTitle>
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {category.description && (
                        <CardDescription>{category.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {menuItems.filter(item => item.categoryId === category.id).length} items
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the menu item information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editName">Name *</Label>
                <Input
                  id="editName"
                  value={itemForm.name}
                  onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="editPrice">Price *</Label>
                <Input
                  id="editPrice"
                  type="number"
                  step="0.01"
                  value={itemForm.price}
                  onChange={(e) => setItemForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={itemForm.description}
                onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editCategory">Category *</Label>
                <Select value={itemForm.categoryId} onValueChange={(value) => setItemForm(prev => ({ ...prev, categoryId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
              <div>
                <Label htmlFor="editPreparationTime">Preparation Time (minutes)</Label>
                <Input
                  id="editPreparationTime"
                  type="number"
                  value={itemForm.preparationTime}
                  onChange={(e) => setItemForm(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 15 }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="editIsActive"
                  checked={itemForm.isActive}
                  onCheckedChange={(checked) => setItemForm(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="editIsActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="editIsVegetarian"
                  checked={itemForm.isVegetarian}
                  onCheckedChange={(checked) => setItemForm(prev => ({ ...prev, isVegetarian: checked }))}
                />
                <Label htmlFor="editIsVegetarian">Vegetarian</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="editIsVegan"
                  checked={itemForm.isVegan}
                  onCheckedChange={(checked) => setItemForm(prev => ({ ...prev, isVegan: checked }))}
                />
                <Label htmlFor="editIsVegan">Vegan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="editIsSpicy"
                  checked={itemForm.isSpicy}
                  onCheckedChange={(checked) => setItemForm(prev => ({ ...prev, isSpicy: checked }))}
                />
                <Label htmlFor="editIsSpicy">Spicy</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateItem}>
              <Save className="h-4 w-4 mr-2" />
              Update Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="editCategoryName">Name *</Label>
              <Input
                id="editCategoryName"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="editCategoryDescription">Description</Label>
              <Textarea
                id="editCategoryDescription"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="editCategoryActive"
                checked={categoryForm.isActive}
                onCheckedChange={(checked) => setCategoryForm(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="editCategoryActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}>
              <Save className="h-4 w-4 mr-2" />
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}