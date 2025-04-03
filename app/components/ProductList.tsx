import ProductCard from './ProductCard';

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
  return (
    <ul className='product-list'>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}