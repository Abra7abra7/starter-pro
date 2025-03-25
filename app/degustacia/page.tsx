"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Wine, Users, Clock, Euro, Loader2 } from 'lucide-react'
import { type SelectSingleEventHandler } from 'react-day-picker'
import { useRouter } from 'next/navigation'

// Typy degustácií
interface TastingType {
  id: string;
  name: string;
  description: string;
  duration: number; // v minútach
  price: number;
  capacity: number;
  image: string;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

interface TimeOption {
  value: string;
  label: string;
}

// Vzorové dáta degustácií
const tastingOptions: TastingType[] = [
  {
    id: 'basic',
    name: 'Základná degustácia',
    description: 'Ochutnávka 6 druhov vín s odborným výkladom a malým občerstvením (syr, chlieb, voda).',
    duration: 90,
    price: 25,
    capacity: 15,
    image: '/tastings/basic.jpg'
  },
  {
    id: 'premium',
    name: 'Prémiová degustácia',
    description: 'Ochutnávka 8 druhov vín vrátane prémiových ročníkov s odborným výkladom, prehliadkou pivnice a bohatým občerstvením.',
    duration: 120,
    price: 39,
    capacity: 12,
    image: '/tastings/premium.jpg'
  },
  {
    id: 'exclusive',
    name: 'Exkluzívna degustácia',
    description: 'VIP ochutnávka 10 druhov vín vrátane archívnych a limitovaných edícií s osobným prístupom majiteľa vinárstva a kompletným menu.',
    duration: 180,
    price: 69,
    capacity: 8,
    image: '/tastings/exclusive.jpg'
  }
]

// Dostupné termíny (simulované)
const availableDates = [
  new Date(2025, 3, 26, 14, 0), // 26.4.2025 14:00
  new Date(2025, 3, 26, 18, 0), // 26.4.2025 18:00
  new Date(2025, 3, 27, 15, 0), // 27.4.2025 15:00
  new Date(2025, 3, 28, 16, 0), // 28.4.2025 16:00
  new Date(2025, 4, 3, 14, 0),  // 3.5.2025 14:00
  new Date(2025, 4, 4, 15, 0),  // 4.5.2025 15:00
  new Date(2025, 4, 10, 14, 0), // 10.5.2025 14:00
  new Date(2025, 4, 11, 16, 0), // 11.5.2025 16:00
  new Date(2025, 4, 17, 15, 0), // 17.5.2025 15:00
  new Date(2025, 4, 18, 14, 0), // 18.5.2025 14:00
]

export default function DegustaciaPage() {
  const [selectedTasting, setSelectedTasting] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [personCount, setPersonCount] = useState(2)
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  // Filtrovanie dostupných časov pre vybraný dátum
  const availableTimes: TimeOption[] = selectedDate 
    ? availableDates
        .filter(date => 
          date.getDate() === selectedDate.getDate() && 
          date.getMonth() === selectedDate.getMonth() &&
          date.getFullYear() === selectedDate.getFullYear()
        )
        .map(date => ({
          value: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`,
          label: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
        }))
    : []
  
  // Výpočet celkovej ceny
  const calculateTotal = () => {
    if (!selectedTasting) return 0
    const tasting = tastingOptions.find(t => t.id === selectedTasting)
    if (!tasting) return 0
    return tasting.price * personCount
  }
  
  // Kontrola, či sú vyplnené všetky potrebné údaje
  const isFormComplete = () => {
    return (
      selectedTasting && 
      selectedDate && 
      selectedTime && 
      personCount > 0 &&
      contactInfo.name.trim() !== '' &&
      contactInfo.email.trim() !== '' &&
      contactInfo.phone.trim() !== ''
    )
  }
  
  const handleDateSelect: SelectSingleEventHandler = (day) => {
    setSelectedDate(day);
  };
  
  // Spracovanie rezervácie a platby
  const handleReservation = async () => {
    if (!isFormComplete()) return;
    
    try {
      setIsLoading(true);
      
      const selectedTastingDetails = tastingOptions.find(t => t.id === selectedTasting);
      if (!selectedTastingDetails) {
        throw new Error('Vybraná degustácia nebola nájdená');
      }
      
      // Call our API route to create a Stripe checkout session
      const response = await fetch('/api/tasting-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tastingId: selectedTastingDetails.id,
          tastingName: selectedTastingDetails.name,
          price: selectedTastingDetails.price,
          personCount,
          date: selectedDate?.toISOString(),
          time: selectedTime,
          contactInfo
        }),
      });
      
      const { url, error } = await response.json();
      
      if (error) {
        console.error('Error creating checkout session:', error);
        alert('Nastala chyba pri spracovaní platby. Skúste to prosím znova.');
        setIsLoading(false);
        return;
      }
      
      // Redirect to Stripe Checkout
      if (url) {
        router.push(url);
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      alert('Nastala chyba pri presmerovaní na platobnú bránu. Skúste to prosím znova.');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-amber-900 mb-2">Rezervácia degustácie</h1>
      <p className="text-lg text-amber-800 mb-8">Zažite jedinečnú ochutnávku našich vín priamo vo vinárstve Putec</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Vyberte typ degustácie</CardTitle>
              <CardDescription>Ponúkame rôzne druhy degustácií podľa vašich preferencií</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedTasting || ''} onValueChange={setSelectedTasting}>
                {tastingOptions.map(option => (
                  <div key={option.id} className="flex items-start space-x-4 mb-4">
                    <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                    <div className="grid gap-1.5 leading-none w-full">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={option.id} className="text-lg font-medium">{option.name}</Label>
                        <span className="font-bold text-amber-800">{option.price} € / osoba</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{option.duration} minút</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>Max. {option.capacity} osôb</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wine size={16} />
                          <span>{option.id === 'basic' ? '6 vín' : option.id === 'premium' ? '8 vín' : '10 vín'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Vyberte termín</CardTitle>
              <CardDescription>Dostupné termíny pre vašu degustáciu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label>Dátum</Label>
                  <div className="mt-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className="border rounded-md p-2"
                      disabled={(date) => {
                        // Disable dates that don't have any available times
                        return !availableDates.some(
                          availableDate => 
                            availableDate.getDate() === date.getDate() && 
                            availableDate.getMonth() === date.getMonth() &&
                            availableDate.getFullYear() === date.getFullYear()
                        )
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Čas</Label>
                    <Select 
                      disabled={!selectedDate || availableTimes.length === 0} 
                      value={selectedTime || ''} 
                      onValueChange={setSelectedTime}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Vyberte čas" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map(time => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Počet osôb</Label>
                    <div className="flex items-center mt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setPersonCount(Math.max(1, personCount - 1))}
                      >
                        -
                      </Button>
                      <span className="mx-4 w-8 text-center">{personCount}</span>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const maxCapacity = selectedTasting 
                            ? tastingOptions.find(t => t.id === selectedTasting)?.capacity || 15
                            : 15
                          setPersonCount(Math.min(maxCapacity, personCount + 1))
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Kontaktné údaje</CardTitle>
              <CardDescription>Zadajte vaše kontaktné údaje pre rezerváciu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Meno a priezvisko</Label>
                  <Input 
                    id="name" 
                    value={contactInfo.name} 
                    onChange={e => setContactInfo({...contactInfo, name: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={contactInfo.email} 
                    onChange={e => setContactInfo({...contactInfo, email: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefón</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={contactInfo.phone} 
                    onChange={e => setContactInfo({...contactInfo, phone: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Vaša rezervácia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedTasting ? (
                  <div>
                    <h3 className="font-medium">Typ degustácie</h3>
                    <p>{tastingOptions.find(t => t.id === selectedTasting)?.name}</p>
                  </div>
                ) : (
                  <div className="text-muted-foreground">Vyberte typ degustácie</div>
                )}
                
                <Separator />
                
                {selectedDate && selectedTime ? (
                  <div>
                    <h3 className="font-medium">Termín</h3>
                    <p>
                      {selectedDate.toLocaleDateString('sk-SK', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                      {' o '}{selectedTime}
                    </p>
                  </div>
                ) : (
                  <div className="text-muted-foreground">Vyberte termín</div>
                )}
                
                <Separator />
                
                <div>
                  <h3 className="font-medium">Počet osôb</h3>
                  <p>{personCount}</p>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-center font-medium">
                    <span>Cena za osobu:</span>
                    <span>
                      {selectedTasting 
                        ? `${tastingOptions.find(t => t.id === selectedTasting)?.price} €` 
                        : '0 €'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-medium">
                    <span>Počet osôb:</span>
                    <span>{personCount}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Celková suma:</span>
                    <span className="text-amber-800">{calculateTotal()} €</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-amber-700 hover:bg-amber-800"
                disabled={!isFormComplete() || isLoading}
                onClick={handleReservation}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Presmerovanie na platbu...
                  </>
                ) : (
                  <>
                    Rezervovať a zaplatiť
                    <Euro className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
