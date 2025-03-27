import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0)
  const titles = useMemo(() => ['Tradičné', 'Kvalitné', 'Oceňované', 'Prémiové', 'Slovenské'], [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0)
      } else {
        setTitleNumber(titleNumber + 1)
      }
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [titleNumber, titles])

  return (
    <div className="w-full relative min-h-[80vh] flex items-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero.webp" 
          alt="Vineyard background" 
          fill 
          className="object-cover"
          priority
          quality={100}
          sizes="100vw"
          unoptimized
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 via-amber-900/20 to-amber-900/10"></div>
      </div>
      
      <div className="container mx-auto relative z-10 px-4 py-10">
        <div className="flex flex-col items-center justify-center gap-8 py-10 md:py-20">
          <div className="bg-amber-900/30 backdrop-filter backdrop-blur-sm p-4 rounded-full">
            <div className="flex flex-row items-center gap-2">
              <Image 
                src="/wine-logo.png" 
                alt="Vinárstvo Putec" 
                width={64} 
                height={64}
                className="drop-shadow-lg" 
              />
              <span className="logo-text text-3xl font-bold text-white drop-shadow-md">Vinárstvo Putec</span>
            </div>
          </div>
          <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            <h1 className="font-regular text-center text-5xl tracking-tighter md:text-7xl drop-shadow-md">
              <span className="relative flex w-full justify-center overflow-hidden text-center md:mb-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-amber-100"
                    initial={{ opacity: 0, y: '-100' }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
              <span className="text-white">Vína z Vinosadov</span>
            </h1>

            <div className="bg-amber-900/30 backdrop-filter backdrop-blur-sm p-6 rounded-lg">
              <p className="text-center text-lg leading-relaxed tracking-tight text-white md:text-xl">
                Rodinné vinárstvo s dlhoročnou tradíciou z malebných Vinosadov pri Pezinku. 
                Naše vína sú výsledkom starostlivej práce, lásky k vinohradníctvu a úcty k tradíciám 
                Malokarpatského regiónu.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            
            <Button size="lg" className="gap-2 bg-amber-700 hover:bg-amber-800 shadow-lg" asChild>
              <Link href="/eshop">
                Náš E-shop <ShoppingCart className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" className="gap-2 bg-white text-amber-900 hover:bg-amber-100 shadow-lg font-semibold" asChild>
              <Link href="/ubytovanie">
                Rezervovať ubytovanie <Calendar className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Hero }
