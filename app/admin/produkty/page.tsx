"use client"

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ChevronDown,
  Wine,
  Image as ImageIcon
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/ui/image-upload'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'

// Mock data - would be replaced with real data from Supabase
const mockWines = [
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
  const [selectedWine, setSelectedWine] = useState<any>(null)
  
  const filteredWines = wines.filter(wine => 
    wine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wine.variety.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const handleEdit = (wine: any) => {
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
  
  const handleSave = (formData: any) => {
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
        status: formData.stock > 10 ? 'active' : formData.stock > 0 ? 'low_stock' : 'out_of_stock'
      }
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filtrovať podľa</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Všetky produkty</DropdownMenuItem>
                <DropdownMenuItem>Červené vína</DropdownMenuItem>
                <DropdownMenuItem>Biele vína</DropdownMenuItem>
                <DropdownMenuItem>Nízky stav zásob</DropdownMenuItem>
                <DropdownMenuItem>Vypredané</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produkt</TableHead>
                  <TableHead>Kategória</TableHead>
                  <TableHead>Cena (€)</TableHead>
                  <TableHead>Stav zásob</TableHead>
                  <TableHead className="text-right">Akcie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWines.length > 0 ? (
                  filteredWines.map((wine) => (
                    <TableRow key={wine.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded bg-amber-100 flex items-center justify-center">
                            <Wine className="h-5 w-5 text-amber-700" />
                          </div>
                          <div>
                            <div>{wine.name} {wine.vintage}</div>
                            <div className="text-sm text-muted-foreground">{wine.variety}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{wine.category}</TableCell>
                      <TableCell>{wine.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {wine.status === 'active' && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Na sklade: {wine.stock}
                          </Badge>
                        )}
                        {wine.status === 'low_stock' && (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            Nízky stav: {wine.stock}
                          </Badge>
                        )}
                        {wine.status === 'out_of_stock' && (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            Vypredané
                          </Badge>
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
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Nenašli sa žiadne produkty
                    </TableCell>
                  </TableRow>
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
  wine: any | null,
  onSave: (formData: any) => void
}) {
  const [formData, setFormData] = useState({
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

  const handleImageUpload = (urls: string[]) => {
    const newImages = urls.map((url, index) => ({
      url,
      alt_text: `${formData.name} ${index + 1}`,
      is_primary: index === 0 && formData.images.length === 0
    }))
    
    handleChange('images', [...formData.images, ...newImages])
  }

  const removeImage = (indexToRemove: number) => {
    const updatedImages = formData.images.filter((_, index: number) => index !== indexToRemove)
    
    // If we removed the primary image, make the first remaining image primary
    if (formData.images[indexToRemove].is_primary && updatedImages.length > 0) {
      updatedImages[0].is_primary = true
    }
    
    handleChange('images', updatedImages)
  }

  const setPrimaryImage = (indexToSetPrimary: number) => {
    const updatedImages = formData.images.map((image: any, index: number) => ({
      ...image,
      is_primary: index === indexToSetPrimary
    }))
    
    handleChange('images', updatedImages)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{wine ? 'Upraviť produkt' : 'Pridať nový produkt'}</DialogTitle>
            <DialogDescription>
              {wine 
                ? 'Upravte detaily existujúceho produktu' 
                : 'Vyplňte formulár pre pridanie nového produktu do katalógu'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
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
                <Label htmlFor="stock">Stav zásob</Label>
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
              <Label htmlFor="description">Popis</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <ImageIcon className="mr-2 h-5 w-5" />
                <h3 className="text-lg font-medium">Obrázky produktu</h3>
              </div>
              
              {formData.images.length > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((image: any, index: number) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square relative rounded-md overflow-hidden border border-gray-200">
                          <Image 
                            src={image.url} 
                            alt={image.alt_text || `Obrázok ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {image.is_primary && (
                            <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                              Hlavný
                            </div>
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 flex space-x-1">
                          {!image.is_primary && (
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(index)}
                              className="bg-amber-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Nastaviť ako hlavný"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Odstrániť obrázok"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <ImageUpload 
                onUploadComplete={handleImageUpload}
                maxFiles={5}
                bucket="wine-images"
                folder="products"
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
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
