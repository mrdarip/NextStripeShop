import Link from 'next/link';
import { useCart } from '../context/cartContext';
import styles from './ProductCard.module.css';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <article className={styles['product-card']}>
      <Link href={`/products/${product.slug}`}>
        <img src={product.image} alt={product.name} className={styles['product-card img']} />
        <h3 className={styles['product-card h3']}>{product.name}</h3>
      </Link>
      <p className={styles['product-card p']}>{product.description}</p>
      <p className={styles['product-card p']}>
        {product.price} {product.currency}
      </p>
      <button className={styles['product-card button']} onClick={() => addToCart({ ...product, quantity: 1 })}>Add to Cart</button>
    </article>
  );
};

export default ProductCard;