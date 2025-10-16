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
import { ChefHat, Plus, Minus, AlertTriangle, Package, TrendingUp, RefreshCw } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  costPerUnit: number
  supplier: string
  lastRestocked: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

const sampleInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Mozzarella Cheese",
    category: "Dairy",
    currentStock: 25,
    minStock: 10,
    maxStock: 50,
    unit: "kg",
    costPerUnit: 8.50,
    supplier: "Dairy Farms Inc.",
    lastRestocked: "2024-01-15",
    status: "in-stock"
  },
  {
    id: "2",
    name: "Pizza Dough",
    category: "Base",
    currentStock: 8,
    minStock: 15,
    maxStock: 30,
    unit: "balls",
    costPerUnit: 1.20,
    supplier: "Flour Masters",
    lastRestocked: "2024-01-14",
    status: "low-stock"
  },
  {
    id: "3",
    name: "Tomato Sauce",
    category: "Sauce",
    currentStock: 45,
    minStock: 20,
    maxStock: 60,
    unit: "liters",
    costPerUnit: 3.75,
    supplier: "Italian Imports",
    lastRestocked: "2024-01-16",
    status: "in-stock"
  },
  {
    id: "4",
    name: "Pepperoni",
    category: "Meat",
    currentStock: 0,
    minStock: 5,
    maxStock: 20,
    unit: "kg",
    costPerUnit: 12.00,
    supplier: "Meat Suppliers Co.",
    lastRestocked: "2024-01-10",
    status: "out-of-stock"
  },
  {
    id: "5",
    name: "Bell Peppers",
    category: "Vegetables",
    currentStock: 12,
    minStock: 8,
    maxStock: 25,
    unit: "kg",
    costPerUnit: 4.25,
    supplier: "Fresh Produce Ltd.",
    lastRestocked: "2024-01-15",
    status: "in-stock"
  },
  {
    id: "6",
    name: "Mushrooms",
    category: "Vegetables",
    currentStock: 6,
    minStock: 10,
    maxStock: 20,
    unit: "kg",
    costPerUnit: 6.50,
    supplier: "Fresh Produce Ltd.",
    lastRestocked: "2024-01-13",
    status: "low-stock"
  }
]

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: "",
    costPerUnit: 0,
    supplier: ""
  })

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "Dairy", name: "Dairy" },
    { id: "Base", name: "Base" },
    { id: "Sauce", name: "Sauce" },
    { id: "Meat", name: "Meat" },
    { id: "Vegetables", name: "Vegetables" },
    { id: "Packaging", name: "Packaging" }
  ]

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const updateStock = (id: string, amount: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.currentStock + amount)
        let newStatus: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock'
        
        if (newStock === 0) {
          newStatus = 'out-of-stock'
        } else if (newStock <= item.minStock) {
          newStatus = 'low-stock'
        }
        
        return {
          ...item,
          currentStock: newStock,
          status: newStatus
        }
      }
      return item
    }))
  }

  const addNewItem = () => {
    const inventoryItem: InventoryItem = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category,
      currentStock: newItem.currentStock,
      minStock: newItem.minStock,
      maxStock: newItem.maxStock,
      unit: newItem.unit,
      costPerUnit: newItem.costPerUnit,
      supplier: newItem.supplier,
      lastRestocked: new Date().toISOString().split('T')[0],
      status: newItem.currentStock === 0 ? 'out-of-stock' : 
              newItem.currentStock <= newItem.minStock ? 'low-stock' : 'in-stock'
    }
    
    setInventory(prev => [...prev, inventoryItem])
    setNewItem({
      name: "",
      category: "",
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unit: "",
      costPerUnit: 0,
      supplier: ""
    })
    setIsAddDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800'
      case 'low-stock': return 'bg-yellow-100 text-yellow-800'
      case 'out-of-stock': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLowStockItems = () => inventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock')
  const getTotalValue = () => inventory.reduce((total, item) => total + (item.currentStock * item.costPerUnit), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Pizzaxperts Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Inventory Management</span>
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
                <Package className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{getLowStockItems().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">${getTotalValue().toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <RefreshCw className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
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

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
                <DialogDescription>
                  Create a new inventory item to track stock levels.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="currentStock" className="text-right">
                    Current Stock
                  </Label>
                  <Input
                    id="currentStock"
                    type="number"
                    value={newItem.currentStock}
                    onChange={(e) => setNewItem(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="minStock" className="text-right">
                    Min Stock
                  </Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={newItem.minStock}
                    onChange={(e) => setNewItem(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maxStock" className="text-right">
                    Max Stock
                  </Label>
                  <Input
                    id="maxStock"
                    type="number"
                    value={newItem.maxStock}
                    onChange={(e) => setNewItem(prev => ({ ...prev, maxStock: parseInt(e.target.value) || 0 }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit" className="text-right">
                    Unit
                  </Label>
                  <Input
                    id="unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                    className="col-span-3"
                    placeholder="kg, liters, pieces"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="costPerUnit" className="text-right">
                    Cost/Unit
                  </Label>
                  <Input
                    id="costPerUnit"
                    type="number"
                    step="0.01"
                    value={newItem.costPerUnit}
                    onChange={(e) => setNewItem(prev => ({ ...prev, costPerUnit: parseFloat(e.target.value) || 0 }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">
                    Supplier
                  </Label>
                  <Input
                    id="supplier"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem(prev => ({ ...prev, supplier: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addNewItem} className="bg-red-600 hover:bg-red-700">
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Low Stock Alerts */}
        {getLowStockItems().length > 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getLowStockItems().slice(0, 6).map(item => (
                  <div key={item.id} className="p-3 bg-white rounded-lg border border-yellow-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">{item.supplier}</p>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status === 'low-stock' ? 'Low' : 'Out'}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Current: {item.currentStock} {item.unit} | Min: {item.minStock} {item.unit}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
            <CardDescription>
              Manage your restaurant's inventory stock levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Item</th>
                    <th className="text-left p-3 font-medium">Category</th>
                    <th className="text-left p-3 font-medium">Stock Level</th>
                    <th className="text-left p-3 font-medium">Min/Max</th>
                    <th className="text-left p-3 font-medium">Unit Value</th>
                    <th className="text-left p-3 font-medium">Total Value</th>
                    <th className="text-left p-3 font-medium">Supplier</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">Last restocked: {item.lastRestocked}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{item.category}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status === 'in-stock' ? 'In Stock' : 
                             item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                          </Badge>
                          <span className="font-medium">{item.currentStock} {item.unit}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-xs">
                          <div>Min: {item.minStock} {item.unit}</div>
                          <div>Max: {item.maxStock} {item.unit}</div>
                        </div>
                      </td>
                      <td className="p-3">${item.costPerUnit.toFixed(2)}</td>
                      <td className="p-3 font-medium">${(item.currentStock * item.costPerUnit).toFixed(2)}</td>
                      <td className="p-3 text-sm">{item.supplier}</td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStock(item.id, 1)}
                            disabled={item.currentStock >= item.maxStock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStock(item.id, -1)}
                            disabled={item.currentStock <= 0}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}