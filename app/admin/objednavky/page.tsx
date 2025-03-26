"use client"

import { useState, useEffect } from 'react'
import { Search, Eye, Package, CheckCircle2, XCircle } from 'lucide-react'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from '@/utils/supabase/client'

// Initialize Supabase client
const supabase = createClient()

interface OrderItem {
  id: string
  product: {
    name: string
    price: string
  }
  quantity: number
}

interface Order {
  id: string
  created_at: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  items: OrderItem[]
}

const ORDER_STATUSES = {
  pending: { label: 'Čaká na spracovanie', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Spracováva sa', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Odoslané', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Doručené', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Zrušené', color: 'bg-red-100 text-red-800' }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders() // Refresh data when changes occur
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data: orders, error: supabaseError } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          items:order_items(
            id,
            quantity,
            product:products(
              name,
              price
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError

      setOrders(orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ))
    } catch (error) {
      console.error('Error updating order status:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while updating order status')
    }
  }

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="flex justify-center items-center h-[80vh]">Načítavam...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h2 className="text-lg font-bold">Error:</h2>
        <p>{error}</p>
        <Button onClick={fetchOrders} className="mt-4">Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Objednávky</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zoznam objednávok</CardTitle>
          <CardDescription>
            Správa všetkých objednávok v systéme
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Hľadať podľa čísla objednávky, mena alebo emailu..."
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
                <TableHead>Číslo objednávky</TableHead>
                <TableHead>Dátum</TableHead>
                <TableHead>Zákazník</TableHead>
                <TableHead>Suma</TableHead>
                <TableHead>Stav</TableHead>
                <TableHead>Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString('sk-SK', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>€{order.total_amount.toLocaleString('sk-SK', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value: Order['status']) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className={`w-[180px] ${ORDER_STATUSES[order.status].color}`}>
                        <SelectValue>{ORDER_STATUSES[order.status].label}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ORDER_STATUSES).map(([value, { label }]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedOrder(order)
                        setIsDetailsDialogOpen(true)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail objednávky {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Kompletné informácie o objednávke
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Informácie o zákazníkovi</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Meno</p>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedOrder.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefón</p>
                    <p className="font-medium">{selectedOrder.customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Adresa</p>
                    <p className="font-medium">{selectedOrder.customer.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Položky objednávky</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produkt</TableHead>
                      <TableHead className="text-right">Množstvo</TableHead>
                      <TableHead className="text-right">Cena za kus</TableHead>
                      <TableHead className="text-right">Celková cena</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell className="text-right">{item.quantity} ks</TableCell>
                        <TableCell className="text-right">
                          €{parseFloat(item.product.price).toLocaleString('sk-SK', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          €{(parseFloat(item.product.price) * item.quantity).toLocaleString('sk-SK', { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-semibold">Celková suma</TableCell>
                      <TableCell className="text-right font-semibold">
                        €{selectedOrder.total_amount.toLocaleString('sk-SK', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Order Actions */}
              <div className="flex justify-end gap-2">
                {selectedOrder.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Zrušiť objednávku
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(selectedOrder.id, 'processing')}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Začať spracovanie
                    </Button>
                  </>
                )}
                {selectedOrder.status === 'processing' && (
                  <Button
                    onClick={() => handleStatusChange(selectedOrder.id, 'shipped')}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Označiť ako odoslané
                  </Button>
                )}
                {selectedOrder.status === 'shipped' && (
                  <Button
                    onClick={() => handleStatusChange(selectedOrder.id, 'delivered')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Označiť ako doručené
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
