'use client';

import { useRef, useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import styles from './ProductCarrousel.module.css';
import { Product } from '@/app/types';

interface ProductCarrouselProps {
  products: Product[];
}

export default function ProductCarrousel({ products }: ProductCarrouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    // Only show controls if there are enough products to scroll
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.clientWidth;
      const contentWidth = products.length * 270; // item width (250) + gap (20)
      setShowControls(contentWidth > containerWidth);
    }
  }, [products.length]);

  const scrollPrev = () => {
    if (carouselRef.current) {
      const scrollAmount = 270; // item width + gap
      carouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      const scrollAmount = 270; // item width + gap
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Update active item on scroll
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const itemWidth = 270; // item width + gap
      const newActiveIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(newActiveIndex);
    }
  };

  return (
    <div className={styles['product-carousel-container']}>      
      {showControls && (
        <button 
          className={`${styles['carousel-control']} ${styles.prev}`}
          onClick={scrollPrev}
          aria-label="Previous products"
        >
          &#8249;
        </button>
      )}
      
      <div 
        className={styles.carousel} 
        ref={carouselRef}
        onScroll={handleScroll}
      >
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className={`${styles['carousel-item']} ${
              index === activeIndex ? styles.active : ''
            }`}
          >
            <ProductCard product={product} centered={index === activeIndex} />
          </div>
        ))}
      </div>
      
      {showControls && (
        <button 
          className={`${styles['carousel-control']} ${styles.next}`}
          onClick={scrollNext}
          aria-label="Next products"
        >
          &#8250;
        </button>
      )}
    </div>
  );
}
