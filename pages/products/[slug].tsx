import { GetStaticPaths, GetStaticProps } from 'next';
import Stripe from 'stripe';

interface ProductProps {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    image: string;
  };
}

export default function Product({ product }: ProductProps) {
  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} style={{ width: '200px', height: '200px' }} />
      <p>{product.description}</p>
      <p>
        {product.price} {product.currency}
      </p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15',
  });

  const prices = await stripe.prices.list({
    expand: ['data.product'],
  });

  const paths = prices.data.map((price) => {
    const product = price.product as Stripe.Product;
    return {
      params: { slug: product.metadata.slug },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15',
  });

  const prices = await stripe.prices.list({
    expand: ['data.product'],
  });

  const price = prices.data.find((price) => {
    const product = price.product as Stripe.Product;
    return product.metadata.slug === params.slug;
  });

  if (!price) {
    return {
      notFound: true,
    };
  }

  const product = price.product as Stripe.Product;

  return {
    props: {
      product: {
        id: price.id,
        slug: product.metadata.slug,
        name: product.name,
        description: product.description,
        price: price.unit_amount / 100,
        currency: price.currency.toUpperCase(),
        image: product.images.length > 0 ? product.images[0] : '/images/placeholder.png',
      },
    },
  };
};