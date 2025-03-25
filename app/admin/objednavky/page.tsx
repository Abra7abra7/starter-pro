"use client"

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Eye, 
  Download,
  Package,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Mock data - would be replaced with real data from Supabase
const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-20250325-1001',
    customer: 'Ján Novák',
    email: 'jan.novak@example.com',
    date: '2025-03-25T08:30:00Z',
    total: 89.97,
    status: 'pending',
    paymentStatus: 'paid',
    items: [
      { id: '1', name: 'Cabernet Sauvignon 2022', quantity: 3, price: 15.99 },
      { id: '2', name: 'Chardonnay 2023', quantity: 2, price: 12.99 }
    ],
    shippingAddress: {
      street: 'Hlavná 123',
      city: 'Bratislava',
      postalCode: '81101',
      country: 'Slovensko'
    },
    shippingMethod: 'Kuriér',
    trackingNumber: null
  },
  {
    id: '2',
    orderNumber: 'ORD-20250324-1002',
    customer: 'Eva Kováčová',
    email: 'eva.kovacova@example.com',
    date: '2025-03-24T14:45:00Z',
    total: 72.50,
    status: 'processing',
    paymentStatus: 'paid',
    items: [
      { id: '3', name: 'Frankovka Modrá 2021', quantity: 2, price: 14.50 },
      { id: '4', name: 'Rizling Rýnsky 2022', quantity: 3, price: 13.99 }
    ],
    shippingAddress: {
      street: 'Nová 45',
      city: 'Košice',
      postalCode: '04001',
      country: 'Slovensko'
    },
    shippingMethod: 'Kuriér',
    trackingNumber: null
  },
  {
    id: '3',
    orderNumber: 'ORD-20250323-1003',
    customer: 'Peter Horváth',
    email: 'peter.horvath@example.com',
    date: '2025-03-23T10:15:00Z',
    total: 115.50,
    status: 'shipped',
    paymentStatus: 'paid',
    items: [
      { id: '1', name: 'Cabernet Sauvignon 2022', quantity: 2, price: 15.99 },
      { id: '5', name: 'Svätovavrinecké 2020', quantity: 3, price: 16.50 },
      { id: '4', name: 'Rizling Rýnsky 2022', quantity: 2, price: 13.99 }
    ],
    shippingAddress: {
      street: 'Slnečná 78',
      city: 'Žilina',
      postalCode: '01001',
      country: 'Slovensko'
    },
    shippingMethod: 'Kuriér',
    trackingNumber: 'SK123456789'
  },
  {
    id: '4',
    orderNumber: 'ORD-20250322-1004',
    customer: 'Mária Tóthová',
    email: 'maria.tothova@example.com',
    date: '2025-03-22T16:20:00Z',
    total: 94.95,
    status: 'delivered',
    paymentStatus: 'paid',
    items: [
      { id: '6', name: 'Tramín Červený 2023', quantity: 5, price: 18.99 }
    ],
    shippingAddress: {
      street: 'Krátka 15',
      city: 'Nitra',
      postalCode: '94901',
      country: 'Slovensko'
    },
    shippingMethod: 'Kuriér',
    trackingNumber: 'SK987654321'
  },
  {
    id: '5',
    orderNumber: 'ORD-20250321-1005',
    customer: 'Tomáš Varga',
    email: 'tomas.varga@example.com',
    date: '2025-03-21T09:10:00Z',
    total: 43.50,
    status: 'cancelled',
    paymentStatus: 'refunded',
    items: [
      { id: '3', name: 'Frankovka Modrá 2021', quantity: 3, price: 14.50 }
    ],
    shippingAddress: {
      street: 'Dlhá 234',
      city: 'Prešov',
      postalCode: '08001',
      country: 'Slovensko'
    },
    shippingMethod: 'Kuriér',
    trackingNumber: null
  }
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [openDialog, setOpenDialog] = useState(false)
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || 
      order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })
  
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setOpenDialog(true)
  }
  
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="h-3 w-3 mr-1" />
            Čaká na spracovanie
          </Badge>
        )
      case 'processing':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Package className="h-3 w-3 mr-1" />
            Spracováva sa
          </Badge>
        )
      case 'shipped':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <Truck className="h-3 w-3 mr-1" />
            Odoslané
          </Badge>
        )
      case 'delivered':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Doručené
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Zrušené
          </Badge>
        )
      default:
        return (
          <Badge>
            {status}
          </Badge>
        )
    }
  }
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CreditCard className="h-3 w-3 mr-1" />
            Zaplatené
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Clock className="h-3 w-3 mr-1" />
            Čaká na platbu
          </Badge>
        )
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Zlyhané
          </Badge>
        )
      case 'refunded':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <CreditCard className="h-3 w-3 mr-1" />
            Vrátené
          </Badge>
        )
      default:
        return (
          <Badge>
            {status}
          </Badge>
        )
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Objednávky</h1>
        <Button variant="outline" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          Exportovať
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Správa objednávok</CardTitle>
          <CardDescription>
            Zobrazte a spravujte všetky objednávky z e-shopu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Vyhľadať objednávku, zákazníka..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Stav objednávky" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky stavy</SelectItem>
                <SelectItem value="pending">Čaká na spracovanie</SelectItem>
                <SelectItem value="processing">Spracováva sa</SelectItem>
                <SelectItem value="shipped">Odoslané</SelectItem>
                <SelectItem value="delivered">Doručené</SelectItem>
                <SelectItem value="cancelled">Zrušené</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Číslo objednávky</TableHead>
                  <TableHead>Zákazník</TableHead>
                  <TableHead>Dátum</TableHead>
                  <TableHead>Celkom (€)</TableHead>
                  <TableHead>Stav</TableHead>
                  <TableHead>Platba</TableHead>
                  <TableHead className="text-right">Akcie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{order.customer}</div>
                          <div className="text-sm text-muted-foreground">{order.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>{order.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nenašli sa žiadne objednávky
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {selectedOrder && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Detail objednávky {selectedOrder.orderNumber}</DialogTitle>
              <DialogDescription>
                Vytvorená {formatDate(selectedOrder.date)}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Detaily</TabsTrigger>
                <TabsTrigger value="products">Produkty</TabsTrigger>
                <TabsTrigger value="shipping">Doprava</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Stav objednávky</h3>
                    <div className="mt-2">
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                  
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => handleUpdateStatus(selectedOrder.id, value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Zmeniť stav" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Čaká na spracovanie</SelectItem>
                      <SelectItem value="processing">Spracováva sa</SelectItem>
                      <SelectItem value="shipped">Odoslané</SelectItem>
                      <SelectItem value="delivered">Doručené</SelectItem>
                      <SelectItem value="cancelled">Zrušené</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Informácie o zákazníkovi</h3>
                    <p className="text-sm">{selectedOrder.customer}</p>
                    <p className="text-sm">{selectedOrder.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Platobné informácie</h3>
                    <p className="text-sm">Stav platby: {getPaymentStatusBadge(selectedOrder.paymentStatus)}</p>
                    <p className="text-sm mt-2">Celková suma: {selectedOrder.total.toFixed(2)} €</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Doručovacia adresa</h3>
                  <p className="text-sm">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-sm">{selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}</p>
                  <p className="text-sm">{selectedOrder.shippingAddress.country}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="products" className="space-y-4 pt-4">
                <h3 className="font-semibold text-lg">Produkty v objednávke</h3>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produkt</TableHead>
                        <TableHead>Cena za kus (€)</TableHead>
                        <TableHead>Množstvo</TableHead>
                        <TableHead className="text-right">Celkom (€)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>{item.price.toFixed(2)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-semibold">
                          Celkom:
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {selectedOrder.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="space-y-4 pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Informácie o doprave</h3>
                    <p className="text-sm mt-2">Spôsob dopravy: {selectedOrder.shippingMethod}</p>
                    
                    {selectedOrder.trackingNumber ? (
                      <div className="mt-4">
                        <p className="text-sm">Sledovacie číslo: {selectedOrder.trackingNumber}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Sledovať zásielku
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm mt-4 text-muted-foreground">
                        Sledovacie číslo zatiaľ nie je k dispozícii
                      </p>
                    )}
                  </div>
                  
                  {selectedOrder.status === 'processing' && (
                    <div>
                      <h3 className="font-semibold mb-2">Pridať sledovacie číslo</h3>
                      <div className="flex gap-2">
                        <Input placeholder="Zadajte sledovacie číslo" />
                        <Button>Uložiť</Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Doručovacia adresa</h3>
                  <p className="text-sm">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-sm">{selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}</p>
                  <p className="text-sm">{selectedOrder.shippingAddress.country}</p>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
