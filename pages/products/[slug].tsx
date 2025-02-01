import { GetStaticPaths, GetStaticProps } from 'next';
import { useCart } from '../../context/cartContext';
import Stripe from 'stripe';
import ProductCard from '../../components/ProductCard';
import s from './ProductPage.module.css';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
}

interface ProductPageProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductPage({ product, relatedProducts }: ProductPageProps) {
  const { addToCart } = useCart();

  return (
    <div className={s["product-page"]}>
        <h1 className={s.title}>{product.name}</h1>
        <img src={product.image} alt={product.name} style={{ width: '200px', height: '200px' }} className={s.img}/>

      
      <div className={s.ordering}>
        <p>
          {product.price} {product.currency}
        </p>
        <button type="button" onClick={() => addToCart({ ...product, quantity: 1 })}>Add to Cart</button>
      </div>

      {product.description && (
        <div className={s.description}>
          <h2>Description</h2>
          <p>{product.description}</p>
        </div>
      )}

      {relatedProducts.length > 0 && (
        <div className={s.recommendations}>
          <h2>Related Products</h2>
          <ul className='product-list'>
            {relatedProducts.map((relatedProduct) => (
              <li key={relatedProduct.id}>
                <ProductCard product={relatedProduct} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  const prices = await stripe.prices.list({
    expand: ['data.product'],
  });

  const product = prices.data.find((price) => {
    const product = price.product as Stripe.Product;
    return product.metadata.slug === params?.slug;
  });

  if (!product) {
    return {
      notFound: true,
    };
  }


  const productProduct = product.product as Stripe.Product;

  const relatedSlugs = productProduct.metadata.related?.split(',') || [];
  const relatedProducts = prices.data
    .filter((price) => {
      const relatedProduct = price.product as Stripe.Product;
      return relatedSlugs.includes(relatedProduct.metadata.slug);
    })
    .map((price) => {
      const relatedProduct = price.product as Stripe.Product;
      return {
        id: price.id,
        slug: relatedProduct.metadata.slug,
        name: relatedProduct.name,
        description: relatedProduct.description,
        price: (price.unit_amount ?? 0) / 100,
        currency: price.currency.toUpperCase(),
        image: relatedProduct.images.length > 0 ? relatedProduct.images[0] : '/images/placeholder.png',
      };
    });

  const productData = {
    id: product.id,
    slug: productProduct.metadata.slug,
    name: productProduct.name,
    description: productProduct.description,
    price: (product.unit_amount ?? 0) / 100,
    currency: product.currency.toUpperCase(),
    image: productProduct.images.length > 0 ? productProduct.images[0] : '/images/placeholder.png',
  };

  return {
    props: {
      product: productData,
      relatedProducts,
    },
  };
};