"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShoppingCart, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCart, WineProduct } from '@/hooks/use-cart'

// Vzorové dáta produktov
const wineProducts: WineProduct[] = [
  {
    id: '1',
    name: 'Rizling Rýnsky',
    type: 'biele',
    year: 2022,
    price: 12.90,
    description: 'Svieže biele víno s jemnou kyselinkou a ovocnými tónmi. Ideálne k rybám a ľahkým predjedlám.',
    image: '/wines/rizling.jpg'
  },
  {
    id: '2',
    name: 'Frankovka Modrá',
    type: 'cervene',
    year: 2021,
    price: 14.50,
    description: 'Plné červené víno s tónmi čierneho ovocia a jemným tanínom. Výborne sa hodí k tmavému mäsu a syrom.',
    image: '/wines/frankovka.jpg'
  },
  {
    id: '3',
    name: 'Cabernet Sauvignon',
    type: 'cervene',
    year: 2020,
    price: 16.90,
    description: 'Výrazné červené víno s bohatou štruktúrou a dlhou dochuťou. Ideálne k steakom a grilovaným jedlám.',
    image: '/wines/cabernet.jpg'
  },
  {
    id: '4',
    name: 'Chardonnay',
    type: 'biele',
    year: 2022,
    price: 13.90,
    description: 'Elegantné biele víno s tónmi tropického ovocia a vanilky. Výborne sa hodí k hydine a krémovým omáčkam.',
    image: '/wines/chardonnay.jpg'
  },
  {
    id: '5',
    name: 'Svätovavrinecké',
    type: 'cervene',
    year: 2021,
    price: 13.50,
    description: 'Tradičné červené víno s ovocnými tónmi a príjemnou kyselinkou. Vhodné k tradičným slovenským jedlám.',
    image: '/wines/svatovavrinecke.jpg'
  },
  {
    id: '6',
    name: 'Rosé Cabernet',
    type: 'ruzove',
    year: 2022,
    price: 11.90,
    description: 'Svieže ružové víno s tónmi jahôd a malín. Ideálne na letné posedenia a k ľahkým jedlám.',
    image: '/wines/rose.jpg'
  },
  {
    id: '7',
    name: 'Muškát Moravský',
    type: 'biele',
    year: 2022,
    price: 12.50,
    description: 'Aromatické polosuché víno s tónmi muškátu a citrusov. Výborné ako aperitív alebo k dezertom.',
    image: '/wines/muskat.jpg'
  },
  {
    id: '8',
    name: 'Sekt Brut',
    type: 'sampanske',
    year: 2021,
    price: 18.90,
    description: 'Elegantný sekt vyrobený tradičnou metódou s jemnými bublinkami a sviežou chuťou. Ideálny na oslavy.',
    image: '/wines/sekt.jpg'
  },
]

export default function EshopPage() {
  const { addToCart, isInCart, getCartCount } = useCart()
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-amber-900 mb-2">E-shop vinárstva Putec</h1>
      <p className="text-lg text-amber-800 mb-8">Objavte naše kvalitné vína z Malokarpatskej vinohradníckej oblasti</p>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="all">Všetky vína</TabsTrigger>
          <TabsTrigger value="biele">Biele vína</TabsTrigger>
          <TabsTrigger value="cervene">Červené vína</TabsTrigger>
          <TabsTrigger value="ruzove">Ružové vína</TabsTrigger>
          <TabsTrigger value="sampanske">Šampanské a sekty</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wineProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} inCart={isInCart(product.id)} />
          ))}
        </TabsContent>
        
        <TabsContent value="biele" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wineProducts.filter(p => p.type === 'biele').map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} inCart={isInCart(product.id)} />
          ))}
        </TabsContent>
        
        <TabsContent value="cervene" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wineProducts.filter(p => p.type === 'cervene').map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} inCart={isInCart(product.id)} />
          ))}
        </TabsContent>
        
        <TabsContent value="ruzove" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wineProducts.filter(p => p.type === 'ruzove').map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} inCart={isInCart(product.id)} />
          ))}
        </TabsContent>
        
        <TabsContent value="sampanske" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wineProducts.filter(p => p.type === 'sampanske').map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} inCart={isInCart(product.id)} />
          ))}
        </TabsContent>
      </Tabs>
      
      <div className="fixed bottom-4 right-4">
        <Link href="/eshop/kosik">
          <Button className="bg-amber-700 hover:bg-amber-800 rounded-full h-16 w-16 flex items-center justify-center relative">
            <ShoppingCart size={24} />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {getCartCount()}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </div>
  )
}

function ProductCard({ 
  product, 
  onAddToCart,
  inCart
}: { 
  product: WineProduct
  onAddToCart: () => void
  inCart: boolean
}) {
  const [favorite, setFavorite] = useState(false)
  
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-amber-50">
        <div className="absolute top-2 right-2 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/80 hover:bg-white"
            onClick={() => setFavorite(!favorite)}
          >
            <Heart className={favorite ? "fill-red-500 text-red-500" : "text-gray-500"} size={20} />
          </Button>
        </div>
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="relative h-40 w-24">
            <Image 
              src={product.image} 
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold text-amber-900">{product.name}</CardTitle>
        <CardDescription className="text-amber-700">
          {product.year} • {product.price.toFixed(2)} €
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className={`w-full ${inCart ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'}`}
          onClick={onAddToCart}
        >
          {inCart ? 'Pridať ďalší' : 'Pridať do košíka'}
        </Button>
      </CardFooter>
    </Card>
  )
}
