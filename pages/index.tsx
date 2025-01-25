import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../context/cartContext';
import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';
import Modal from '../components/Modal';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
}

interface HomeProps {
  products: Product[];
}

export default function Home({ products }: HomeProps) {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div id="body">
      <header>
        <h1>My Next.js Stripe App</h1>
        <div className="cart-icon" onClick={() => setIsModalOpen(true)} style={{ fontSize: '24px', cursor: 'pointer', position: 'relative' }}>
          🛒
          {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
        </div>
      </header>
      <main>
        <section className='products'>
          <h2>Products</h2>
          <ul className='product-list'>
            {products.map((product) => (
              <li key={product.id}>
                <article>
                  <Link href={`/products/${product.slug}`}>
                    <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px', cursor: 'pointer' }} />
                    <h3>{product.name}</h3>
                  </Link>
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
      </main>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
      </Modal>
      <footer>
        <p>&copy; 2023 My Next.js Stripe App</p>
      </footer>
      <style jsx>{`
        .cart-icon {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: white;
          border-radius: 50%;
          padding: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .cart-count {
          position: absolute;
          top: -10px;
          right: -10px;
          background: red;
          color: white;
          border-radius: 50%;
          padding: 5px 10px;
          font-size: 12px;
        }
      `}</style>
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

  const products = prices.data.map((price) => {
    const product = price.product as Stripe.Product;
    return {
      id: price.id,
      slug: product.metadata.slug, // Use the slug from metadata
      name: product.name,
      description: product.description,
      price: price.unit_amount / 100,
      currency: price.currency.toUpperCase(),
      image: product.images.length > 0 ? product.images[0] : '/images/placeholder.png',
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60, // ISR: Revalidate every 60 seconds
  };
};