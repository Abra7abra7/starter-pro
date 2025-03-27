"use client"

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MapPin, Phone, Mail, Clock, Wine, Award, Grape, Factory, Star } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// Timeline item component
function TimelineItem({ year, title, description, icon, side }: {
  year: string
  title: string
  description: string
  icon: React.ReactNode
  side: 'left' | 'right'
}) {
  const itemRef = useRef(null)
  const isInView = useInView(itemRef, { once: true, margin: "-100px" })
  
  return (
    <div className="mb-16 relative" ref={itemRef}>
      <motion.div 
        className={`flex items-center gap-8 ${side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}
        initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Content */}
        <div className={`w-1/2 ${side === 'left' ? 'text-right' : 'text-left'}`}>
          <motion.div 
            className="bg-amber-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-amber-800 mb-2">{year}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </motion.div>
        </div>

        {/* Center icon */}
        <div className="relative">
          <motion.div 
            className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center z-10 relative"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <div className="text-amber-800">
              {icon}
            </div>
          </motion.div>
        </div>

        {/* Empty space for the other side */}
        <div className="w-1/2" />
      </motion.div>
    </div>
  )
}

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
      
      <div className="mb-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-amber-900 mb-12 text-center"
        >
          Naša história
        </motion.h2>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-200" />
          
          {/* Timeline items */}
          <TimelineItem 
            year="1935"
            title="Začiatky"
            description="Jozef Putec zakladá rodinnú tradíciu vinohradníctva v Vinosadoch, vtedy ešte známych ako Grinava. Začína s pestovaním prvých viničov na svahoch Malých Karpát."
            icon={<Grape className="w-8 h-8" />}
            side="left"
          />
          
          <TimelineItem 
            year="1955"
            title="Prvé úspechy"
            description="Vinárstvo sa rozrastá a získava prvé regionálne ocenenia. Rozširujeme pestovanie o nové odrody viniča typické pre našu oblasť."
            icon={<Award className="w-8 h-8" />}
            side="right"
          />
          
          <TimelineItem 
            year="1970"
            title="Modernizácia"
            description="Druhá generácia preberá vedenie. Začíname s modernizáciou výrobných postupov a rozširovaním vinohradov. Špecializujeme sa na tradičné odrody."
            icon={<Factory className="w-8 h-8" />}
            side="left"
          />
          
          <TimelineItem 
            year="1990"
            title="Medzinárodný úspech"
            description="Naše vína získavajú prvé medzinárodné ocenenia. Investujeme do najmodernejších technológií spracovania hrozna."
            icon={<Star className="w-8 h-8" />}
            side="right"
          />
          
          <TimelineItem 
            year="2010"
            title="Nová éra"
            description="Tretia generácia prináša inovácie v pestovaní a výrobe. Zavádzame ekologické postupy a získavame certifikáciu bio produkcie."
            icon={<Wine className="w-8 h-8" />}
            side="left"
          />
          
          <TimelineItem 
            year="Súčasnosť"
            title="Rodinná tradícia pokračuje"
            description="Dnes vedú vinárstvo súrodenci Peter a Mária Putecovci, ktorí kombinujú tradičné postupy s modernými technológiami. Zameriavame sa na prémiové vína a agroturistiku."
            icon={<Award className="w-8 h-8" />}
            side="right"
          />
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
