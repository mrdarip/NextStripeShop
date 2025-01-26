import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useCart } from '../context/cartContext';
import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

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
  const { addToCart } = useCart();

  return (
    <div>
      <section className='products'>
        <h2>Products</h2>
        <ul className='product-list'>
          {products.map((product) => (
            <li key={product.id}>
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
      image: product.images.length > 0 ? product.images[0] : 'images/placeholder.png',
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60, // ISR: Revalidate every 60 seconds
  };
};