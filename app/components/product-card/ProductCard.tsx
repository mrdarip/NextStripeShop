'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/cartContext';
import styles from './ProductCard.module.css';
import { Product } from '@/app/types';

interface ProductCardProps {
  product: Product;
  centered: boolean;
}

export default function ProductCard({ product, centered }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className={styles['product-card'] + (centered ? ' ' + styles.centered : '')}>
      <Link href={`/products/${product.slug}`} className={styles['product-link']}>
        <Image 
          src={product.image} 
          alt={product.name} 
          width={250}
          height={250}
          priority={false}
          quality={80}
        />
        <h3>{product.name}</h3>
        
        {product.description && (
          <p className={styles['product-description']}>
            {product.description}
          </p>
        )}
        <p className={styles['product-price']}>
          {product.currency} {product.price.toFixed(2)}
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