"use client"

import { useState, useEffect } from 'react'
import { 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { createClient } from '@/utils/supabase/client'
import { Json } from '@/types/database.types'

// Initialize Supabase client
const supabase = createClient()

interface Product {
  id: string
  name: string
  description: string | null
  price: string
  sku: string | null
  is_active: boolean
  image_url: string | null
  metadata: Json | null
  created_at: string
  updated_at: string
  total_quantity: number
}

interface DashboardData {
  products: Product[]
  totalValue: number
  lowStock: Product[]
}

interface RawProduct extends Omit<Product, 'total_quantity'> {
  total_quantity: Array<{ quantity: number }>
}

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    products: [],
    totalValue: 0,
    lowStock: []
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching data from Supabase...')
      const { data: products, error: supabaseError } = await supabase
        .from('products')
        .select(`
          *,
          total_quantity:inventory(quantity)
        `)
        .order('name')

      if (supabaseError) {
        console.error('Supabase error:', supabaseError)
        setError(supabaseError.message)
        return
      }

      console.log('Raw products data:', products)

      if (!products) {
        console.error('No products data received')
        setError('No products data received')
        return
      }

      // Process the data - group by product and sum quantities
      const productMap = new Map<string, Product>()
      products.forEach((rawProduct: RawProduct) => {
        const existingProduct = productMap.get(rawProduct.id)
        const quantity = rawProduct.total_quantity?.reduce((sum, inv) => sum + (inv.quantity || 0), 0) || 0

        if (existingProduct) {
          existingProduct.total_quantity += quantity
        } else {
          productMap.set(rawProduct.id, {
            ...rawProduct,
            total_quantity: quantity
          })
        }
      })

      const processedData = Array.from(productMap.values())
      console.log('Processed data:', processedData)

      // Calculate total inventory value
      const totalValue = processedData.reduce((sum: number, product: Product) => {
        const value = parseFloat(product.price) * product.total_quantity
        console.log(`${product.name} value: ${value} (price: ${product.price} * quantity: ${product.total_quantity})`)
        return sum + value
      }, 0)

      console.log('Total inventory value:', totalValue)

      // Identify low stock items (less than 20 units)
      const lowStock = processedData.filter(product => product.total_quantity < 20)
      console.log('Low stock items:', lowStock)

      setDashboardData({
        products: processedData,
        totalValue,
        lowStock
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }

  if (!isClient) {
    return <div className="flex justify-center items-center h-[80vh]">Načítavam...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h2 className="text-lg font-bold">Error loading dashboard data:</h2>
        <p>{error}</p>
        <Button onClick={fetchDashboardData} className="mt-4">Retry</Button>
      </div>
    )
  }

  const COLORS = ['#B45309', '#D97706', '#F59E0B', '#FBBF24', '#FDE68A']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Prehľad</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">Exportovať</Button>
          <Button onClick={fetchDashboardData}>Obnoviť</Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hodnota skladu
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{dashboardData.totalValue.toLocaleString('sk-SK', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Celková hodnota produktov na sklade
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produkty na sklade
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.products.length}</div>
            <p className="text-xs text-muted-foreground">
              Počet rôznych produktov v ponuke
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nízky stav zásob
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.lowStock.length}</div>
            <p className="text-xs text-muted-foreground">
              Produkty s menej ako 20 kusmi
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Priemerná cena
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{(dashboardData.totalValue / Math.max(1, dashboardData.products.length)).toLocaleString('sk-SK', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Priemerná cena za produkt
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Stav zásob podľa produktov</CardTitle>
            <CardDescription>
              Aktuálny stav jednotlivých produktov na sklade
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.products}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} ks`, 'Množstvo']}
                  labelFormatter={(label) => `Produkt: ${label}`}
                />
                <Bar dataKey="total_quantity" fill="#B45309" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Rozloženie zásob</CardTitle>
            <CardDescription>
              Percentuálny podiel produktov na celkovom množstve
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.products}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, total_quantity, percent }) => 
                    `${name}: ${total_quantity} ks (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total_quantity"
                >
                  {dashboardData.products.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} ks`, 'Množstvo']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Inventory details and alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Stav produktov</CardTitle>
            <CardDescription>
              Detailný prehľad všetkých produktov
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.products.map((product, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">Skladom: {product.total_quantity} ks</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{parseFloat(product.price).toLocaleString('sk-SK', { minimumFractionDigits: 2 })}</p>
                    <p className="text-sm text-muted-foreground">
                      Hodnota: €{(parseFloat(product.price) * product.total_quantity).toLocaleString('sk-SK', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upozornenia</CardTitle>
            <CardDescription>
              Produkty s nízkym stavom zásob
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.lowStock.map((product, i) => (
                <div key={i} className="flex items-start gap-4 border-b pb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Zostáva len {product.total_quantity} fliaš
                    </p>
                  </div>
                </div>
              ))}
              {dashboardData.lowStock.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  Žiadne produkty nemajú kriticky nízky stav zásob
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
