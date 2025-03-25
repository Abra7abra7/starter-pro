"use client"

import { useState, useEffect } from 'react'
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Calendar, 
  Package, 
  AlertTriangle,
  ArrowUpRight
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

// Mock data - would be replaced with real data from Supabase
const salesData = [
  { name: 'Jan', total: 1500 },
  { name: 'Feb', total: 2300 },
  { name: 'Mar', total: 3200 },
  { name: 'Apr', total: 4500 },
  { name: 'May', total: 3800 },
  { name: 'Jun', total: 5000 },
]

const productPerformance = [
  { name: 'Cabernet Sauvignon 2022', value: 35 },
  { name: 'Chardonnay 2023', value: 25 },
  { name: 'Frankovka Modrá 2021', value: 20 },
  { name: 'Rizling Rýnsky 2022', value: 15 },
  { name: 'Ostatné', value: 5 },
]

const COLORS = ['#B45309', '#D97706', '#F59E0B', '#FBBF24', '#FDE68A']

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="flex justify-center items-center h-[80vh]">Načítavam...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Prehľad</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">Exportovať</Button>
          <Button>Obnoviť</Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Celkové tržby
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€24,532</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5%
              </span>
              oproti minulému mesiacu
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Objednávky
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">243</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2%
              </span>
              oproti minulému mesiacu
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Zákazníci
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,452</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +5.3%
              </span>
              oproti minulému mesiacu
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nadchádzajúce degustácie
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Najbližšia: 15. apríla 2025
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Mesačné tržby</CardTitle>
            <CardDescription>
              Prehľad tržieb za posledných 6 mesiacov
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`€${value}`, 'Tržby']}
                  labelFormatter={(label) => `Mesiac: ${label}`}
                />
                <Bar dataKey="total" fill="#B45309" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Najlepšie predávané produkty</CardTitle>
            <CardDescription>
              Podiel na celkových tržbách
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productPerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Podiel']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity and alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Nedávne objednávky</CardTitle>
            <CardDescription>
              Posledných 5 objednávok
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">ORD-20250325-{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Zákazník: Ján Novák</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{(Math.random() * 200 + 50).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Pred {i + 1} {i === 0 ? 'hodinou' : 'hodinami'}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Zobraziť všetky objednávky
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upozornenia</CardTitle>
            <CardDescription>
              Dôležité upozornenia vyžadujúce pozornosť
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 border-b pb-4">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium">Nízky stav zásob</p>
                  <p className="text-sm text-muted-foreground">
                    Cabernet Sauvignon 2022 - zostáva len 5 fliaš
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b pb-4">
                <Package className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium">Čakajúce zásielky</p>
                  <p className="text-sm text-muted-foreground">
                    3 objednávky čakajú na odoslanie
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium">Nadchádzajúca degustácia</p>
                  <p className="text-sm text-muted-foreground">
                    &quot;Jarná degustácia&quot; - 15. apríla 2025, 18:00
                  </p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Zobraziť všetky upozornenia
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
