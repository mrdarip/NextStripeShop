'use client';

import { useState } from 'react';
import { useCart } from '../context/cartContext';
import CartModal from './CartModal';


export default function Cart() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cartContext = useCart();
  const { cart } = cartContext;

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <>
      <div className="cart-icon" onClick={() => setIsModalOpen(true)} style={{ fontSize: '24px', cursor: 'pointer', position: 'relative' }}>
        🛒
        {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
      </div>
      <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cartContext={cartContext} />
    </>
  );
}