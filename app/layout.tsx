import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react";
import { Inter } from 'next/font/google'
import { CartProvider } from './context/cartContext'
import Cart from './components/Cart'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Next.js Stripe App',
  description: 'E-commerce application with Next.js and Stripe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div id="body">
            <header>
              <h1>
                <a href="/">
                  <img src='/images/logo.png' alt='logo'/>
                  My Next.js Stripe App
                </a>
              </h1>
              <Cart />
            </header>
            <main>{children}</main>
            <footer>
              <p>&copy; 2023 My Next.js Stripe App</p>
            </footer>
          </div>
        </CartProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}