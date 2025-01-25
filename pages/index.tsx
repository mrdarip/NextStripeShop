import { GetStaticProps } from 'next';
import { useState } from 'react';
import { useCart } from '../context/cartContext';
import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

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
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cart }),
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
      <header>
        <h1>My Next.js Stripe App</h1>
      </header>
      <main>
        <section>
          <h2>Products</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <article>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>
                    {product.price} {product.currency}
                  </p>
                  <button onClick={() => addToCart(product)}>Add to Cart</button>
                </article>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Cart</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                <article>
                  <h3>{item.name}</h3>
                  <p>
                    {item.price} {item.currency} x {item.quantity}
                  </p>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </article>
              </li>
            ))}
          </ul>
          <button onClick={clearCart}>Clear Cart</button>
          <button onClick={handleCheckout} disabled={loading || cart.length === 0}>
            {loading ? 'Loading...' : 'Checkout'}
          </button>
        </section>
      </main>
      <footer>
        <p>&copy; 2023 My Next.js Stripe App</p>
      </footer>
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