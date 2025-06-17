import Stripe from 'stripe';
import ProductList from '../components/product-card/ProductList';
import ProductCarrousel from '../components/product-card/ProductCarrousel';
import Banner from '../components/banner/Banner';

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

export default async function HomePage() {
  const products = await getProducts();
  
  // Filter products by type for featured carousel
  const featuredProducts = products.filter(product => 
    product.type === 'featured' || product.price > 50
  ).slice(0, 8); // Limit to 8 items for carousel
  
  // New arrivals could be the most recent products
  const newArrivals = [...products].sort(() => 0.5 - Math.random()).slice(0, 6);

  return (
    <main>
      <Banner />
      
      {featuredProducts.length > 0 && (
        <ProductCarrousel 
          products={featuredProducts}
        />
      )}
      
      {newArrivals.length > 0 && (
        <ProductCarrousel 
          products={newArrivals}
        />
      )}
      
      <h1 className="page-title">All Products</h1>
      <ProductList products={products} />
    </main>
  );
}
