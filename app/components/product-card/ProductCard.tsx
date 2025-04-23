'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/cartContext';
import styles from './ProductCard.module.css';
import { Product } from '@/app/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className={styles['product-card']}>
      <Link href={`/products/${product.slug}`}>
        <Image 
          src={product.image} 
          alt={product.name} 
          width={200}
          height={200}
        />
        <h3>{product.name}</h3>
        
        {product.description && (
          <p className={`${styles['product-description']}}`}>
          {product.description}
        </p>
        )}
        <p>
          {product.price} {product.currency}
        </p>
      </Link>
      <button 
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
    </div>
  );
}