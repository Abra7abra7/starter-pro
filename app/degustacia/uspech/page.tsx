"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Calendar, MapPin, Users, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { stripe } from '@/utils/stripe/config'

export default function TastingSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [reservationDetails, setReservationDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) {
      router.push('/degustacia')
      return
    }

    // Fetch the session details from Stripe
    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(`/api/get-tasting-session?session_id=${sessionId}`)
        const data = await response.json()
        
        if (data.error) {
          console.error('Error fetching session:', data.error)
          setLoading(false)
          return
        }
        
        setReservationDetails(data)
        setLoading(false)
        
        // Here you would typically save the reservation to your database
        // This would be handled by a webhook in a production environment
      } catch (error) {
        console.error('Error:', error)
        setLoading(false)
      }
    }

    fetchSessionDetails()
  }, [sessionId, router])

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
        <p className="mt-4 text-amber-800">Načítavame detaily vašej rezervácie...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="rounded-full bg-green-100 p-3 mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Rezervácia úspešne dokončená!</h1>
          <p className="text-lg text-gray-600">
            Ďakujeme za vašu rezerváciu degustácie. Potvrdenie sme odoslali na váš email.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Detaily rezervácie</CardTitle>
            <CardDescription>Informácie o vašej rezervácii degustácie</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reservationDetails ? (
              <>
                <div>
                  <h3 className="font-medium text-amber-900">Typ degustácie</h3>
                  <p>{reservationDetails.tastingName}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-amber-900">Termín</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-700" />
                    <p>{reservationDetails.formattedDate} o {reservationDetails.time}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-amber-900">Miesto konania</h3>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-700" />
                    <p>Vinárstvo Putec, Hlavná 123, Vinosady pri Pezinku</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-amber-900">Počet osôb</h3>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-amber-700" />
                    <p>{reservationDetails.personCount}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-amber-900">Celková suma</h3>
                  <p className="font-bold text-amber-800">{(reservationDetails.amount / 100).toFixed(2)} €</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-amber-900">Stav platby</h3>
                  <p className="text-green-600 font-medium">Zaplatené</p>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">Detaily rezervácie nie sú dostupné</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Link href="/degustacia" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Späť na degustácie
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full bg-amber-700 hover:bg-amber-800">
                <Home className="mr-2 h-4 w-4" />
                Domov
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
