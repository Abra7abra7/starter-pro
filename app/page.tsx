"use client"

import { Hero } from '@/components/ui/animated-hero'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Award, Users, Wine, MapPin, Heart, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const stats = [
  { icon: Wine, label: 'Druhov vín', value: '15+' },
  { icon: Award, label: 'Ocenení', value: '25+' },
  { icon: Users, label: 'Spokojných zákazníkov', value: '1000+' },
]

const featuredWines = [
  {
    id: '2',
    name: 'Frankovka Modrá',
    image: '/wines/frankovka.jpg',
    description: 'Plné červené víno s tónmi čierneho ovocia a jemným tanínom. Výborne sa hodí k tmavému mäsu a syrom.',
    price: 14.50,
    type: 'cervene',
    year: 2021
  },
  {
    id: '1',
    name: 'Rizling Rýnsky',
    image: '/wines/rizling.jpg',
    description: 'Svieže biele víno s jemnou kyselinkou a ovocnými tónmi. Ideálne k rybám a ľahkým predjedlám.',
    price: 12.90,
    type: 'biele',
    year: 2022
  }
]

const testimonials = [
  {
    name: 'Peter Novák',
    text: 'Výnimočné vína s charakterom regiónu. Degustácia bola nezabudnuteľným zážitkom.',
    role: 'Someliér'
  },
  {
    name: 'Jana Kováčová',
    text: 'Ubytovanie v krásnom prostredí s výhľadom na vinice. Skvelá atmosféra a príjemný personál.',
    role: 'Návštevník'
  },
  {
    name: 'Martin Horváth',
    text: 'Pravidelne sa vraciam pre Frankovku Modrú. Najlepšie červené víno v okolí.',
    role: 'Stály zákazník'
  },
  {
    name: 'Eva Tóthová',
    text: 'Organizovali sme tu firemnú degustáciu. Profesionálny prístup a skvelý výklad o vínach.',
    role: 'Manažérka'
  }
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Stats Section */}
      <section className="relative py-24 bg-gradient-to-b from-amber-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    delay: index * 0.1 
                  }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                  <div className="relative flex flex-col items-center p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-amber-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-300"></div>
                      <stat.icon className="relative w-12 h-12 text-amber-800 transform group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <motion.h3 
                      className="text-5xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent mt-6 mb-3"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                    >
                      {stat.value}
                    </motion.h3>
                    <p className="text-lg font-medium text-amber-700 text-center">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Wines */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">Naše vína</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredWines.map((wine) => (
              <Card key={wine.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-amber-100">
                <div className="relative h-52 bg-gradient-to-b from-amber-50/50 to-amber-100/30">
                  <div className="absolute top-3 right-3 z-10">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full bg-white/90 hover:bg-white shadow-sm hover:shadow transition-all"
                    >
                      <Heart className="text-gray-500" size={20} />
                    </Button>
                  </div>
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <div className="relative h-44 w-28 group-hover:scale-110 transition-transform duration-500">
                      <Image 
                        src={wine.image} 
                        alt={wine.name}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="drop-shadow-xl"
                      />
                    </div>
                  </div>
                </div>
                <CardHeader className="p-5">
                  <CardTitle className="text-xl font-semibold text-amber-900 tracking-tight">{wine.name}</CardTitle>
                  <CardDescription className="text-amber-700 font-medium">
                    {wine.year} • {wine.price.toFixed(2)} €
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{wine.description}</p>
                </CardContent>
                <CardFooter className="px-5 pb-5 flex flex-col gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="w-full border-amber-200 hover:bg-amber-50 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <Info className="mr-2 h-4 w-4" />
                        Zistiť viac
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-amber-900">{wine.name}</DialogTitle>
                        <DialogDescription className="text-amber-700">
                          {wine.year} • {wine.type.charAt(0).toUpperCase() + wine.type.slice(1)} víno
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center justify-center py-4">
                        <div className="relative h-60 w-36">
                          <Image 
                            src={wine.image} 
                            alt={wine.name}
                            fill
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-gray-600">{wine.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-amber-900">{wine.price.toFixed(2)} €</span>
                          <Button 
                            className="bg-amber-600 hover:bg-amber-700"
                            asChild
                          >
                            <Link href={`/eshop?product=${wine.id}`}>
                              Kúpiť
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 shadow-sm hover:shadow-md transition-all duration-300"
                    asChild
                  >
                    <Link href={`/eshop?product=${wine.id}`}>
                      Kúpiť
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-amber-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">Čo hovoria naši zákazníci</h2>
          <div className="relative w-full overflow-hidden">
            <motion.div 
              className="flex gap-8"
              animate={{
                x: ["0%", "-50%"]
              }}
              transition={{
                x: {
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop"
                }
              }}
              style={{ width: "200%" }}
            >
              {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg w-[300px] md:w-[400px] flex-shrink-0"
                >
                  <p className="text-amber-700 italic mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="flex items-center">
                    <div>
                      <h4 className="font-semibold text-amber-900">{testimonial.name}</h4>
                      <p className="text-amber-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-amber-900 mb-6">Kde nás nájdete</h2>
              <p className="text-amber-700 mb-6">
                Nachádzame sa v malebnej obci Vinosady, len 5 minút od Pezinka. 
                Príďte nás navštíviť a ochutnať naše vína priamo u nás vo vinárstve.
              </p>
              <div className="flex items-center gap-2 text-amber-900">
                <MapPin className="w-5 h-5" />
                <p>Modranská 6, Vinosady</p>
              </div>
            </div>
            <div className="flex-1 relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2650.4662011690386!2d17.300988776491708!3d48.33暨0123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c9b5f8b3b3b3b%3A0x1b1b1b1b1b1b1b1b!2sVinosady!5e0!3m2!1ssk!2ssk!4v1625123456789!5m2!1ssk!2ssk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
