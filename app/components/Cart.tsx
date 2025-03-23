'use client';

import { useState } from 'react';
import { useCart } from '../context/cartContext';
import CartModal from '../components/Modal';
import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession } from '../../lib/serverActions';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const sessionid = await createCheckoutSession(cart, window.location.origin);
      const stripe = await stripePromise;
      if (stripe && sessionid) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: sessionid,
        });
        if (error) {
          console.error('Error redirecting to checkout:', error);
        }
      } else {
        console.error('Stripe or session ID not available');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="cart-icon" onClick={() => setIsModalOpen(true)} style={{ fontSize: '24px', cursor: 'pointer', position: 'relative' }}>
        🛒
        {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
      </div>
      <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
        <div className='actions'>
          <button onClick={clearCart}>Clear Cart</button>
          <button onClick={handleCheckout} disabled={loading || cart.length === 0}>
            {loading ? 'Loading...' : 'Checkout'}
          </button>
        </div>
      </CartModal>
    </>
  );
}