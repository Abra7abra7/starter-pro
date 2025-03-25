"use client"

import { useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()
  const router = useRouter()
  
  // Clear the cart when the page loads
  useEffect(() => {
    if (sessionId) {
      clearCart()
    }
  }, [sessionId, clearCart])
  
  const goToShop = () => {
    router.push('/eshop')
  }
  
  const goToHome = () => {
    router.push('/')
  }
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-24 w-24 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-amber-900 mb-4">Ďakujeme za vašu objednávku!</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="text-lg text-gray-700 mb-6">
            Vaša platba bola úspešne spracovaná a objednávka bola prijatá. 
            Potvrdenie objednávky sme vám poslali na váš e-mail.
          </p>
          
          {sessionId && (
            <p className="text-sm text-gray-500 mb-4">
              Číslo objednávky: <span className="font-medium">{sessionId.substring(0, 8)}</span>
            </p>
          )}
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-semibold text-amber-800 mb-4">Čo bude ďalej?</h2>
            <p className="text-gray-700 mb-4">
              Vaša objednávka bude spracovaná a pripravená na expedíciu v priebehu 1-2 pracovných dní.
              O odoslaní objednávky vás budeme informovať e-mailom.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            className="bg-amber-700 hover:bg-amber-800 w-full sm:w-auto"
            onClick={goToShop}
          >
            Pokračovať v nákupe
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={goToHome}
          >
            Späť na domovskú stránku
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-16 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
        <p className="mt-4 text-amber-800">Načítavame...</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
