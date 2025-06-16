'use client';

import { useCart } from '@/app/context/cartContext';
import { Product } from '@/app/types';
import { useState } from 'react';
import styles from './AddToCartButton.module.css';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = () => {
    setIsAdding(true);
    
    addToCart({ 
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.image,
      quantity: 1,
      type: product.type,
    });
    
    // Reset button state after animation
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };
  
  return (
    <button 
      type="button" 
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`${styles.button} ${isAdding ? styles.isAdding : ''}`}
    >
      {isAdding ? 'Añadido!' : 'Añadir al carrito'}
    </button>
  );
}