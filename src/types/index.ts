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

  /** true = card exibe badge "📷 Foto real" */
  hasRealPhotos?: boolean;

  /** false = desliga badge "🔧 Teste no local". Default tratado como true no componente. */
  testAvailable?: boolean;

  /** Ficha técnica estruturada. Modal só renderiza chaves preenchidas. */
  specs?: {
    dimensions?: string;
    voltage?: '110V' | '220V' | 'Bivolt';
    power?: string;
    capacity?: string;
    brand?: string;
    yearOfManufacture?: string;
  };
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
