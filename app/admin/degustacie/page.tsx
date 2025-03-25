"use client"

import { useState } from 'react'
import { 
  Search, 
  Plus, 
  Calendar, 
  Users, 
  MapPin,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ImageIcon
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
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/ui/image-upload'
import Image from 'next/image'

// Define TypeScript interfaces for our data
interface Wine {
  id: string;
  name: string;
  tastingOrder: number;
}

interface Event {
  id: string;
  title: string;
  eventType: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxAttendees: number;
  currentAttendees: number;
  price: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  isPrivate: boolean;
  imageUrl: string;
  wines: Wine[];
}

interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  registrationDate: string;
  numberOfGuests: number;
  status: string;
  paymentStatus: string;
  totalPrice: number;
}

// Define interfaces for form data
interface ImageData {
  url: string;
  alt_text: string;
  is_primary: boolean;
}

interface EventFormData {
  title: string;
  eventType: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxAttendees: number;
  price: number;
  status: string;
  isPrivate: boolean;
  imageUrl: string;
  images: ImageData[];
}

// Mock data for events
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Jarná degustácia',
    eventType: 'Degustácia',
    description: 'Ochutnávka jarných vín z našej produkcie',
    startTime: '2025-04-15T18:00:00Z',
    endTime: '2025-04-15T21:00:00Z',
    location: 'Vinárstvo Pútec, Hlavná 123, Bratislava',
    maxAttendees: 30,
    currentAttendees: 12,
    price: 25.00,
    status: 'scheduled',
    isPrivate: false,
    imageUrl: '/images/events/spring-tasting.jpg',
    wines: [
      { id: '1', name: 'Cabernet Sauvignon 2022', tastingOrder: 1 },
      { id: '2', name: 'Chardonnay 2023', tastingOrder: 2 },
      { id: '4', name: 'Rizling Rýnsky 2022', tastingOrder: 3 }
    ]
  },
  {
    id: '2',
    title: 'Víkendový workshop výroby vína',
    eventType: 'Workshop',
    description: 'Naučte sa základy výroby vína priamo v našom vinárstve',
    startTime: '2025-05-10T10:00:00Z',
    endTime: '2025-05-11T16:00:00Z',
    location: 'Vinárstvo Pútec, Hlavná 123, Bratislava',
    maxAttendees: 15,
    currentAttendees: 8,
    price: 120.00,
    status: 'scheduled',
    isPrivate: false,
    imageUrl: '/images/events/wine-workshop.jpg',
    wines: [
      { id: '1', name: 'Cabernet Sauvignon 2022', tastingOrder: 1 },
      { id: '3', name: 'Frankovka Modrá 2021', tastingOrder: 2 },
      { id: '5', name: 'Svätovavrinecké 2020', tastingOrder: 3 }
    ]
  },
  {
    id: '3',
    title: 'Privátna degustácia pre firmu XYZ',
    eventType: 'Privátna degustácia',
    description: 'Uzavretá degustácia pre zamestnancov firmy XYZ',
    startTime: '2025-04-05T19:00:00Z',
    endTime: '2025-04-05T22:00:00Z',
    location: 'Vinárstvo Pútec, Hlavná 123, Bratislava',
    maxAttendees: 20,
    currentAttendees: 20,
    price: 35.00,
    status: 'scheduled',
    isPrivate: true,
    imageUrl: '/images/events/private-tasting.jpg',
    wines: [
      { id: '2', name: 'Chardonnay 2023', tastingOrder: 1 },
      { id: '6', name: 'Tramín Červený 2023', tastingOrder: 2 },
      { id: '4', name: 'Rizling Rýnsky 2022', tastingOrder: 3 }
    ]
  },
  {
    id: '4',
    title: 'Ochutnávka archívnych vín',
    eventType: 'Degustácia',
    description: 'Exkluzívna ochutnávka archívnych vín z našej pivnice',
    startTime: '2025-03-20T18:00:00Z',
    endTime: '2025-03-20T21:00:00Z',
    location: 'Vinárstvo Pútec, Hlavná 123, Bratislava',
    maxAttendees: 25,
    currentAttendees: 25,
    price: 50.00,
    status: 'completed',
    isPrivate: false,
    imageUrl: '/images/events/archive-tasting.jpg',
    wines: [
      { id: '5', name: 'Svätovavrinecké 2020', tastingOrder: 1 },
      { id: '1', name: 'Cabernet Sauvignon 2022', tastingOrder: 2 }
    ]
  }
]

// Mock data for registrations
const mockRegistrations: Registration[] = [
  {
    id: '1',
    eventId: '1',
    eventTitle: 'Jarná degustácia',
    customerId: '1',
    customerName: 'Ján Novák',
    email: 'jan.novak@example.com',
    phone: '+421 900 123 456',
    registrationDate: '2025-03-15T10:30:00Z',
    numberOfGuests: 2,
    status: 'registered',
    paymentStatus: 'paid',
    totalPrice: 50.00
  }
]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [registrations] = useState<Registration[]>(mockRegistrations)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [activeTab, setActiveTab] = useState('events')
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || 
      event.status === statusFilter
    
    return matchesSearch && matchesStatus
  })
  
  const handleAddEvent = () => {
    setSelectedEvent(null)
    setOpenDialog(true)
  }
  
  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setOpenDialog(true)
  }
  
  const handleDeleteEvent = (id: string) => {
    if (confirm('Naozaj chcete odstrániť túto udalosť?')) {
      setEvents(events.filter(event => event.id !== id))
    }
  }
  
  const handleSaveEvent = (formData: Event) => {
    if (selectedEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === selectedEvent.id ? { ...event, ...formData } : event
      ))
    } else {
      // Add new event
      const newEvent: Event = {
        id: (events.length + 1).toString(),
        ...formData,
        currentAttendees: 0,
        status: 'scheduled',
        wines: []
      }
      setEvents([...events, newEvent])
    }
    setOpenDialog(false)
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Calendar className="h-3 w-3 mr-1" />
            Naplánované
          </Badge>
        )
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ukončené
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
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('sk-SK', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Degustácie a udalosti</h1>
        <Button onClick={handleAddEvent} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Vytvoriť novú udalosť
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Udalosti</TabsTrigger>
          <TabsTrigger value="registrations">Registrácie</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Správa udalostí</CardTitle>
              <CardDescription>
                Prehľad všetkých degustácií a udalostí
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Vyhľadať udalosť..."
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
                    <SelectValue placeholder="Stav udalosti" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Všetky stavy</SelectItem>
                    <SelectItem value="scheduled">Naplánované</SelectItem>
                    <SelectItem value="completed">Ukončené</SelectItem>
                    <SelectItem value="cancelled">Zrušené</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Názov</TableHead>
                      <TableHead>Dátum</TableHead>
                      <TableHead>Miesto</TableHead>
                      <TableHead>Účastníci</TableHead>
                      <TableHead>Stav</TableHead>
                      <TableHead className="text-right">Akcie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{event.title}</div>
                              <div className="text-sm text-muted-foreground">{event.eventType}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{formatDate(event.startTime)}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="truncate max-w-[200px]">{event.location}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{event.currentAttendees}/{event.maxAttendees}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(event.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditEvent(event)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Upraviť</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteEvent(event.id)}
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
                          Nenašli sa žiadne udalosti
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="registrations" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Registrácie na udalosti</CardTitle>
              <CardDescription>
                Prehľad všetkých registrácií zákazníkov
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zákazník</TableHead>
                      <TableHead>Udalosť</TableHead>
                      <TableHead>Dátum registrácie</TableHead>
                      <TableHead>Počet osôb</TableHead>
                      <TableHead>Stav platby</TableHead>
                      <TableHead className="text-right">Suma (€)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{registration.customerName}</div>
                            <div className="text-sm text-muted-foreground">{registration.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{registration.eventTitle}</TableCell>
                        <TableCell>{formatDateTime(registration.registrationDate)}</TableCell>
                        <TableCell>{registration.numberOfGuests}</TableCell>
                        <TableCell>
                          {registration.paymentStatus === 'paid' ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              Zaplatené
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                              Čaká na platbu
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {registration.totalPrice.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <EventDialog 
        open={openDialog} 
        onOpenChange={setOpenDialog}
        event={selectedEvent}
        onSave={handleSaveEvent}
      />
    </div>
  )
}

function EventDialog({ 
  open, 
  onOpenChange, 
  event, 
  onSave 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  event: Event | null,
  onSave: (formData: Event) => void
}) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    eventType: event?.eventType || 'Degustácia',
    description: event?.description || '',
    startTime: event?.startTime ? new Date(event.startTime).toISOString().slice(0, 16) : '',
    endTime: event?.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : '',
    location: event?.location || 'Vinárstvo Pútec, Hlavná 123, Bratislava',
    maxAttendees: event?.maxAttendees || 30,
    price: event?.price || 25.00,
    isPrivate: event?.isPrivate || false,
    images: event?.images || []
  })
  
  const handleChange = (field: keyof typeof formData, value: string | number | boolean | Array<{url: string, alt_text: string, is_primary: boolean}>) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Event)
  }

  const handleImageUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData({
        ...formData,
        imageUrl: urls[0]
      })
    }
  }

  const removeImage = (indexToRemove: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, index: number) => index !== indexToRemove)
    })
  }

  const setPrimaryImage = (indexToSetPrimary: number) => {
    const updatedImages = formData.images.map((image, index) => ({
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
            <DialogTitle>{event ? 'Upraviť udalosť' : 'Vytvoriť novú udalosť'}</DialogTitle>
            <DialogDescription>
              {event 
                ? 'Upravte detaily existujúcej udalosti' 
                : 'Vyplňte formulár pre vytvorenie novej udalosti'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Názov udalosti</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventType">Typ udalosti</Label>
                <Select 
                  value={formData.eventType} 
                  onValueChange={(value) => handleChange('eventType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte typ udalosti" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Degustácia">Degustácia</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Privátna degustácia">Privátna degustácia</SelectItem>
                    <SelectItem value="Festival">Festival</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Popis</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Začiatok</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">Koniec</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Miesto konania</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Maximálny počet účastníkov</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  min="1"
                  value={formData.maxAttendees}
                  onChange={(e) => handleChange('maxAttendees', parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Cena na osobu (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPrivate"
                checked={formData.isPrivate}
                onChange={(e) => handleChange('isPrivate', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isPrivate">Privátna udalosť (nebude zobrazená verejne)</Label>
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-center">
                <ImageIcon className="mr-2 h-5 w-5" />
                <h3 className="text-lg font-medium">Obrázky udalosti</h3>
              </div>
              
              {formData.images.length > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
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
                bucket="tasting-images"
                folder="events"
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Zrušiť
            </Button>
            <Button type="submit">
              {event ? 'Uložiť zmeny' : 'Vytvoriť udalosť'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
