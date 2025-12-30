
export enum Category {
  Medicamentos = 'Medicamentos',
  Dermocosmeticos = 'Dermocosméticos',
  Vitaminas = 'Vitaminas',
  Higiene = 'Higiene',
  Bebes = 'Bebés y Mamás',
  Nutricion = 'Nutrición Deportiva'
}

export enum PrescriptionStatus {
  Required = 'Required',
  Optional = 'Optional',
  NotRequired = 'NotRequired'
}

export interface User {
  email: string;
  role: 'superadmin' | 'store_admin';
  storeId?: string;
}

export interface StoreConfig {
  id?: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  odooUrl: string;
  odooDb: string;
  odooUser: string;
  odooKey: string;
  status?: 'active' | 'pending' | 'error';
}

export interface Product {
  id: string;
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
}

export interface CartItem extends Product {
  quantity: number;
}
