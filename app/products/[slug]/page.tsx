import Stripe from "stripe";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/app/components/product-card/ProductCard";
import s from "./ProductPage.module.css";
import type { Metadata, ResolvingMetadata } from "next";
import AddToCartButton from "./AddToCartButton";
import ServerPalette from "@/app/components/ServerPalette";
import Canvas from "@/app/components/draw/Canvas";
import { Product } from "@/app/types";
import PixelArtCanvas from "@/app/components/draw/PixelArtCanvas";
import { getPaletteStyleObject } from "@/app/components/PaletteTool";
import ProductList from "@/app/components/product-card/ProductList";
import ProductCarrousel from "@/app/components/product-card/ProductCarrousel";

async function getProduct(slug: string) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const prices = await stripe.prices.list({
    expand: ["data.product"],
  });

  const product = prices.data.find((price) => {
    const product = price.product as Stripe.Product;
    return product.metadata.slug === slug;
  });
  if (!product) return null;
  const productProduct = product.product as Stripe.Product;
  const relatedSlugs = productProduct.metadata.related?.split(",") || [];
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
        image:
          relatedProduct.images.length > 0
            ? relatedProduct.images[0]
            : "/images/placeholder.png",
        type: relatedProduct.metadata.type || "default", // Add default type
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
      image:
        productProduct.images.length > 0
          ? productProduct.images[0]
          : "/images/placeholder.png",
      palette: productProduct.metadata.palette || null,
      type: productProduct.metadata.type || "default", // Use default if no type is specified
    } as Product,
    relatedProducts,
  };
}

export async function generateMetadata(
  props: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const data = await getProduct(params.slug);
  if (!data) return { title: "Product Not Found" };

  return {
    title: data.product.name,
    description: data.product.description || undefined,
  };
}

export async function generateViewport(
  props: any
): Promise<{ themeColor: string }> {
  const params = await props.params;
  const data = await getProduct(params.slug);
  const product = data?.product.palette || "default";

  const colors = getPaletteStyleObject(product);

  return {
    themeColor: colors?.primary || "#97bae2",
  };
}

export default async function ProductPage(props: any) {
  const params = await props.params;
  const data = await getProduct(params.slug);
  if (!data) notFound();

  const { product, relatedProducts } = data;

  // Check if this is a drawing product

  return (
    <div className={s["product-page"]}>
      {/* Apply product-specific palette server-side */}
      <ServerPalette palette={product.palette || null} />

      <Image
        src={product.image}
        alt={product.name}
        width={1920}
        height={1080}
        sizes="100vw"
        className={s.img}
        style={{ objectFit: "cover" }}
      />

      <div className={s.ordering}>
        <h1 className={s.title}>{product.name}</h1>
        <p>
          {product.price} {product.currency}
        </p>
      </div>

      {product.type === "draw" ? (
        /* If this is a drawing product, render the Canvas component */
        <div className={s.drawingSection}>
          <h2>Draw on the Canvas!</h2>
          <Canvas />
        </div>
      ) : (
        product.type === "pixel" && (
          /* Render the pixel art product details */
          <div className={s.pixelArtSection}>
            <h2>Pixel Art Product</h2>
            <PixelArtCanvas />
          </div>
        )
      )}

      <AddToCartButton product={product} />

      {product.description && (
        <div className={s.description}>
          <h2>Description</h2>
          <p dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      )}

      {relatedProducts.length > 0 && (
        <div className={s.recommendations}>
          <h2>Related Products</h2>
          <hr className={s.divider} />

          <ProductCarrousel
            products={relatedProducts}
          />
        </div>
      )}
    </div>
  );
}
