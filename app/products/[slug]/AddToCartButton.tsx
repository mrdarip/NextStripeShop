'use client';

import { useCart } from '@/app/context/cartContext';
import { Product } from '@/app/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  return (
    <button 
      type="button" 
      onClick={() => addToCart({ 
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        currency: product.currency,
        image: product.image,
        quantity: 1,
        type: product.type,
      })}
    >
      Add to Cart
    </button>
  );
}