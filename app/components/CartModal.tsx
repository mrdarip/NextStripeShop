'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from './CartModal.module.css';
import { createCheckoutSession } from '../../lib/serverActions';
import { loadStripe } from '@stripe/stripe-js';
import { CartContextType } from '../context/cartContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartContext: CartContextType;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function CartModal({ isOpen, onClose, cartContext }: CartModalProps) {
  const [mounted, setMounted] = useState(false);
  const { cart, removeFromCart, clearCart } = cartContext;
  const [loading, setLoading] = useState(false);
  
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;
  
  // Calculate total items in cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          &times;
        </button>
        
        <h2>Your Cart {totalItems > 0 && `(${totalItems} items)`}</h2>
        
        {cart.length === 0 ? (
          <div className={styles.cartEmpty}>
            Your cart is empty
          </div>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className={styles.cartItemImage}
                />
                <div className={styles.cartItemInfo}>
                  <h3>{item.name}</h3>
                  <p>
                    {item.price} {item.currency} × {item.quantity}
                  </p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className={styles.cartItemRemove}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        
        <div className={styles.cartActions}>
          <button 
            onClick={clearCart} 
            className={styles.clearButton} 
            disabled={cart.length === 0}
          >
            Clear Cart
          </button>
          <button 
            onClick={handleCheckout} 
            disabled={loading || cart.length === 0} 
            className={styles.checkoutButton}
          >
            {loading ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}