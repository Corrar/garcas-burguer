export type Category = 'burgers' | 'drinks' | 'sides' | 'combos' | 'extras';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  popular?: boolean;
  customizations?: string[];
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  removals: string[];
  additions: { name: string; price: number }[];
  notes: string;
  unitPrice: number;
}

export type OrderType = 'delivery' | 'pickup' | 'dine-in';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered';
export type PaymentMethod = 'app_pix' | 'app_card' | 'delivery_cash' | 'delivery_card';

export interface Order {
  id: string;
  orderType: OrderType;
  tableNumber?: string;
  number: number;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  changeFor?: number;
  customerNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  burgers: 'Hambúrgueres',
  drinks: 'Bebidas',
  sides: 'Acompanhamentos',
  combos: 'Combos',
  extras: 'Adicionais',
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  preparing: 'Em Preparo',
  ready: 'Pronto',
  delivered: 'Entregue',
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  app_pix: 'PIX (Pelo App)',
  app_card: 'Cartão de Crédito (Pelo App)',
  delivery_cash: 'Dinheiro',
  delivery_card: 'Maquininha (Débito/Crédito)',
};

export interface PromoBanner {
  id: string;
  imageUrl: string;
  title: string;
  active: boolean;
}

export interface StoreSettings {
  isOpen: boolean;
  deliveryFee: number;
  estimatedDeliveryTime: string;
  minimumOrderValue: number;
}
