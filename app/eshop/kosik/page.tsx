"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, MinusCircle, PlusCircle, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart, CartItem } from '@/hooks/use-cart'
import { getStripe } from '@/utils/stripe/client'
import { useRouter } from 'next/navigation'

export default function KosikPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      
      // Call our API route to create a Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems: items }),
      })
      
      const { url, sessionId, error } = await response.json()
      
      if (error) {
        console.error('Error creating checkout session:', error)
        alert('Nastala chyba pri spracovaní platby. Skúste to prosím znova.')
        setIsLoading(false)
        return
      }
      
      // Redirect to Stripe Checkout
      if (url) {
        router.push(url)
      } else {
        // If we have a sessionId but no URL, use the Stripe client to redirect
        const stripe = await getStripe()
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId })
        }
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
      alert('Nastala chyba pri presmerovaní na platobnú bránu. Skúste to prosím znova.')
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Váš košík</h1>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingBag className="h-16 w-16 text-amber-300 mb-4" />
          <h2 className="text-2xl font-semibold text-amber-900 mb-2">Váš košík je prázdny</h2>
          <p className="text-gray-600 mb-8">Pridajte si do košíka niektoré z našich kvalitných vín</p>
          <Link href="/eshop">
            <Button className="bg-amber-700 hover:bg-amber-800">
              Späť do e-shopu
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Váš košík</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {items.map((item: CartItem) => (
                  <div key={item.product.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b last:border-0 last:pb-0">
                    <div className="relative h-24 w-16 bg-amber-50 flex-shrink-0">
                      <Image 
                        src={item.product.image} 
                        alt={item.product.name}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium text-amber-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">{item.product.year}, {item.product.type}</p>
                      <p className="font-medium text-amber-800 mt-1">{item.product.price.toFixed(2)} € / ks</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <MinusCircle size={18} />
                      </Button>
                      
                      <span className="w-8 text-center">{item.quantity}</span>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <PlusCircle size={18} />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-amber-900 w-20 text-right">
                        {(item.product.price * item.quantity).toFixed(2)} €
                      </p>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-6 pt-0">
              <Button 
                variant="outline" 
                onClick={clearCart}
              >
                Vyprázdniť košík
              </Button>
              
              <Link href="/eshop">
                <Button variant="outline">
                  <ArrowLeft className="mr-2" size={16} />
                  Pokračovať v nákupe
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Súhrn objednávky</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Cena produktov</span>
                <span className="font-medium">{getCartTotal().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Doprava</span>
                <span className="font-medium">Podľa výberu</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold text-amber-900">
                  <span>Celkom</span>
                  <span>{getCartTotal().toFixed(2)} €</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Vrátane DPH</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-amber-700 hover:bg-amber-800"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Presmerovanie na platbu...
                  </>
                ) : (
                  'Pokračovať k platbe'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
