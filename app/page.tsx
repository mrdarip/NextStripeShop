import Stripe from 'stripe';
import ProductCard from './components/ProductCard';

async function getProducts() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const prices = await stripe.prices.list({
    expand: ['data.product'],
  });
  
  return prices.data.map((price) => {
    const product = price.product as Stripe.Product;
    return {
      id: price.id,
      slug: product.metadata.slug,
      name: product.name,
      description: product.description,
      price: (price.unit_amount ?? 99999) / 100,
      currency: price.currency.toUpperCase(),
      image: product.images.length > 0 ? product.images[0] : '/images/placeholder.png',
    };
  });
}

export default async function Home() {
  const products = await getProducts();
  
  return (
    <div>
      <section className='products'>
        <h2>Products</h2>
        <ul className='product-list'>
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}