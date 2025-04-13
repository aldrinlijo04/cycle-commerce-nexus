
export interface User {
  id: number;
  username: string;
  companyName: string;
  email: string;
  role: 'admin' | 'company';
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  category?: ProductCategory;
  measurementUnit: string;
}

export interface Supply {
  id: number;
  productId: number;
  product?: Product;
  quantity: number;
  price: number;
  location: string;
  available: boolean;
  createdBy: number;
  createdAt: string;
}

export interface Demand {
  id: number;
  productId: number;
  product?: Product;
  quantity: number;
  maxPrice: number;
  location: string;
  active: boolean;
  createdBy: number;
  createdAt: string;
}

export interface Exchange {
  id: number;
  supplyId: number;
  demandId: number;
  supply?: Supply;
  demand?: Demand;
  quantity: number;
  price: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}
