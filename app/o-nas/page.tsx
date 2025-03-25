"use client"

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MapPin, Phone, Mail, Clock, Wine, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl font-bold text-amber-900 mb-4">Rodinné vinárstvo Putec</h1>
          <h2 className="text-2xl text-amber-800 mb-6">Tradícia a kvalita z Vinosadov pri Pezinku</h2>
          <p className="text-lg mb-4">
            Naše rodinné vinárstvo má korene siahajúce až do roku 1935, kedy náš pradedo Jozef Putec začal 
            s pestovaním viniča v malebných kopcoch Malých Karpát. Dnes už štvrtá generácia rodiny pokračuje 
            v tradícii výroby kvalitných vín, ktoré získavajú ocenenia na domácich i medzinárodných súťažiach.
          </p>
          <p className="text-lg mb-6">
            Naša filozofia je jednoduchá - rešpektovať prírodu, tradičné postupy a zároveň využívať moderné 
            technológie tak, aby sme vytvorili vína s jedinečným charakterom, ktoré dokonale odzrkadľujú 
            terroir Malokarpatskej vinohradníckej oblasti.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-amber-700 hover:bg-amber-800">Naše ocenenia</Button>
            <Button variant="outline" className="border-amber-700 text-amber-800 hover:bg-amber-100">
              Kontaktujte nás
            </Button>
          </div>
        </div>
        <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
          <Image 
            src="/about/experience3.webp" 
            alt="Vinárstvo Putec" 
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
      
      <Separator className="my-16" />
      
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">Naša história</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-amber-50 rounded-lg">
            <div className="inline-flex items-center justify-center bg-amber-100 rounded-full w-16 h-16 mb-4">
              <span className="text-2xl font-bold text-amber-800">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Začiatky (1935)</h3>
            <p>
              Jozef Putec zakladá rodinnú tradíciu vinohradníctva v Vinosadoch, 
              vtedy ešte známych ako Grinava.
            </p>
          </div>
          <div className="text-center p-6 bg-amber-50 rounded-lg">
            <div className="inline-flex items-center justify-center bg-amber-100 rounded-full w-16 h-16 mb-4">
              <span className="text-2xl font-bold text-amber-800">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Rozvoj (1970-1990)</h3>
            <p>
              Druhá generácia rozširuje vinice a modernizuje výrobné postupy. 
              Začíname sa špecializovať na tradičné odrody.
            </p>
          </div>
          <div className="text-center p-6 bg-amber-50 rounded-lg">
            <div className="inline-flex items-center justify-center bg-amber-100 rounded-full w-16 h-16 mb-4">
              <span className="text-2xl font-bold text-amber-800">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Súčasnosť</h3>
            <p>
              Dnes vedú vinárstvo súrodenci Peter a Mária Putecovci, ktorí kombinujú 
              tradičné postupy s modernými technológiami.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">Prečo si vybrať naše vína?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-amber-50 border-none">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Wine className="h-10 w-10 text-amber-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tradičné postupy</h3>
                <p>Vyrábame víno s rešpektom k tradíciám a dedičstvu našich predkov</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-none">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Award className="h-10 w-10 text-amber-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ocenené vína</h3>
                <p>Naše vína pravidelne získavajú ocenenia na domácich i medzinárodných súťažiach</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-none">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <MapPin className="h-10 w-10 text-amber-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Terroir</h3>
                <p>Jedinečná poloha našich viníc v Malokarpatskej oblasti dáva vínam výnimočný charakter</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-none">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Clock className="h-10 w-10 text-amber-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Starostlivosť</h3>
                <p>Každej fľaši venujeme maximálnu pozornosť od vinice až po finálne dozrievanie</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Separator className="my-16" />
      
      <div>
        <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">Kontaktujte nás</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-amber-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-amber-900 mb-6">Kde nás nájdete</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-amber-700 mt-0.5" />
                <div>
                  <h4 className="font-medium">Adresa</h4>
                  <p>Vinárska 142, 902 01 Vinosady</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-amber-700 mt-0.5" />
                <div>
                  <h4 className="font-medium">Telefón</h4>
                  <p>+421 903 123 456</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-amber-700 mt-0.5" />
                <div>
                  <h4 className="font-medium">E-mail</h4>
                  <p>info@vinarstvoputec.sk</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-amber-700 mt-0.5" />
                <div>
                  <h4 className="font-medium">Otváracie hodiny</h4>
                  <p>Pondelok - Piatok: 10:00 - 18:00</p>
                  <p>Sobota: 10:00 - 16:00</p>
                  <p>Nedeľa: zatvorené (okrem rezervácií)</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
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
