'use client';

import ProductCard from './ProductCard';
import { useEffect, useRef, useState } from 'react';
import './product-list.css';

interface Product {
  id: string;
  slug: string;
  type: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image: string;
}

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [centeredIndex, setCenteredIndex] = useState<number>(-1);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;

      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      let closestItem = { index: -1, distance: Infinity };

      itemRefs.current.forEach((item, index) => {
        if (!item) return;

        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - itemCenter);

        if (distance < closestItem.distance + 0.001) {
          closestItem = { index, distance };
        }
      });

      setCenteredIndex(closestItem.index);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ul className='product-list' ref={listRef}>
      {products.map((product, index) => (
        <li 
          key={product.id}
          ref={(el: HTMLLIElement | null) => {
            itemRefs.current[index] = el;
          }}
          className={centeredIndex === index ? 'centered' : ''}
        >
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}