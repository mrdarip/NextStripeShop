export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image: string;
}