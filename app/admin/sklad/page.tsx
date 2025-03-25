"use client"

import { useState } from 'react'
import { 
  Search, 
  Plus, 
  ArrowUpRight,
  ArrowDownRight,
  Package,
  RefreshCw
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

// Define interfaces for inventory items
interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  warehouseId: string;
  warehouseName: string;
  batchNumber: string;
  expirationDate: string;
  lastStockCheck: string;
}

interface Warehouse {
  id: string;
  name: string;
  location: string;
}

interface Transaction {
  id: string;
  inventoryId: string;
  productName: string;
  transactionType: string;
  quantity: number;
  date: string;
  performedBy: string;
  notes: string;
}

// Mock data - would be replaced with real data from Supabase
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Cabernet Sauvignon 2022',
    category: 'Červené',
    quantity: 42,
    minStockLevel: 10,
    maxStockLevel: 100,
    warehouseId: '1',
    warehouseName: 'Hlavný sklad',
    batchNumber: 'BATCH-2022-001',
    expirationDate: '2027-03-25',
    lastStockCheck: '2025-03-20T10:00:00Z'
  },
  {
    id: '2',
    productId: '2',
    productName: 'Chardonnay 2023',
    category: 'Biele',
    quantity: 28,
    minStockLevel: 10,
    maxStockLevel: 100,
    warehouseId: '1',
    warehouseName: 'Hlavný sklad',
    batchNumber: 'BATCH-2023-001',
    expirationDate: '2026-03-25',
    lastStockCheck: '2025-03-20T10:00:00Z'
  },
  {
    id: '3',
    productId: '3',
    productName: 'Frankovka Modrá 2021',
    category: 'Červené',
    quantity: 15,
    minStockLevel: 10,
    maxStockLevel: 100,
    warehouseId: '1',
    warehouseName: 'Hlavný sklad',
    batchNumber: 'BATCH-2021-001',
    expirationDate: '2028-03-25',
    lastStockCheck: '2025-03-20T10:00:00Z'
  },
  {
    id: '4',
    productId: '4',
    productName: 'Rizling Rýnsky 2022',
    category: 'Biele',
    quantity: 33,
    minStockLevel: 10,
    maxStockLevel: 100,
    warehouseId: '1',
    warehouseName: 'Hlavný sklad',
    batchNumber: 'BATCH-2022-002',
    expirationDate: '2027-03-25',
    lastStockCheck: '2025-03-20T10:00:00Z'
  },
  {
    id: '5',
    productId: '5',
    productName: 'Svätovavrinecké 2020',
    category: 'Červené',
    quantity: 5,
    minStockLevel: 10,
    maxStockLevel: 100,
    warehouseId: '1',
    warehouseName: 'Hlavný sklad',
    batchNumber: 'BATCH-2020-001',
    expirationDate: '2029-03-25',
    lastStockCheck: '2025-03-20T10:00:00Z'
  },
  {
    id: '6',
    productId: '6',
    productName: 'Tramín Červený 2023',
    category: 'Biele',
    quantity: 0,
    minStockLevel: 10,
    maxStockLevel: 100,
    warehouseId: '1',
    warehouseName: 'Hlavný sklad',
    batchNumber: 'BATCH-2023-002',
    expirationDate: '2026-03-25',
    lastStockCheck: '2025-03-20T10:00:00Z'
  },
]

const mockWarehouses: Warehouse[] = [
  { id: '1', name: 'Hlavný sklad', location: 'Bratislava' },
  { id: '2', name: 'Sklad Košice', location: 'Košice' },
  { id: '3', name: 'Predajňa Bratislava', location: 'Bratislava' }
]

const mockTransactions: Transaction[] = [
  {
    id: '1',
    inventoryId: '1',
    productName: 'Cabernet Sauvignon 2022',
    transactionType: 'received',
    quantity: 50,
    date: '2025-03-15T09:30:00Z',
    performedBy: 'Ján Novák',
    notes: 'Nová dodávka'
  },
  {
    id: '2',
    inventoryId: '1',
    productName: 'Cabernet Sauvignon 2022',
    transactionType: 'shipped',
    quantity: -8,
    date: '2025-03-18T14:45:00Z',
    performedBy: 'Eva Kováčová',
    notes: 'Objednávka #1001'
  },
  {
    id: '3',
    inventoryId: '5',
    productName: 'Svätovavrinecké 2020',
    transactionType: 'adjusted',
    quantity: -2,
    date: '2025-03-19T11:20:00Z',
    performedBy: 'Peter Horváth',
    notes: 'Inventúrny rozdiel'
  },
  {
    id: '4',
    inventoryId: '2',
    productName: 'Chardonnay 2023',
    transactionType: 'transferred',
    quantity: -10,
    date: '2025-03-20T10:15:00Z',
    performedBy: 'Mária Tóthová',
    notes: 'Presun do predajne Bratislava'
  },
  {
    id: '5',
    inventoryId: '6',
    productName: 'Tramín Červený 2023',
    transactionType: 'shipped',
    quantity: -15,
    date: '2025-03-22T16:30:00Z',
    performedBy: 'Eva Kováčová',
    notes: 'Objednávka #1004'
  }
]

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [searchTerm, setSearchTerm] = useState('')
  const [warehouseFilter, setWarehouseFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [activeTab, setActiveTab] = useState('inventory')
  
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesWarehouse = 
      warehouseFilter === 'all' || 
      item.warehouseId === warehouseFilter
    
    const matchesStock = 
      stockFilter === 'all' || 
      (stockFilter === 'low' && item.quantity <= item.minStockLevel) ||
      (stockFilter === 'out' && item.quantity === 0) ||
      (stockFilter === 'normal' && item.quantity > item.minStockLevel)
    
    return matchesSearch && matchesWarehouse && matchesStock
  })
  
  const handleAdjustStock = (item: InventoryItem) => {
    setSelectedItem(item)
    setOpenDialog(true)
  }
  
  const handleStockUpdate = (id: string, newQuantity: number) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
    setOpenDialog(false)
  }
  
  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Vypredané
        </Badge>
      )
    } else if (item.quantity <= item.minStockLevel) {
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          Nízky stav: {item.quantity}
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Na sklade: {item.quantity}
        </Badge>
      )
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case 'received':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            Príjem
          </Badge>
        )
      case 'shipped':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <ArrowDownRight className="h-3 w-3 mr-1" />
            Výdaj
          </Badge>
        )
      case 'adjusted':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <RefreshCw className="h-3 w-3 mr-1" />
            Úprava
          </Badge>
        )
      case 'transferred':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <Package className="h-3 w-3 mr-1" />
            Presun
          </Badge>
        )
      default:
        return (
          <Badge>
            {type}
          </Badge>
        )
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Správa skladu</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Inventúra
          </Button>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Nová transakcia
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Celkový počet produktov
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Produkty s nízkym stavom
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {inventory.filter(item => item.quantity > 0 && item.quantity <= item.minStockLevel).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Vypredané produkty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inventory.filter(item => item.quantity === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">Stav zásob</TabsTrigger>
          <TabsTrigger value="transactions">História transakcií</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Stav zásob</CardTitle>
              <CardDescription>
                Prehľad všetkých produktov na sklade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Vyhľadať produkt..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={warehouseFilter}
                  onValueChange={setWarehouseFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sklad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Všetky sklady</SelectItem>
                    {mockWarehouses.map(warehouse => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={stockFilter}
                  onValueChange={setStockFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Stav zásob" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Všetky stavy</SelectItem>
                    <SelectItem value="normal">Dostatočný stav</SelectItem>
                    <SelectItem value="low">Nízky stav</SelectItem>
                    <SelectItem value="out">Vypredané</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produkt</TableHead>
                      <TableHead>Sklad</TableHead>
                      <TableHead>Šarža</TableHead>
                      <TableHead>Stav zásob</TableHead>
                      <TableHead>Využitie kapacity</TableHead>
                      <TableHead className="text-right">Akcie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.length > 0 ? (
                      filteredInventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{item.productName}</div>
                              <div className="text-sm text-muted-foreground">{item.category}</div>
                            </div>
                          </TableCell>
                          <TableCell>{item.warehouseName}</TableCell>
                          <TableCell>
                            <div>
                              <div>{item.batchNumber}</div>
                              <div className="text-sm text-muted-foreground">
                                Expirácia: {formatDate(item.expirationDate)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStockStatus(item)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Progress 
                                value={(item.quantity / item.maxStockLevel) * 100} 
                                className="h-2"
                              />
                              <p className="text-xs text-muted-foreground">
                                {item.quantity} z {item.maxStockLevel} ({Math.round((item.quantity / item.maxStockLevel) * 100)}%)
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAdjustStock(item)}
                            >
                              Upraviť stav
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Nenašli sa žiadne položky
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>História transakcií</CardTitle>
              <CardDescription>
                Prehľad všetkých pohybov na sklade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dátum a čas</TableHead>
                      <TableHead>Produkt</TableHead>
                      <TableHead>Typ transakcie</TableHead>
                      <TableHead>Množstvo</TableHead>
                      <TableHead>Vykonal</TableHead>
                      <TableHead>Poznámka</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {formatDateTime(transaction.date)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.productName}
                        </TableCell>
                        <TableCell>
                          {getTransactionTypeBadge(transaction.transactionType)}
                        </TableCell>
                        <TableCell className={transaction.quantity < 0 ? 'text-red-600' : 'text-green-600'}>
                          {transaction.quantity > 0 ? `+${transaction.quantity}` : transaction.quantity}
                        </TableCell>
                        <TableCell>{transaction.performedBy}</TableCell>
                        <TableCell>{transaction.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedItem && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upraviť stav zásob</DialogTitle>
              <DialogDescription>
                Upravte aktuálny stav zásob pre produkt {selectedItem.productName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="current-stock">Aktuálny stav</Label>
                <Input
                  id="current-stock"
                  value={selectedItem.quantity}
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adjustment-type">Typ úpravy</Label>
                <Select defaultValue="add">
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte typ úpravy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Príjem na sklad</SelectItem>
                    <SelectItem value="remove">Výdaj zo skladu</SelectItem>
                    <SelectItem value="set">Nastaviť presnú hodnotu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Množstvo</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  defaultValue="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Poznámka</Label>
                <Input
                  id="notes"
                  placeholder="Dôvod úpravy stavu zásob"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Zrušiť
              </Button>
              <Button onClick={() => handleStockUpdate(selectedItem.id, selectedItem.quantity + 5)}>
                Potvrdiť
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
