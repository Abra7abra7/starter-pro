"use client"

import { useState, useEffect } from 'react'
import { Search, Eye, Mail, Phone, MapPin } from 'lucide-react'
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
import { createClient } from '@/utils/supabase/client'

// Initialize Supabase client
const supabase = createClient()

interface Order {
  id: string
  created_at: string
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
}

// Types for customer data
interface CustomerProfile {
  first_name: string
  last_name: string
  phone: string
}

interface CustomerAddress {
  street_address: string
  apartment: string | null
  city: string
  postal_code: string
  country: string
  is_default: boolean
}

// Type for raw data from Supabase
type RawCustomerData = {
  id: string
  email: string
  created_at: string
  customer_profiles: CustomerProfile[]
  customer_addresses: CustomerAddress[]
  orders: Order[]
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  created_at: string
  orders: Order[]
  total_orders: number
  total_spent: number
}

const ORDER_STATUSES = {
  pending: { label: 'Čaká na spracovanie', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Spracováva sa', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Odoslané', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Doručené', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Zrušené', color: 'bg-red-100 text-red-800' }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('customers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers'
        },
        () => {
          fetchCustomers() // Refresh data when changes occur
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const { data: customers, error: supabaseError } = await supabase
        .from('customers')
        .select(`
          id,
          email,
          created_at,
          customer_profiles!inner (
            first_name,
            last_name,
            phone
          ),
          customer_addresses!inner (
            street_address,
            apartment,
            city,
            postal_code,
            country,
            is_default
          ),
          orders (
            id,
            created_at,
            order_status,
            total
          )
        `)
        .order('email')

      if (supabaseError) throw supabaseError

      if (!customers) {
        throw new Error('No customers data received')
      }

      // Process customer data to include total orders and total spent
      const processedCustomers: Customer[] = customers.map((customer: RawCustomerData) => {
        const profile = customer.customer_profiles[0]
        const address = customer.customer_addresses[0]

        if (!profile || !address) {
          throw new Error(`Missing profile or address data for customer ${customer.id}`)
        }

        return {
          id: customer.id,
          name: `${profile.first_name} ${profile.last_name}`,
          email: customer.email,
          phone: profile.phone,
          address: `${address.street_address}${address.apartment ? `, ${address.apartment}` : ''}, ${address.city}, ${address.postal_code}, ${address.country}`,
          created_at: customer.created_at,
          orders: customer.orders.map(order => ({
            id: order.id,
            created_at: order.created_at,
            order_status: order.order_status,
            total: order.total
          })),
          total_orders: customer.orders.length,
          total_spent: customer.orders.reduce((sum: number, order: Order) => sum + (order.total || 0), 0)
        }
      })

      setCustomers(processedCustomers)
    } catch (error) {
      console.error('Error fetching customers:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching customers')
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="flex justify-center items-center h-[80vh]">Načítavam...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h2 className="text-lg font-bold">Error:</h2>
        <p>{error}</p>
        <Button onClick={fetchCustomers} className="mt-4">Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Zákazníci</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zoznam zákazníkov</CardTitle>
          <CardDescription>
            Správa všetkých zákazníkov v systéme
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Hľadať podľa mena, emailu alebo telefónu..."
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
                <TableHead>Meno</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Počet objednávok</TableHead>
                <TableHead>Celková hodnota</TableHead>
                <TableHead>Registrovaný</TableHead>
                <TableHead>Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="w-4 h-4 mr-2" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 mr-2" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.total_orders}</TableCell>
                  <TableCell>€{customer.total_spent.toLocaleString('sk-SK', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    {new Date(customer.created_at).toLocaleDateString('sk-SK', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedCustomer(customer)
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

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail zákazníka</DialogTitle>
            <DialogDescription>
              Kompletné informácie o zákazníkovi a jeho objednávkach
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid gap-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Informácie o zákazníkovi</h3>
                <div className="grid gap-4">
                  <div className="flex items-center">
                    <div className="w-32 text-sm text-muted-foreground">Meno</div>
                    <div className="font-medium">{selectedCustomer.name}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 text-sm text-muted-foreground">Email</div>
                    <div className="font-medium flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {selectedCustomer.email}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 text-sm text-muted-foreground">Telefón</div>
                    <div className="font-medium flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {selectedCustomer.phone}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 text-sm text-muted-foreground">Adresa</div>
                    <div className="font-medium flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedCustomer.address}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 text-sm text-muted-foreground">Registrovaný</div>
                    <div className="font-medium">
                      {new Date(selectedCustomer.created_at).toLocaleDateString('sk-SK', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="text-lg font-semibold mb-4">História objednávok</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Číslo objednávky</TableHead>
                      <TableHead>Dátum</TableHead>
                      <TableHead>Suma</TableHead>
                      <TableHead>Stav</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCustomer.orders
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((order) => (
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
                          <TableCell>€{order.total.toLocaleString('sk-SK', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${ORDER_STATUSES[order.order_status].color}`}>
                              {ORDER_STATUSES[order.order_status].label}
                            </span>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Customer Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Celkový počet objednávok
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedCustomer.total_orders}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Celková hodnota objednávok
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      €{selectedCustomer.total_spent.toLocaleString('sk-SK', { minimumFractionDigits: 2 })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
