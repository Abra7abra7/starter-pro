"use client"

import { Hero } from '@/components/ui/animated-hero'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Award, Users, Wine, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  { icon: Wine, label: 'Druhov vín', value: '15+' },
  { icon: Award, label: 'Ocenení', value: '25+' },
  { icon: Users, label: 'Spokojných zákazníkov', value: '1000+' },
]

const featuredWines = [
  {
    name: 'Frankovka Modrá',
    image: '/wines/frankovka.jpg',
    description: 'Červené víno plné ovocných tónov',
    price: '12.90€'
  },
  {
    name: 'Rizling Rýnsky',
    image: '/wines/rizling.jpg',
    description: 'Svieže biele víno s minerálnym charakterom',
    price: '11.90€'
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
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <stat.icon className="w-12 h-12 text-amber-700 mb-4" />
                <h3 className="text-4xl font-bold text-amber-900 mb-2">{stat.value}</h3>
                <p className="text-amber-700">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Wines */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">Naše vína</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredWines.map((wine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-lg shadow-lg bg-white"
              >
                <div className="relative h-[240px] md:h-[320px]">
                  <Image
                    src={wine.image}
                    alt={wine.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-amber-900">{wine.name}</h3>
                  <p className="text-amber-700 mt-2">{wine.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-amber-900">{wine.price}</span>
                    <Button asChild>
                      <Link href="/eshop">Kúpiť</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
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
