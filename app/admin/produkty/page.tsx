"use client"

import { useState } from 'react'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Filter,
  ChevronDown,
  Wine,
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { ImageUpload } from '@/components/ui/image-upload'

// Define types for the wine product
interface WineProduct {
  id: string
  name: string
  vintage: number
  category: string
  variety: string
  price: number
  stock: number
  vineyard: string
  status: 'active' | 'low_stock' | 'out_of_stock'
  description?: string
  image?: string
  images?: { url: string; alt_text?: string; is_primary?: boolean }[]
}

// Mock data - would be replaced with real data from Supabase
const mockWines: WineProduct[] = [
  {
    id: '1',
    name: 'Cabernet Sauvignon',
    vintage: 2022,
    category: 'Červené',
    variety: 'Cabernet Sauvignon',
    price: 15.99,
    stock: 42,
    vineyard: 'Vinárstvo Pútec',
    status: 'active'
  },
  {
    id: '2',
    name: 'Chardonnay',
    vintage: 2023,
    category: 'Biele',
    variety: 'Chardonnay',
    price: 12.99,
    stock: 28,
    vineyard: 'Vinárstvo Pútec',
    status: 'active'
  },
  {
    id: '3',
    name: 'Frankovka Modrá',
    vintage: 2021,
    category: 'Červené',
    variety: 'Frankovka Modrá',
    price: 14.50,
    stock: 15,
    vineyard: 'Vinárstvo Pútec',
    status: 'active'
  },
  {
    id: '4',
    name: 'Rizling Rýnsky',
    vintage: 2022,
    category: 'Biele',
    variety: 'Rizling Rýnsky',
    price: 13.99,
    stock: 33,
    vineyard: 'Vinárstvo Pútec',
    status: 'active'
  },
  {
    id: '5',
    name: 'Svätovavrinecké',
    vintage: 2020,
    category: 'Červené',
    variety: 'Svätovavrinecké',
    price: 16.50,
    stock: 5,
    vineyard: 'Vinárstvo Pútec',
    status: 'low_stock'
  },
  {
    id: '6',
    name: 'Tramín Červený',
    vintage: 2023,
    category: 'Biele',
    variety: 'Tramín Červený',
    price: 18.99,
    stock: 0,
    vineyard: 'Vinárstvo Pútec',
    status: 'out_of_stock'
  },
]

export default function ProductsPage() {
  const [wines, setWines] = useState(mockWines)
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedWine, setSelectedWine] = useState<WineProduct | null>(null)
  
  const filteredWines = wines.filter(wine => 
    wine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wine.variety.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const handleEdit = (wine: WineProduct) => {
    setSelectedWine(wine)
    setOpenDialog(true)
  }
  
  const handleDelete = (id: string) => {
    if (confirm('Naozaj chcete odstrániť tento produkt?')) {
      setWines(wines.filter(wine => wine.id !== id))
    }
  }
  
  const handleAddNew = () => {
    setSelectedWine(null)
    setOpenDialog(true)
  }
  
  const handleSave = (formData: Partial<WineProduct>) => {
    if (selectedWine) {
      // Update existing wine
      setWines(wines.map(wine => 
        wine.id === selectedWine.id ? { ...wine, ...formData } : wine
      ))
    } else {
      // Add new wine
      const newWine = {
        id: (wines.length + 1).toString(),
        ...formData,
        status: formData.stock && formData.stock > 10 ? 'active' : formData.stock && formData.stock > 0 ? 'low_stock' : 'out_of_stock'
      } as WineProduct
      setWines([...wines, newWine])
    }
    setOpenDialog(false)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Správa produktov</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Pridať nový produkt
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Produkty</CardTitle>
          <CardDescription>
            Spravujte váš katalóg vín a sledujte stav zásob
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
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Kategória" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všetky kategórie</SelectItem>
                  <SelectItem value="cervene">Červené vína</SelectItem>
                  <SelectItem value="biele">Biele vína</SelectItem>
                  <SelectItem value="ruzove">Ružové vína</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filtre
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Foto</TableHead>
                  <TableHead className="min-w-[150px]">Názov</TableHead>
                  <TableHead>Ročník</TableHead>
                  <TableHead>Kategória</TableHead>
                  <TableHead>Odroda</TableHead>
                  <TableHead className="text-right">Cena</TableHead>
                  <TableHead className="text-right">Skladom</TableHead>
                  <TableHead className="text-right">Stav</TableHead>
                  <TableHead className="text-right">Akcie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Nenašli sa žiadne produkty
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWines.map((wine) => (
                    <TableRow key={wine.id}>
                      <TableCell>
                        <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                          {wine.image ? (
                            <Image
                              src={wine.image}
                              alt={wine.name}
                              width={48}
                              height={48}
                              className="rounded-md object-cover"
                            />
                          ) : (
                            <Wine className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{wine.name}</TableCell>
                      <TableCell>{wine.vintage}</TableCell>
                      <TableCell>{wine.category}</TableCell>
                      <TableCell>{wine.variety}</TableCell>
                      <TableCell className="text-right">{wine.price.toFixed(2)} €</TableCell>
                      <TableCell className="text-right">{wine.stock}</TableCell>
                      <TableCell className="text-right">
                        {wine.status === 'active' && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aktívny</Badge>
                        )}
                        {wine.status === 'low_stock' && (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Nízky stav</Badge>
                        )}
                        {wine.status === 'out_of_stock' && (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Vypredané</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(wine)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Upraviť</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(wine.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Odstrániť</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <ProductDialog 
        open={openDialog} 
        onOpenChange={setOpenDialog}
        wine={selectedWine}
        onSave={handleSave}
      />
    </div>
  )
}

function ProductDialog({ 
  open, 
  onOpenChange, 
  wine, 
  onSave 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  wine: WineProduct | null,
  onSave: (formData: Partial<WineProduct>) => void
}) {
  const [formData, setFormData] = useState<Partial<WineProduct>>({
    name: wine?.name || '',
    vintage: wine?.vintage || new Date().getFullYear(),
    category: wine?.category || 'Červené',
    variety: wine?.variety || '',
    price: wine?.price || 0,
    stock: wine?.stock || 0,
    vineyard: wine?.vineyard || 'Vinárstvo Pútec',
    description: wine?.description || '',
    images: wine?.images || []
  })
  
  const handleChange = (field: keyof WineProduct, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }
  
  const handleImageUpload = (url: string) => {
    const newImages = formData.images ? [...formData.images] : []
    newImages.push({
      url,
      is_primary: newImages.length === 0
    })
    setFormData({
      ...formData,
      images: newImages
    })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{wine ? 'Upraviť produkt' : 'Pridať nový produkt'}</DialogTitle>
          <DialogDescription>
            {wine 
              ? 'Upravte detaily existujúceho produktu' 
              : 'Vyplňte informácie o novom produkte'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Názov vína</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vintage">Ročník</Label>
                <Input
                  id="vintage"
                  type="number"
                  value={formData.vintage}
                  onChange={(e) => handleChange('vintage', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategória</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte kategóriu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Červené">Červené</SelectItem>
                    <SelectItem value="Biele">Biele</SelectItem>
                    <SelectItem value="Ružové">Ružové</SelectItem>
                    <SelectItem value="Šumivé">Šumivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="variety">Odroda</Label>
                <Input
                  id="variety"
                  value={formData.variety}
                  onChange={(e) => handleChange('variety', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Cena (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Skladom (ks)</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vineyard">Vinárstvo</Label>
              <Input
                id="vineyard"
                value={formData.vineyard}
                onChange={(e) => handleChange('vineyard', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Popis</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Fotografie</Label>
              <div className="grid grid-cols-4 gap-4">
                {formData.images && formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                    <Image 
                      src={image.url} 
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => {
                        const newImages = [...(Array.isArray(formData.images) ? formData.images : [])]
                        newImages.splice(index, 1)
                        setFormData({
                          ...formData,
                          images: newImages
                        })
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <ImageUpload
                  onUploadComplete={(urls) => handleImageUpload(urls[0])}
                  maxFiles={1}
                  bucket="images"
                  folder="products"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Zrušiť
            </Button>
            <Button type="submit">
              {wine ? 'Uložiť zmeny' : 'Pridať produkt'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
