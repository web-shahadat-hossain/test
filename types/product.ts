export interface Product {
  id?: number;
  name: string;
  description: string;
  price: string;

  // নিচের ফিল্ডগুলো optional করে দাও
  title?: string;
  images?: string[];
  color?: string[]; // spelling check করো: colors নাকি color?
  isHighlighted?: boolean;
  sizes?: string[];
  image?: string; // fallback single image
  category?: string;
}

export interface ProductsResponse {
  products: Product[];
}
