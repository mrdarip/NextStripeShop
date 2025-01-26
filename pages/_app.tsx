import { AppProps } from 'next/app';
import { CartProvider } from '../context/cartContext';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Layout from '../components/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <SpeedInsights />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  );
}

export default MyApp;