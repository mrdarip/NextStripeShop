import { AppProps } from 'next/app';
import { CartProvider } from '../context/cartContext';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <SpeedInsights />
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp;