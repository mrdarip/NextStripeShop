import Link from 'next/link';
import { useCart } from '../context/cartContext';

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
    <li>
      <article>
        <Link href={`/products/${product.slug}`}>
          <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px', cursor: 'pointer' }} />
          <h3>{product.name}</h3>
        </Link>
        <p>{product.description}</p>
        <p>
          {product.price} {product.currency}
        </p>
        <button onClick={() => addToCart({ ...product, quantity: 1 })}>Add to Cart</button>
      </article>
    </li>
  );
};

export default ProductCard;