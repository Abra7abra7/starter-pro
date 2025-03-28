"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Wine, Users, Clock, Euro, Loader2, CalendarDays, UserRound, CreditCard } from 'lucide-react'
import { type SelectSingleEventHandler } from 'react-day-picker'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// Types
interface TastingType {
  id: string;
  name: string;
  description: string;
  duration: number;
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

// Sample data
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

// Available dates (simulated)
const availableDates = [
  new Date(2025, 3, 26, 14, 0),
  new Date(2025, 3, 26, 18, 0),
  new Date(2025, 3, 27, 15, 0),
  new Date(2025, 3, 28, 16, 0),
  new Date(2025, 4, 3, 14, 0),
  new Date(2025, 4, 4, 15, 0),
  new Date(2025, 4, 10, 14, 0),
  new Date(2025, 4, 11, 16, 0),
  new Date(2025, 4, 17, 15, 0),
  new Date(2025, 4, 18, 14, 0),
]

// Step indicator component
function StepIndicator({ step, currentStep, icon, title }: { 
  step: number; 
  currentStep: number; 
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1 md:mb-2 relative z-10
          ${step === currentStep 
            ? 'bg-amber-600 text-white' 
            : step < currentStep 
              ? 'bg-amber-200 text-amber-700' 
              : 'bg-gray-100 text-gray-400'
          }`}
      >
        <div className="scale-75 md:scale-100">
          {icon}
        </div>
      </div>
      <span className={`text-xs md:text-sm ${step === currentStep ? 'text-amber-800 font-medium' : 'text-gray-500'} hidden md:block`}>
        {title}
      </span>
    </div>
  )
}

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
  
  // Calculate current step
  const getCurrentStep = () => {
    if (!selectedTasting) return 1
    if (!selectedDate || !selectedTime) return 2
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) return 3
    return 4
  }
  
  const currentStep = getCurrentStep()
  
  // Available times for selected date
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
  
  // Calculate total price
  const calculateTotal = () => {
    if (!selectedTasting) return 0
    const tasting = tastingOptions.find(t => t.id === selectedTasting)
    if (!tasting) return 0
    return tasting.price * personCount
  }
  
  // Check if form is complete
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
    setSelectedDate(day)
    setSelectedTime(null) // Reset time when date changes
  }
  
  // Handle reservation and payment
  const handleReservation = async () => {
    if (!isFormComplete()) return
    
    try {
      setIsLoading(true)
      
      const selectedTastingDetails = tastingOptions.find(t => t.id === selectedTasting)
      if (!selectedTastingDetails) {
        throw new Error('Vybraná degustácia nebola nájdená')
      }
      
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
      })
      
      const { url, error } = await response.json()
      
      if (error) {
        console.error('Error creating checkout session:', error)
        alert('Nastala chyba pri spracovaní platby. Skúste to prosím znova.')
        setIsLoading(false)
        return
      }
      
      if (url) {
        router.push(url)
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
      alert('Nastala chyba pri presmerovaní na platobnú bránu. Skúste to prosím znova.')
      setIsLoading(false)
    }
  }

  const TastingOption = ({ option }: { option: TastingType }) => (
    <motion.div 
      key={option.id}
      whileHover={{ scale: 1.01 }}
      className="mb-4"
    >
      <div className="flex items-start space-x-3 md:space-x-4 p-3 md:p-4 rounded-lg border border-gray-200 hover:border-amber-200 hover:bg-amber-50/50 transition-colors cursor-pointer"
        onClick={() => setSelectedTasting(option.id)}
      >
        <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
        <div className="grid gap-1.5 leading-none w-full">
            <div className="flex justify-between items-center">
              <Label htmlFor={option.id} className="text-base md:text-lg font-medium">{option.name}</Label>
              <span className="font-bold text-amber-800">{option.price} € / osoba</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">{option.description}</p>
            <div className="flex flex-wrap gap-2 md:gap-4 mt-2 text-xs md:text-sm text-gray-600">
              <div className="flex items-center gap-0.5 md:gap-1">
                <Clock size={14} className="md:w-4 md:h-4" />
                <span>{option.duration} minút</span>
              </div>
              <div className="flex items-center gap-0.5 md:gap-1">
                <Users size={14} className="md:w-4 md:h-4" />
                <span>Max. {option.capacity} osôb</span>
              </div>
              <div className="flex items-center gap-0.5 md:gap-1">
                <Wine size={14} className="md:w-4 md:h-4" />
                <span>{option.id === 'basic' ? '6 vín' : option.id === 'premium' ? '8 vín' : '10 vín'}</span>
              </div>
            </div>
        </div>
      </div>
    </motion.div>
  )
  
  return (
    <div>
      {/* Hero section */}
      <div className="relative h-[200px] md:h-[300px] mb-8 md:mb-12">
        <Image
          src="/about/experience3.webp"
          alt="Degustácia vína"
          fill
          priority
          style={{ objectFit: 'cover' }}
          className="brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <motion.h1 
            className="text-3xl md:text-5xl font-bold mb-2 md:mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Rezervácia degustácie
          </motion.h1>
          <motion.p 
            className="text-base md:text-xl max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Zažite jedinečnú ochutnávku našich vín priamo vo vinárstve Putec
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto pb-10 px-4">
        {/* Steps indicator */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative flex justify-between">
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200" style={{ zIndex: 0 }}>
              <div 
                className="h-full bg-amber-600 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>
            
            <StepIndicator 
              step={1} 
              currentStep={currentStep}
              icon={<Wine size={24} />}
              title="Výber degustácie"
            />
            <StepIndicator 
              step={2} 
              currentStep={currentStep}
              icon={<CalendarDays size={24} />}
              title="Termín"
            />
            <StepIndicator 
              step={3} 
              currentStep={currentStep}
              icon={<UserRound size={24} />}
              title="Kontakt"
            />
            <StepIndicator 
              step={4} 
              currentStep={currentStep}
              icon={<CreditCard size={24} />}
              title="Platba"
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-4 md:p-6">
              {/* Step 1: Tasting selection */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-lg font-semibold mb-3 md:mb-4">Vyberte typ degustácie</h3>
                  <RadioGroup value={selectedTasting || ''} onValueChange={setSelectedTasting}>
                    {tastingOptions.map(option => (
                      <TastingOption key={option.id} option={option} />
                    ))}
                  </RadioGroup>
                  <div className="mt-4 md:mt-6 flex justify-end">
                    <Button
                      onClick={() => selectedTasting && setSelectedDate(undefined)}
                      disabled={!selectedTasting}
                      className="bg-amber-700 hover:bg-amber-800"
                    >
                      Pokračovať
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Date and time selection */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-4 md:space-y-6">
                    <h3 className="text-lg font-semibold mb-3 md:mb-4">Vyberte termín</h3>
                    <div className="grid gap-6">
                      <div>
                        <Label>Dátum</Label>
                        <div className="mt-2">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            className="border rounded-md p-1 md:p-2 mx-auto scale-90 md:scale-100 origin-top"
                            disabled={(date) => {
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
                  </div>
                  <div className="mt-4 md:mt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTasting(null)}
                    >
                      Späť
                    </Button>
                    <Button
                      onClick={() => {
                        if (selectedDate && selectedTime) {
                          setContactInfo({ name: '', email: '', phone: '' })
                        }
                      }}
                      disabled={!selectedDate || !selectedTime}
                      className="bg-amber-700 hover:bg-amber-800"
                    >
                      Pokračovať
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Contact information */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-4 md:space-y-6">
                    <h3 className="text-lg font-semibold mb-4">Kontaktné údaje</h3>
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
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedDate(undefined)
                        setSelectedTime(null)
                      }}
                    >
                      Späť
                    </Button>
                    <Button
                      onClick={() => {
                        if (contactInfo.name && contactInfo.email && contactInfo.phone) {
                          // Continue to summary
                        }
                      }}
                      disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone}
                      className="bg-amber-700 hover:bg-amber-800"
                    >
                      Pokračovať
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Summary and payment */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-6">
                    <div className="bg-amber-50 rounded-lg p-4 md:p-6">
                      <h3 className="text-lg font-semibold mb-4">Súhrn rezervácie</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Typ degustácie:</span>
                          <span className="font-medium">{tastingOptions.find(t => t.id === selectedTasting)?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Termín:</span>
                          <span className="font-medium">
                            {selectedDate?.toLocaleDateString('sk-SK', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                            {' o '}{selectedTime}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Počet osôb:</span>
                          <span className="font-medium">{personCount}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Cena za osobu:</span>
                          <span className="font-medium">
                            {tastingOptions.find(t => t.id === selectedTasting)?.price} €
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>Celková suma:</span>
                          <span className="text-amber-800">{calculateTotal()} €</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setContactInfo({ name: '', email: '', phone: '' })}
                      >
                        Späť
                      </Button>
                      <Button 
                        className="bg-amber-700 hover:bg-amber-800"
                        disabled={isLoading}
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
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
