"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-amber-900 text-amber-50">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo a krátky popis */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/wine-logo.png" alt="Vinárstvo Putec" width={48} height={48} />
              <span className="text-xl font-bold">Vinárstvo Putec</span>
            </div>
            <p className="text-amber-200">
              Rodinné vinárstvo s dlhoročnou tradíciou z malebných Vinosadov pri Pezinku. 
              Vyrábame kvalitné vína s dôrazom na tradičné postupy a moderné technológie.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5 text-amber-200 hover:text-white transition-colors" />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 text-amber-200 hover:text-white transition-colors" />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5 text-amber-200 hover:text-white transition-colors" />
              </Link>
            </div>
          </div>

          {/* Rýchle odkazy */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Rýchle odkazy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-amber-200 hover:text-white transition-colors">
                  Domov
                </Link>
              </li>
              <li>
                <Link href="/eshop" className="text-amber-200 hover:text-white transition-colors">
                  E-shop
                </Link>
              </li>
              <li>
                <Link href="/degustacia" className="text-amber-200 hover:text-white transition-colors">
                  Degustácie
                </Link>
              </li>
              <li>
                <Link href="/o-nas" className="text-amber-200 hover:text-white transition-colors">
                  O nás
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-amber-200 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontaktné informácie */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-200 mt-0.5" />
                <span>Vinárska 142, 902 01 Vinosady</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-amber-200 mt-0.5" />
                <span>+421 903 123 456</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-amber-200 mt-0.5" />
                <span>info@vinarstvoputec.sk</span>
              </li>
            </ul>
          </div>

          {/* Otváracie hodiny */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Otváracie hodiny</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Pondelok - Piatok:</span>
                <span>10:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sobota:</span>
                <span>10:00 - 16:00</span>
              </li>
              <li className="flex justify-between">
                <span>Nedeľa:</span>
                <span>Zatvorené</span>
              </li>
              <li className="text-amber-200 mt-2 text-sm">
                (Nedeľa otvorené len pre rezervované degustácie)
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-amber-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-amber-200">
            &copy; {currentYear} Vinárstvo Putec. Všetky práva vyhradené.
          </p>
          <div className="flex gap-4 text-sm text-amber-200">
            <Link href="/obchodne-podmienky" className="hover:text-white transition-colors">
              Obchodné podmienky
            </Link>
            <Link href="/ochrana-osobnych-udajov" className="hover:text-white transition-colors">
              Ochrana osobných údajov
            </Link>
            <Link href="/reklamacny-poriadok" className="hover:text-white transition-colors">
              Reklamačný poriadok
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
