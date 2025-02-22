import Stripe from 'stripe';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ProductCard from '@/app/components/ProductCard';
import s from './ProductPage.module.css';
import type { Metadata, ResolvingMetadata } from 'next';
import AddToCartButton from './AddToCartButton';

async function getProduct(slug: string) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const prices = await stripe.prices.list({
    expand: ['data.product'],
  });
  
  const product = prices.data.find((price) => {
    const product = price.product as Stripe.Product;
    return product.metadata.slug === slug;
  });

  if (!product) return null;

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

  return {
    product: {
      id: product.id,
      slug: productProduct.metadata.slug,
      name: productProduct.name,
      description: productProduct.description,
      price: (product.unit_amount ?? 0) / 100,
      currency: product.currency.toUpperCase(),
      image: productProduct.images.length > 0 ? productProduct.images[0] : '/images/placeholder.png',
    },
    relatedProducts
  };
}

export async function generateMetadata(
  props: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const data = await getProduct(props.params.slug);
  if (!data) return { title: 'Product Not Found' };
  
  return {
    title: data.product.name,
    description: data.product.description || undefined,
  };
}

export default async function ProductPage(props: any) {
  const data = await getProduct(props.params.slug);
  if (!data) notFound();
  
  const { product, relatedProducts } = data;

  return (
    <div className={s["product-page"]}>
      <h1 className={s.title}>{product.name}</h1>
      <Image 
        src={product.image} 
        alt={product.name} 
        width={200} 
        height={200}
        className={s.img}
        style={{ objectFit: 'cover' }}
      />
      
      <div className={s.ordering}>
        <p>
          {product.price} {product.currency}
        </p>
        <AddToCartButton product={product} />
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