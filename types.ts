
export enum Category {
  Medicamentos = 'Medicamentos',
  Dermocosmeticos = 'Dermocosméticos',
  Vitaminas = 'Vitaminas',
  Higiene = 'Higiene',
  Bebes = 'Bebés y Mamás',
  Nutricion = 'Nutrición Deportiva',
  Ofertas = 'Ofertas Especiales'
}

export enum PrescriptionStatus {
  Required = 'Required',
  Optional = 'Optional',
  NotRequired = 'NotRequired'
}

export enum OrderStatus {
  Received = 'received',
  Validated = 'validated',
  Preparing = 'preparing',
  Shipped = 'shipped',
  Delivered = 'delivered'
}

export interface OrderStep {
  status: OrderStatus;
  title: string;
  desc: string;
  time: string;
  completed: boolean;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  address: string;
  total: number;
  date: string;
  status: OrderStatus;
  items: any[];
  history: OrderStep[];
}

export interface HeroSlide {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  isActive: boolean;
  badge: string;
}

export interface MobilePaymentMethod {
  id: string;
  name: string;
  identifier: string;
  qrCodeUrl?: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  odooId: number;
  name: string;
  genericName?: string;
  activeIngredient?: string;
  brand: string;
  price: number;
  oldPrice?: number;
  category: Category;
  prescription: PrescriptionStatus;
  description: string;
  dosage: string;
  format: string;
  stock: number;
  image: string;
  thumbnails: string[];
  laboratory: string;
  registrationNumber: string;
  expiryDate: string;
  published: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OdooSession {
  url: string;
  db: string;
  username: string;
  apiKey: string;
  uid: number;
  companyId: number;
  useProxy: boolean;
}

export interface StoreSettings {
  storeName: string;
  logoUrl?: string; 
  footerLogoUrl?: string; 
  primaryColor: string;
  footerText: string;
  currencySymbol: string;
  currencyCode: string;
  locale: string;
  country: string; // Nuevo campo
  mobilePayments: MobilePaymentMethod[];
  whatsappNumber?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialTikTok?: string;
  allowDelivery: boolean;
  allowPickup: boolean;
  promoActive: boolean;
  promoImage?: string;
  promoTitle?: string;
  heroSlides: HeroSlide[];
}

export interface PickupLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
}

export interface WebCategoryMap {
  odooCategoryId: number;
  webCategory: Category;
}
