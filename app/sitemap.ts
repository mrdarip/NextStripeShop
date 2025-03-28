import type { MetadataRoute } from 'next';
import Stripe from 'stripe';

// Define your website's base URL - you'll need to update this
const BASE_URL = process.env.SITE_URL || 'https://example.com';

// Helper function to get all products from Stripe
async function getAllProducts() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const prices = await stripe.prices.list({
    expand: ['data.product'],
    limit: 100, // Adjust as needed
  });
  
  return prices.data.map((price) => {
    const product = price.product as Stripe.Product;
    return {
      slug: product.metadata.slug,
      updatedAt: product.updated || new Date(),
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all products
  const products = await getAllProducts();
  
  // Define static pages with their priorities and change frequencies
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/success`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/cancel`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  // Create product pages entries
  const productPages = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Combine all URLs
  return [...staticPages, ...productPages];
}
