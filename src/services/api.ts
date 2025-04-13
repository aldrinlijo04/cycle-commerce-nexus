import { ProductCategory, Product, Supply, Demand, Exchange, User } from '../types';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication service
export const auth = {
  login: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      return response.data;
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  },
  
  register: async (userData: { username: string; password: string; email: string; companyName: string }): Promise<{ user: User; token: string }> => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error('Registration failed');
    }
  }
};

// API service
export const api = {
  // Product Categories
  getCategories: async (): Promise<ProductCategory[]> => {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
  
  getCategoryById: async (id: number): Promise<ProductCategory | undefined> => {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return undefined;
    }
  },
  
  // Products
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  
  getProductById: async (id: number): Promise<Product | undefined> => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return undefined;
    }
  },
  
  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    try {
      const response = await apiClient.get(`/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      return [];
    }
  },
  
  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const response = await apiClient.post('/products', product);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  },
  
  // Supplies
  getSupplies: async (): Promise<Supply[]> => {
    try {
      const response = await apiClient.get('/supplies');
      return response.data;
    } catch (error) {
      console.error('Error fetching supplies:', error);
      return [];
    }
  },
  
  createSupply: async (supply: Omit<Supply, 'id' | 'createdAt'>): Promise<Supply> => {
    try {
      const response = await apiClient.post('/supplies', supply);
      return response.data;
    } catch (error) {
      console.error('Error creating supply:', error);
      throw new Error('Failed to create supply');
    }
  },
  
  // Demands
  getDemands: async (): Promise<Demand[]> => {
    try {
      const response = await apiClient.get('/demands');
      return response.data;
    } catch (error) {
      console.error('Error fetching demands:', error);
      return [];
    }
  },
  
  createDemand: async (demand: Omit<Demand, 'id' | 'createdAt'>): Promise<Demand> => {
    try {
      const response = await apiClient.post('/demands', demand);
      return response.data;
    } catch (error) {
      console.error('Error creating demand:', error);
      throw new Error('Failed to create demand');
    }
  },
  
  // Exchanges
  getExchanges: async (): Promise<Exchange[]> => {
    try {
      const response = await apiClient.get('/exchanges');
      return response.data;
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      return [];
    }
  },
  
  createExchange: async (exchange: Omit<Exchange, 'id' | 'createdAt'>): Promise<Exchange> => {
    try {
      const response = await apiClient.post('/exchanges', exchange);
      return response.data;
    } catch (error) {
      console.error('Error creating exchange:', error);
      throw new Error('Failed to create exchange');
    }
  },
};
