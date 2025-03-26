"use client"

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/utils/supabase/client'
import { Json } from '@/types/database.types'

// Initialize Supabase client
const supabase = createClient()

interface InventoryItem {
  quantity: number
}

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  sku: string | null
  is_active: boolean
  image_url: string | null
  metadata: Json | null
  created_at: string
  updated_at: string
  total_quantity: number
}

interface RawProduct extends Omit<Product, 'total_quantity'> {
  total_quantity: InventoryItem[]
}

interface ProductFormData {
  name: string
  description: string
  price: string
  sku: string
  is_active: boolean
  image_url: string
}

// Warehouse IDs from the database
const WAREHOUSE_IDS = [
  'a4400ebc-a2f8-4242-b242-8bd5692ebaa9', // Cellar One
  '0bb9499a-d7dc-4e87-86c0-14115c1753b9', // Main Storage
  '950718e1-470d-4a38-ba4d-49d81af2727a'  // Reserve Vault
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    sku: '',
    is_active: true,
    image_url: ''
  })

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          fetchProducts() // Refresh data when changes occur
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data: products, error: supabaseError } = await supabase
        .from('products')
        .select(`
          *,
          total_quantity:inventory(quantity)
        `)
        .order('name')

      if (supabaseError) throw supabaseError

      // Process the data to sum quantities
      const processedProducts = (products as RawProduct[]).map(product => ({
        ...product,
        total_quantity: product.total_quantity?.reduce((sum, inv) => sum + (inv.quantity || 0), 0) || 0
      }))

      setProducts(processedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async () => {
    try {
      // Validate price is a valid number
      const price = parseFloat(formData.price)
      if (isNaN(price)) {
        throw new Error('Please enter a valid price')
      }

      // First, insert the product
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert([
          {
            name: formData.name,
            description: formData.description || null,
            price: price,
            sku: formData.sku || null,
            is_active: formData.is_active,
            image_url: formData.image_url || null
          }
        ])
        .select()
        .single()

      if (productError) throw productError

      // Then, create inventory records for each warehouse
      const inventoryRecords = WAREHOUSE_IDS.map(warehouseId => ({
        product_id: newProduct.id,
        warehouse_id: warehouseId,
        quantity: 0,
        min_stock_level: 5,
        max_stock_level: 100
      }))

      const { error: inventoryError } = await supabase
        .from('inventory')
        .insert(inventoryRecords)

      if (inventoryError) throw inventoryError

      setIsAddDialogOpen(false)
      setFormData({
        name: '',
        description: '',
        price: '',
        sku: '',
        is_active: true,
        image_url: ''
      })
      await fetchProducts()
    } catch (error) {
      console.error('Error adding product:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while adding the product')
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    try {
      // Validate price is a valid number
      const price = parseFloat(formData.price)
      if (isNaN(price)) {
        throw new Error('Please enter a valid price')
      }

      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description || null,
          price: price,
          sku: formData.sku || null,
          is_active: formData.is_active,
          image_url: formData.image_url || null
        })
        .eq('id', editingProduct.id)

      if (error) throw error

      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        sku: '',
        is_active: true,
        image_url: ''
      })
      await fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while updating the product')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while deleting the product')
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="flex justify-center items-center h-[80vh]">Načítavam...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h2 className="text-lg font-bold">Error:</h2>
        <p>{error}</p>
        <Button onClick={fetchProducts} className="mt-4">Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Produkty</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Pridať produkt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pridať nový produkt</DialogTitle>
              <DialogDescription>
                Vyplňte údaje o novom produkte. Všetky polia označené * sú povinné.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Názov *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Popis</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Cena *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image_url">URL obrázka</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Zrušiť
              </Button>
              <Button onClick={handleAddProduct}>
                Pridať produkt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zoznam produktov</CardTitle>
          <CardDescription>
            Správa všetkých produktov v systéme
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Hľadať podľa názvu alebo SKU..."
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
                <TableHead>Názov</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Cena</TableHead>
                <TableHead>Množstvo</TableHead>
                <TableHead>Stav</TableHead>
                <TableHead className="text-right">Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>€{product.price.toLocaleString('sk-SK', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{product.total_quantity} ks</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.is_active ? 'Aktívny' : 'Neaktívny'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingProduct(product)
                          setFormData({
                            name: product.name,
                            description: product.description || '',
                            price: product.price.toString(),
                            sku: product.sku || '',
                            is_active: product.is_active,
                            image_url: product.image_url || ''
                          })
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upraviť produkt</DialogTitle>
            <DialogDescription>
              Upravte údaje o produkte. Všetky polia označené * sú povinné.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Názov *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Popis</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Cena *</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-sku">SKU</Label>
              <Input
                id="edit-sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image_url">URL obrázka</Label>
              <Input
                id="edit-image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProduct(null)}>
              Zrušiť
            </Button>
            <Button onClick={handleUpdateProduct}>
              Uložiť zmeny
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
