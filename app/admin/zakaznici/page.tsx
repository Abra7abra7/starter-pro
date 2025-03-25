"use client"

import { useState } from 'react'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  ShoppingBag,
  Calendar,
  MapPin,
  User
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Mock data for customers
const mockCustomers = [
  {
    id: '1',
    name: 'Ján Novák',
    email: 'jan.novak@example.com',
    phone: '+421 900 123 456',
    address: 'Hlavná 123, 811 01 Bratislava',
    createdAt: '2024-12-15T10:30:00Z',
    lastOrder: '2025-03-15T14:45:00Z',
    totalOrders: 5,
    totalSpent: 235.50,
    notes: 'Preferuje červené vína, najmä Cabernet Sauvignon',
    status: 'active'
  },
  {
    id: '2',
    name: 'Eva Kováčová',
    email: 'eva.kovacova@example.com',
    phone: '+421 900 234 567',
    address: 'Mlynská 45, 040 01 Košice',
    createdAt: '2025-01-10T09:15:00Z',
    lastOrder: '2025-03-18T11:20:00Z',
    totalOrders: 3,
    totalSpent: 127.80,
    notes: 'Členka vinárskeho klubu, má záujem o degustácie',
    status: 'active'
  },
  {
    id: '3',
    name: 'Peter Horváth',
    email: 'peter.horvath@example.com',
    phone: '+421 900 345 678',
    address: 'Záhradnícka 78, 917 01 Trnava',
    createdAt: '2025-02-05T16:40:00Z',
    lastOrder: '2025-02-28T13:10:00Z',
    totalOrders: 1,
    totalSpent: 42.90,
    notes: '',
    status: 'active'
  },
  {
    id: '4',
    name: 'Mária Tóthová',
    email: 'maria.tothova@example.com',
    phone: '+421 900 456 789',
    address: 'Jánošíkova 12, 010 01 Žilina',
    createdAt: '2024-11-20T13:50:00Z',
    lastOrder: '2025-01-05T10:25:00Z',
    totalOrders: 2,
    totalSpent: 89.70,
    notes: 'Preferuje biele vína',
    status: 'inactive'
  },
  {
    id: '5',
    name: 'Juraj Kováč',
    email: 'juraj.kovac@example.com',
    phone: '+421 900 567 890',
    address: 'Námestie SNP 15, 974 01 Banská Bystrica',
    createdAt: '2025-03-01T11:05:00Z',
    lastOrder: null,
    totalOrders: 0,
    totalSpent: 0,
    notes: 'Registrovaný na degustáciu 15.4.2025',
    status: 'active'
  }
]

// Mock data for orders
const mockOrders = [
  {
    id: '1001',
    customerId: '1',
    orderNumber: 'ORD-2025-001',
    date: '2025-03-15T14:45:00Z',
    status: 'completed',
    total: 75.80,
    items: [
      { id: '1', name: 'Cabernet Sauvignon 2022', quantity: 2, price: 18.90 },
      { id: '3', name: 'Frankovka Modrá 2021', quantity: 2, price: 19.00 }
    ]
  },
  {
    id: '1002',
    customerId: '2',
    orderNumber: 'ORD-2025-002',
    date: '2025-03-18T11:20:00Z',
    status: 'completed',
    total: 56.70,
    items: [
      { id: '2', name: 'Chardonnay 2023', quantity: 3, price: 18.90 }
    ]
  },
  {
    id: '1003',
    customerId: '1',
    orderNumber: 'ORD-2025-003',
    date: '2025-03-10T09:30:00Z',
    status: 'completed',
    total: 37.80,
    items: [
      { id: '4', name: 'Rizling Rýnsky 2022', quantity: 2, price: 18.90 }
    ]
  },
  {
    id: '1004',
    customerId: '3',
    orderNumber: 'ORD-2025-004',
    date: '2025-02-28T13:10:00Z',
    status: 'completed',
    total: 42.90,
    items: [
      { id: '6', name: 'Tramín Červený 2023', quantity: 3, price: 14.30 }
    ]
  },
  {
    id: '1005',
    customerId: '1',
    orderNumber: 'ORD-2025-005',
    date: '2025-02-20T16:15:00Z',
    status: 'completed',
    total: 56.70,
    items: [
      { id: '2', name: 'Chardonnay 2023', quantity: 3, price: 18.90 }
    ]
  }
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('all')
  
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || 
      customer.status === statusFilter
    
    return matchesSearch && matchesStatus
  })
  
  const handleAddCustomer = () => {
    setSelectedCustomer(null)
    setOpenDialog(true)
  }
  
  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    setOpenDialog(true)
  }
  
  const handleDeleteCustomer = (id: string) => {
    if (confirm('Naozaj chcete odstrániť tohto zákazníka?')) {
      setCustomers(customers.filter(customer => customer.id !== id))
    }
  }
  
  const handleSaveCustomer = (formData: any) => {
    if (selectedCustomer) {
      // Update existing customer
      setCustomers(customers.map(customer => 
        customer.id === selectedCustomer.id ? { ...customer, ...formData } : customer
      ))
    } else {
      // Add new customer
      const newCustomer = {
        id: (customers.length + 1).toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        lastOrder: null,
        totalOrders: 0,
        totalSpent: 0,
        status: 'active'
      }
      setCustomers([...customers, newCustomer])
    }
    setOpenDialog(false)
  }
  
  const getCustomerInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
  }
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nikdy'
    
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }
  
  const getCustomerOrders = (customerId: string) => {
    return mockOrders.filter(order => order.customerId === customerId)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Zákazníci</h1>
        <Button onClick={handleAddCustomer} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Pridať zákazníka
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Celkový počet zákazníkov
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Aktívni zákazníci
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(customer => customer.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Priemerná hodnota objednávky
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                mockOrders.reduce((acc, order) => acc + order.total, 0) / mockOrders.length
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Zoznam zákazníkov</CardTitle>
          <CardDescription>
            Správa všetkých zákazníkov vášho vinárstva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Vyhľadať zákazníka..."
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
                <SelectValue placeholder="Stav zákazníka" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetci zákazníci</SelectItem>
                <SelectItem value="active">Aktívni</SelectItem>
                <SelectItem value="inactive">Neaktívni</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zákazník</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Registrácia</TableHead>
                  <TableHead>Posledná objednávka</TableHead>
                  <TableHead>Celkové nákupy</TableHead>
                  <TableHead className="text-right">Akcie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getCustomerInitials(customer.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {customer.status === 'active' ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Aktívny
                                </Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                  Neaktívny
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(customer.createdAt)}</TableCell>
                      <TableCell>{formatDate(customer.lastOrder)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <ShoppingBag className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{customer.totalOrders} objednávok</span>
                          </div>
                          <div className="font-medium">
                            {formatCurrency(customer.totalSpent)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Upraviť</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Odstrániť</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenašli sa žiadni zákazníci
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <CustomerDialog 
        open={openDialog} 
        onOpenChange={setOpenDialog}
        customer={selectedCustomer}
        onSave={handleSaveCustomer}
      />
    </div>
  )
}

function CustomerDialog({ 
  open, 
  onOpenChange, 
  customer, 
  onSave 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  customer: any | null,
  onSave: (formData: any) => void
}) {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    notes: customer?.notes || '',
    status: customer?.status || 'active'
  })
  
  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{customer ? 'Upraviť zákazníka' : 'Pridať zákazníka'}</DialogTitle>
            <DialogDescription>
              {customer 
                ? 'Upravte údaje existujúceho zákazníka' 
                : 'Vyplňte formulár pre pridanie nového zákazníka'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Meno a priezvisko</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefón</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Adresa</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Poznámky</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Stav zákazníka</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte stav zákazníka" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktívny</SelectItem>
                  <SelectItem value="inactive">Neaktívny</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Zrušiť
            </Button>
            <Button type="submit">
              {customer ? 'Uložiť zmeny' : 'Pridať zákazníka'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
