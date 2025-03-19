import Stripe from 'stripe';
import ProductCard from './components/ProductCard';

async function getProducts() {//TODO: merge with getProduct(slug: string) in app/products/[slug]/page.tsx
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const prices = await stripe.prices.list({
    expand: ['data.product'],
  });
  
  const products = prices.data.map((price) => {
    const product = price.product as Stripe.Product;
    return {
      id: price.id,
      slug: product.metadata.slug,
      type: product.metadata.type,
      name: product.name,
      description: product.description,
      price: (price.unit_amount ?? 99999) / 100,
      currency: price.currency.toUpperCase(),
      image: product.images.length > 0 ? product.images[0] : '/images/placeholder.png',
    };
  });


  // Sort products by price, or any other criteria
  return products.sort((a, b) => {
    return a.price - b.price;
  });
}

export default async function Home() {
  const products = await getProducts();
  
  return (
    <div>
      <section className='products'>
        <h2>Products</h2>
        <ul className='product-list'>
            {products.filter(prod => !prod.type || prod.type === "default").map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
      {products.filter(prod => prod.type == "draw").length > 0 && (

      <section className='products'>
        <h2>Create your own!</h2>
        <ul className='product-list'>
          {products.filter(prod => prod.type == "draw").map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
      )}
    </div>
  );
}