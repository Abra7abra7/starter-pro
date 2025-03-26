"use client"

import { useState, useEffect } from 'react'
import { Search, Eye, Users, Plus, Mail, Phone } from 'lucide-react'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/utils/supabase/client'

// Initialize Supabase client
const supabase = createClient()

// Types for tasting data
interface CustomerDisplay {
  name: string
  email: string
  phone: string
}

interface Registration {
  id: string
  customer_id: string
  num_guests: number
  total_amount: number
  created_at: string
  customer: CustomerDisplay
}

interface TastingSession {
  id: string
  title: string
  description: string
  date: string
  max_participants: number
  price: number
  location: string
  created_at: string
  registrations: Registration[]
  total_registrations: number
  total_revenue: number
}

interface TastingFormData {
  title: string
  description: string
  date: string
  max_participants: number
  price: number
  location: string
}

export default function TastingsPage() {
  const [tastings, setTastings] = useState<TastingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTasting, setSelectedTasting] = useState<TastingSession | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState<TastingFormData>({
    title: '',
    description: '',
    date: '',
    max_participants: 20,
    price: 0,
    location: ''
  })

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('tastings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasting_sessions'
        },
        () => {
          fetchTastings() // Refresh data when changes occur
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchTastings()
  }, [])

  const fetchTastings = async () => {
    try {
      setLoading(true)
      const { data, error: supabaseError } = await supabase
        .from('tasting_sessions')
        .select(`
          id,
          title,
          description,
          date,
          max_participants,
          price,
          location,
          created_at,
          registrations!left (
            id,
            customer_id,
            num_guests,
            total_amount,
            created_at,
            customer:customers!left (
              first_name,
              last_name,
              email,
              phone
            )
          )
        `)
        .order('date', { ascending: true })

      if (supabaseError) throw supabaseError

      if (!data) {
        throw new Error('No tastings data received')
      }

      // Process tasting data to include total registrations and revenue
      const processedTastings: TastingSession[] = data.map(tasting => {
        type RawCustomer = {
          first_name: string
          last_name: string
          email: string
          phone: string
        }

        type RawRegistration = {
          id: string
          customer_id: string
          num_guests: number
          total_amount: number
          created_at: string
          customer: RawCustomer
        }

        // Transform registrations to match our display format
        const registrations: Registration[] = ((tasting.registrations || []) as unknown as RawRegistration[]).map(reg => ({
          id: reg.id,
          customer_id: reg.customer_id,
          num_guests: reg.num_guests,
          total_amount: reg.total_amount,
          created_at: reg.created_at,
          customer: reg.customer ? {
            name: `${reg.customer.first_name} ${reg.customer.last_name}`,
            email: reg.customer.email,
            phone: reg.customer.phone
          } : {
            name: 'Neznámy zákazník',
            email: '',
            phone: ''
          }
        }))

        return {
          ...tasting,
          registrations,
          total_registrations: registrations.reduce((sum, reg) => sum + reg.num_guests, 0),
          total_revenue: registrations.reduce((sum, reg) => sum + reg.total_amount, 0)
        }
      })

      setTastings(processedTastings)
    } catch (error) {
      console.error('Error fetching tastings:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching tastings')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTasting = async () => {
    try {
      const { error } = await supabase
        .from('tasting_sessions')
        .insert([{
          title: formData.title,
          description: formData.description,
          date: formData.date,
          max_participants: formData.max_participants,
          price: formData.price,
          location: formData.location
        }])

      if (error) throw error

      setIsAddDialogOpen(false)
      setFormData({
        title: '',
        description: '',
        date: '',
        max_participants: 20,
        price: 0,
        location: ''
      })
      await fetchTastings()
    } catch (error) {
      console.error('Error adding tasting:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while adding the tasting')
    }
  }

  const filteredTastings = tastings.filter(tasting =>
    tasting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tasting.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="flex justify-center items-center h-[80vh]">Načítavam...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h2 className="text-lg font-bold">Error:</h2>
        <p>{error}</p>
        <Button onClick={fetchTastings} className="mt-4">Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Degustácie</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Pridať degustáciu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pridať novú degustáciu</DialogTitle>
              <DialogDescription>
                Vyplňte údaje o novej degustácii. Všetky polia označené * sú povinné.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Názov *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Popis</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Dátum a čas *</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_participants">Maximálny počet účastníkov *</Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="1"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Cena na osobu *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Miesto konania *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Zrušiť
              </Button>
              <Button onClick={handleAddTasting}>
                Pridať degustáciu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zoznam degustácií</CardTitle>
          <CardDescription>
            Správa všetkých degustácií v systéme
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Hľadať podľa názvu alebo miesta konania..."
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
                <TableHead>Názov</TableHead>
                <TableHead>Dátum</TableHead>
                <TableHead>Miesto</TableHead>
                <TableHead>Registrácie</TableHead>
                <TableHead>Tržba</TableHead>
                <TableHead>Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTastings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                    {searchQuery ? 'Nenašli sa žiadne degustácie' : 'Zatiaľ nie sú vytvorené žiadne degustácie'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTastings.map((tasting) => (
                <TableRow key={tasting.id}>
                  <TableCell className="font-medium">{tasting.title}</TableCell>
                  <TableCell>
                    {new Date(tasting.date).toLocaleDateString('sk-SK', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>{tasting.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {tasting.total_registrations} / {tasting.max_participants}
                    </div>
                  </TableCell>
                  <TableCell>€{tasting.total_revenue.toLocaleString('sk-SK', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedTasting(tasting)
                        setIsDetailsDialogOpen(true)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tasting Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail degustácie</DialogTitle>
            <DialogDescription>
              Kompletné informácie o degustácii a registrovaných účastníkoch
            </DialogDescription>
          </DialogHeader>
          {selectedTasting && (
            <div className="grid gap-6">
              {/* Tasting Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Informácie o degustácii</h3>
                <div className="grid gap-4">
                  <div className="flex items-center">
                    <div className="w-32 text-sm text-muted-foreground">Názov</div>
                    <div className="font-medium">{selectedTasting.title}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-32 text-sm text-muted-foreground">Popis</div>
                    <div className="font-medium">{selectedTasting.description}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 text-sm text-muted-foreground">Dátum a čas</div>
                    <div className="font-medium">
                      {new Date(selectedTasting.date).toLocaleDateString('sk-SK', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 text-sm text-muted-foreground">Miesto</div>
                    <div className="font-medium">{selectedTasting.location}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 text-sm text-muted-foreground">Kapacita</div>
                    <div className="font-medium">{selectedTasting.max_participants} osôb</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 text-sm text-muted-foreground">Cena</div>
                    <div className="font-medium">€{selectedTasting.price.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} / osoba</div>
                  </div>
                </div>
              </div>

              {/* Registration List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Zoznam registrácií</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meno</TableHead>
                      <TableHead>Kontakt</TableHead>
                      <TableHead>Počet osôb</TableHead>
                      <TableHead>Suma</TableHead>
                      <TableHead>Dátum registrácie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTasting.registrations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                          Zatiaľ nie sú žiadne registrácie
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedTasting.registrations
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell className="font-medium">{registration.customer.name}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 mr-2" />
                                {registration.customer.email}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 mr-2" />
                                {registration.customer.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{registration.num_guests}</TableCell>
                          <TableCell>€{registration.total_amount.toLocaleString('sk-SK', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell>
                            {new Date(registration.created_at).toLocaleDateString('sk-SK', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                        </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </div>

              {/* Tasting Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Obsadenosť
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedTasting.total_registrations} / {selectedTasting.max_participants}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {((selectedTasting.total_registrations / selectedTasting.max_participants) * 100).toFixed(0)}% kapacity
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Celková tržba
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      €{selectedTasting.total_revenue.toLocaleString('sk-SK', { minimumFractionDigits: 2 })}
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
