import { GetStaticProps } from 'next';
import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

interface HomeProps {
  products: Product[];
}

export default function Home({ products }: HomeProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
    setLoading(true);

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });

    const session = await response.json();

    const stripe = await stripePromise;

    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        console.error('Error redirecting to checkout:', error);
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>My Next.js Stripe App</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>
              {product.price} {product.currency}
            </p>
            <button onClick={() => handleCheckout(product.id)} disabled={loading}>
              {loading ? 'Loading...' : 'Buy'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15',
  });

  const prices = await stripe.prices.list({
    expand: ['data.product'],
  });

  const products = prices.data.map((price) => ({
    id: price.id,
    name: (price.product as Stripe.Product).name,
    description: (price.product as Stripe.Product).description,
    price: price.unit_amount / 100,
    currency: price.currency.toUpperCase(),
  }));

  return {
    props: {
      products,
    },
    revalidate: 60, // ISR: Revalidate every 60 seconds
  };
};