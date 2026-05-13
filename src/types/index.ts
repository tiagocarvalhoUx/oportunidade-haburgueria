export type ProductCategory =
  | 'all'
  | 'refrigeracao'
  | 'cozinha'
  | 'mobiliario'
  | 'atendimento'
  | 'exaustao'
  | 'utensilios'
  | 'promocoes'
  | 'vendidos';

export type ProductStatus = 'disponivel' | 'reservado' | 'vendido';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  priceLabel?: string;
  minPrice?: number;
  maxPrice?: number;
  category: ProductCategory;
  image: string;
  gallery?: string[];
  features: string[];
  condition: string;
  status: ProductStatus;
  isPromotion?: boolean;
  originalPrice?: number;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role?: string;
  rating: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  badge: string;
  color: string;
}
