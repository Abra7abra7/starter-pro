import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import TanstackClientProvider from '@/components/providers/tanstack-client-provider'
import { CartProvider } from '@/hooks/use-cart'
import { ConditionalLayout } from '@/components/layouts/conditional-layout'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Vinárstvo Putec | Vinosady pri Pezinku',
  description: 'Rodinné vinárstvo Putec z Vinosadov pri Pezinku - kvalitné slovenské vína, degustácie a predaj priamo z vinárstva',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sk">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <TanstackClientProvider>
          <CartProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </CartProvider>
        </TanstackClientProvider>
      </body>
    </html>
  )
}
