import { AppProps } from 'next/app';
import { CartProvider } from '../context/cartContext';
import '../styles/globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp;