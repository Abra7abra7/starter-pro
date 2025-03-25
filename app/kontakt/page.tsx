"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react'
import Image from 'next/image'

export default function KontaktPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulácia odoslania formulára
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      
      // Reset stavu po 5 sekundách
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }
  
  const isFormValid = () => {
    return (
      formState.name.trim() !== '' &&
      formState.email.trim() !== '' &&
      formState.message.trim() !== ''
    )
  }
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-amber-900 mb-2">Kontaktujte nás</h1>
      <p className="text-lg text-amber-800 mb-8">Máte otázky alebo záujem o naše vína? Neváhajte nás kontaktovať</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Napíšte nám</CardTitle>
              <CardDescription>Vyplňte formulár a my vám odpovieme čo najskôr</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Meno a priezvisko *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formState.name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formState.email} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefón</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      value={formState.phone} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Predmet</Label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      value={formState.subject} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Správa *</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    rows={5} 
                    value={formState.message} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-amber-700 hover:bg-amber-800"
                    disabled={isSubmitting || !isFormValid() || isSubmitted}
                  >
                    {isSubmitting ? (
                      <>Odosielam...</>
                    ) : isSubmitted ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Správa odoslaná
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Odoslať správu
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card className="bg-amber-50 border-none">
            <CardHeader>
              <CardTitle>Kontaktné informácie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-amber-700 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Adresa</h3>
                    <p>Vinárska 142, 902 01 Vinosady</p>
                    <p className="text-sm text-muted-foreground">Malokarpatská vinohradnícka oblasť</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-amber-700 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Telefón</h3>
                    <p>+421 903 123 456</p>
                    <p className="text-sm text-muted-foreground">Pondelok - Piatok, 9:00 - 17:00</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-amber-700 mt-0.5" />
                  <div>
                    <h3 className="font-medium">E-mail</h3>
                    <p>info@vinarstvoputec.sk</p>
                    <p className="text-sm text-muted-foreground">Odpovieme do 24 hodín</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-amber-700 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Otváracie hodiny</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <span>Pondelok - Piatok:</span>
                      <span>10:00 - 18:00</span>
                      <span>Sobota:</span>
                      <span>10:00 - 16:00</span>
                      <span>Nedeľa:</span>
                      <span>Zatvorené*</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">* Otvorené len pre rezervované degustácie</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="relative h-[300px] rounded-lg overflow-hidden shadow-md">
            <div className="absolute inset-0 bg-amber-900/10 z-10 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="font-medium text-amber-900">Vinárstvo Putec</h3>
                <p className="text-sm">Vinosady pri Pezinku</p>
              </div>
            </div>
            <Image 
              src="/about/map.jpg" 
              alt="Mapa - Vinárstvo Putec" 
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
