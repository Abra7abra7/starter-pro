"use client"

import { useState, useEffect } from 'react'
import { Search, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'

// Initialize Supabase client
const supabase = createClient()

interface Product {
  id: string
  name: string
  price: string
  sku: string | null
}

interface Warehouse {
  id: string
  name: string
  location: string
}

interface InventoryItem {
  id: string
  product_id: string
  warehouse_id: string
  quantity: number
  min_stock_level: number
  max_stock_level: number
  product: Product
  warehouse: Warehouse
}

interface StockMovementFormData {
  product_id: string
  warehouse_id: string
  quantity: number
  type: 'in' | 'out'
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false)
  const [movementFormData, setMovementFormData] = useState<StockMovementFormData>({
    product_id: '',
    warehouse_id: '',
    quantity: 0,
    type: 'in'
  })

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('inventory_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory'
        },
        () => {
          fetchInventory() // Refresh data when changes occur
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchInventory()
    fetchProducts()
    fetchWarehouses()
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const { data: inventory, error: supabaseError } = await supabase
        .from('inventory')
        .select(`
          *,
          product:products(*),
          warehouse:warehouses(*)
        `)
        .order('product_id')

      if (supabaseError) throw supabaseError

      setInventory(inventory)
    } catch (error) {
      console.error('Error fetching inventory:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching inventory')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const { data: products, error: supabaseError } = await supabase
        .from('products')
        .select('id, name, price, sku')
        .order('name')

      if (supabaseError) throw supabaseError

      setProducts(products)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching products')
    }
  }

  const fetchWarehouses = async () => {
    try {
      const { data: warehouses, error: supabaseError } = await supabase
        .from('warehouses')
        .select('*')
        .order('name')

      if (supabaseError) throw supabaseError

      setWarehouses(warehouses)
    } catch (error) {
      console.error('Error fetching warehouses:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching warehouses')
    }
  }

  const handleStockMovement = async () => {
    try {
      // Find existing inventory record
      const existingInventory = inventory.find(
        item => item.product_id === movementFormData.product_id && 
                item.warehouse_id === movementFormData.warehouse_id
      )

      const newQuantity = existingInventory
        ? existingInventory.quantity + (movementFormData.type === 'in' ? movementFormData.quantity : -movementFormData.quantity)
        : movementFormData.quantity

      if (newQuantity < 0) {
        throw new Error('Insufficient stock')
      }

      if (existingInventory) {
        // Update existing inventory
        const { error } = await supabase
          .from('inventory')
          .update({ quantity: newQuantity })
          .eq('id', existingInventory.id)

        if (error) throw error
      } else {
        // Create new inventory record
        const { error } = await supabase
          .from('inventory')
          .insert([{
            product_id: movementFormData.product_id,
            warehouse_id: movementFormData.warehouse_id,
            quantity: newQuantity,
            min_stock_level: 5,
            max_stock_level: 100
          }])

        if (error) throw error
      }

      setIsMovementDialogOpen(false)
      setMovementFormData({
        product_id: '',
        warehouse_id: '',
        quantity: 0,
        type: 'in'
      })
      await fetchInventory()
    } catch (error) {
      console.error('Error updating inventory:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while updating inventory')
    }
  }

  const filteredInventory = inventory.filter(item =>
    item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.warehouse.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="flex justify-center items-center h-[80vh]">Načítavam...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h2 className="text-lg font-bold">Error:</h2>
        <p>{error}</p>
        <Button onClick={fetchInventory} className="mt-4">Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sklad</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => {
            setMovementFormData({ ...movementFormData, type: 'out' })
            setIsMovementDialogOpen(true)
          }}>
            <ArrowDownRight className="w-4 h-4 mr-2" />
            Výdaj zo skladu
          </Button>
          <Button onClick={() => {
            setMovementFormData({ ...movementFormData, type: 'in' })
            setIsMovementDialogOpen(true)
          }}>
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Príjem na sklad
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stav skladu</CardTitle>
          <CardDescription>
            Prehľad skladových zásob podľa produktov a skladov
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Hľadať podľa názvu produktu, SKU alebo skladu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produkt</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Sklad</TableHead>
                <TableHead>Množstvo</TableHead>
                <TableHead>Min. zásoba</TableHead>
                <TableHead>Max. zásoba</TableHead>
                <TableHead>Stav</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.product.name}</TableCell>
                  <TableCell>{item.product.sku}</TableCell>
                  <TableCell>{item.warehouse.name}</TableCell>
                  <TableCell>{item.quantity} ks</TableCell>
                  <TableCell>{item.min_stock_level} ks</TableCell>
                  <TableCell>{item.max_stock_level} ks</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.quantity <= item.min_stock_level
                        ? 'bg-red-100 text-red-800'
                        : item.quantity >= item.max_stock_level
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.quantity <= item.min_stock_level
                        ? 'Nízky stav'
                        : item.quantity >= item.max_stock_level
                        ? 'Nadmerný stav'
                        : 'Optimálny stav'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stock Movement Dialog */}
      <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {movementFormData.type === 'in' ? 'Príjem na sklad' : 'Výdaj zo skladu'}
            </DialogTitle>
            <DialogDescription>
              Vyplňte údaje o pohybe tovaru. Všetky polia sú povinné.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product">Produkt</Label>
              <select
                id="product"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={movementFormData.product_id}
                onChange={(e) => setMovementFormData(prev => ({ ...prev, product_id: e.target.value }))}
              >
                <option value="">Vyberte produkt</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku || 'bez SKU'})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="warehouse">Sklad</Label>
              <select
                id="warehouse"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={movementFormData.warehouse_id}
                onChange={(e) => setMovementFormData(prev => ({ ...prev, warehouse_id: e.target.value }))}
              >
                <option value="">Vyberte sklad</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name} ({warehouse.location})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Množstvo</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={movementFormData.quantity}
                onChange={(e) => setMovementFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMovementDialogOpen(false)}>
              Zrušiť
            </Button>
            <Button onClick={handleStockMovement}>
              {movementFormData.type === 'in' ? 'Prijať na sklad' : 'Vydať zo skladu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
