export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  image: string;
  palette?: string | null;
  type?: string;
}