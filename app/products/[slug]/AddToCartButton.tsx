'use client';

import { useCart } from '@/app/context/cartContext';
import { Product } from '@/app/types';
import { useState } from 'react';

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
      style={{ 
        opacity: isAdding ? 0.8 : 1,
        transform: isAdding ? 'scale(0.98)' : 'scale(1)',
        transition: 'all 0.2s ease'
      }}
    >
      {isAdding ? 'Añadido!' : 'Añadir al carrito'}
    </button>
  );
}