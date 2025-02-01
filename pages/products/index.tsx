import { GetStaticProps } from 'next';
import { useState } from 'react';
import Stripe from 'stripe';
import ProductCard from '../../components/ProductCard';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
}

interface ProductsPageProps {
  products: Product[];
}

export default function ProductsPage({ products }: ProductsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(term) || product.description?.toLowerCase().includes(term)
      )
    );
  };

  return (
    <div>
      <h1>Products</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
      />
      <ul className='product-list'>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  const prices = await stripe.prices.list({
    expand: ['data.product'],
  });

  const products = prices.data.map((price) => {
    const product = price.product as Stripe.Product;
    return {
      id: price.id,
      slug: product.metadata.slug,
      name: product.name,
      description: product.description,
      price: (price.unit_amount ?? 0) / 100,
      currency: price.currency.toUpperCase(),
      image: product.images.length > 0 ? product.images[0] : '/images/placeholder.png',
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60, // ISR: Revalidate every 60 seconds
  };
};