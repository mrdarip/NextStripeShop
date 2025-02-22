'use client';

import { useState } from 'react';
import { useCart } from '../context/cartContext';
import Modal from '../components/Modal';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

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
    <>
      <div className="cart-icon" onClick={() => setIsModalOpen(true)} style={{ fontSize: '24px', cursor: 'pointer', position: 'relative' }}>
        🛒
        {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
      </div>
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
        <div>
          <button onClick={clearCart}>Clear Cart</button>
          <button onClick={handleCheckout} disabled={loading || cart.length === 0}>
            {loading ? 'Loading...' : 'Checkout'}
          </button>
        </div>
      </Modal>
    </>
  );
}