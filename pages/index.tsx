import { GetStaticProps } from 'next';
import Stripe from 'stripe';
import ProductCard from '../components/ProductCard';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
}

interface HomeProps {
  products: Product[];
}

export default function Home({ products }: HomeProps) {
  return (
    <div>
      <section className='products'>
        <h2>Products</h2>
        <ul className='product-list'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      </section>
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
      slug: product.metadata.slug, // Use the slug from metadata
      name: product.name,
      description: product.description,
      price: (price.unit_amount ?? 99999) / 100,
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