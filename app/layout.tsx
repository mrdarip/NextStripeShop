import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react";
import { Inter } from 'next/font/google'
import { CartProvider } from './context/cartContext'
import Cart from './components/Cart'
import ServerPalette from './components/ServerPalette'
import '../styles/globals.css'
import { inDevEnvironment } from '@/lib/DevEnv';
import Header from './components/Header/Header';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'mkdarip',
  description: 'Productos personalizados!',
  keywords: 'mkdarip, productos personalizados, regalos personalizados',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  alternates: {
    languages: {
      'es-ES': '/',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // You can change the default palette here
  const defaultPalette = null;

  return (
    <html lang="en">
      <head>
        <ServerPalette palette={defaultPalette} />
        {/* Google Analytics */}
      {inDevEnvironment ||(
      <>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
          `
        }} />
      </>
      )}
      </head>
      <body className={inter.className}>
        <CartProvider>
          <div id="body">
            <Header />
            <main>{children}</main>
            <footer>
              <p>&copy; 2025 mkdarip </p>
            </footer>
          </div>
        </CartProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}