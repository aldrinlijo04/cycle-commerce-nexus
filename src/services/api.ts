
import { ProductCategory, Product, Supply, Demand, Exchange } from '../types';

// Mock data
const categories: ProductCategory[] = [
  { id: 1, name: 'Plastics', description: 'Various plastic materials and byproducts' },
  { id: 2, name: 'Metals', description: 'Metal scraps and byproducts' },
  { id: 3, name: 'Chemicals', description: 'Chemical substances and compounds' },
  { id: 4, name: 'Paper', description: 'Paper waste and byproducts' },
  { id: 5, name: 'Textiles', description: 'Textile waste and byproducts' }
];

const products: Product[] = [
  { id: 1, name: 'PET Scraps', description: 'Polyethylene terephthalate scraps', categoryId: 1, measurementUnit: 'kg' },
  { id: 2, name: 'HDPE Waste', description: 'High-density polyethylene waste', categoryId: 1, measurementUnit: 'kg' },
  { id: 3, name: 'Steel Shavings', description: 'Steel manufacturing shavings', categoryId: 2, measurementUnit: 'kg' },
  { id: 4, name: 'Aluminum Scrap', description: 'Recyclable aluminum scrap', categoryId: 2, measurementUnit: 'kg' },
  { id: 5, name: 'Acetic Acid', description: 'Surplus acetic acid', categoryId: 3, measurementUnit: 'L' },
  { id: 6, name: 'Cardboard', description: 'Used cardboard packaging', categoryId: 4, measurementUnit: 'kg' },
  { id: 7, name: 'Cotton Waste', description: 'Cotton textile waste', categoryId: 5, measurementUnit: 'kg' },
];

const supplies: Supply[] = [
  { 
    id: 1, 
    productId: 1, 
    quantity: 500, 
    price: 0.75, 
    location: 'Chicago, IL', 
    available: true, 
    createdBy: 2,
    createdAt: '2023-04-01T10:00:00Z'
  },
  { 
    id: 2, 
    productId: 3, 
    quantity: 1000, 
    price: 1.25, 
    location: 'Detroit, MI', 
    available: true, 
    createdBy: 3,
    createdAt: '2023-04-05T14:30:00Z'
  },
  { 
    id: 3, 
    productId: 6, 
    quantity: 750, 
    price: 0.30, 
    location: 'Indianapolis, IN', 
    available: true, 
    createdBy: 2,
    createdAt: '2023-04-10T09:15:00Z'
  },
];

const demands: Demand[] = [
  { 
    id: 1, 
    productId: 1, 
    quantity: 200, 
    maxPrice: 1.00, 
    location: 'Cincinnati, OH', 
    active: true, 
    createdBy: 3,
    createdAt: '2023-04-02T11:20:00Z'
  },
  { 
    id: 2, 
    productId: 2, 
    quantity: 300, 
    maxPrice: 0.80, 
    location: 'Columbus, OH', 
    active: true, 
    createdBy: 4,
    createdAt: '2023-04-07T16:45:00Z'
  },
  { 
    id: 3, 
    productId: 7, 
    quantity: 150, 
    maxPrice: 0.50, 
    location: 'Louisville, KY', 
    active: true, 
    createdBy: 5,
    createdAt: '2023-04-12T13:10:00Z'
  },
];

const exchanges: Exchange[] = [
  {
    id: 1,
    supplyId: 1,
    demandId: 1,
    quantity: 200,
    price: 0.85,
    status: 'completed',
    createdAt: '2023-04-15T10:30:00Z'
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API service
export const api = {
  // Product Categories
  getCategories: async (): Promise<ProductCategory[]> => {
    await delay(300);
    return [...categories];
  },
  
  getCategoryById: async (id: number): Promise<ProductCategory | undefined> => {
    await delay(200);
    return categories.find(cat => cat.id === id);
  },
  
  // Products
  getProducts: async (): Promise<Product[]> => {
    await delay(300);
    return products.map(product => ({
      ...product,
      category: categories.find(cat => cat.id === product.categoryId)
    }));
  },
  
  getProductById: async (id: number): Promise<Product | undefined> => {
    await delay(200);
    const product = products.find(p => p.id === id);
    if (!product) return undefined;
    
    return {
      ...product,
      category: categories.find(cat => cat.id === product.categoryId)
    };
  },
  
  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    await delay(300);
    return products
      .filter(product => product.categoryId === categoryId)
      .map(product => ({
        ...product,
        category: categories.find(cat => cat.id === product.categoryId)
      }));
  },
  
  // Supplies
  getSupplies: async (): Promise<Supply[]> => {
    await delay(300);
    return await Promise.all(supplies.map(async supply => {
      const product = await api.getProductById(supply.productId);
      return { ...supply, product };
    }));
  },
  
  createSupply: async (supply: Omit<Supply, 'id' | 'createdAt'>): Promise<Supply> => {
    await delay(500);
    const newSupply: Supply = {
      ...supply,
      id: supplies.length + 1,
      createdAt: new Date().toISOString()
    };
    supplies.push(newSupply);
    return newSupply;
  },
  
  // Demands
  getDemands: async (): Promise<Demand[]> => {
    await delay(300);
    return await Promise.all(demands.map(async demand => {
      const product = await api.getProductById(demand.productId);
      return { ...demand, product };
    }));
  },
  
  createDemand: async (demand: Omit<Demand, 'id' | 'createdAt'>): Promise<Demand> => {
    await delay(500);
    const newDemand: Demand = {
      ...demand,
      id: demands.length + 1,
      createdAt: new Date().toISOString()
    };
    demands.push(newDemand);
    return newDemand;
  },
  
  // Exchanges
  getExchanges: async (): Promise<Exchange[]> => {
    await delay(300);
    return await Promise.all(exchanges.map(async exchange => {
      const supply = (await api.getSupplies()).find(s => s.id === exchange.supplyId);
      const demand = (await api.getDemands()).find(d => d.id === exchange.demandId);
      return { ...exchange, supply, demand };
    }));
  },
  
  createExchange: async (exchange: Omit<Exchange, 'id' | 'createdAt'>): Promise<Exchange> => {
    await delay(500);
    const newExchange: Exchange = {
      ...exchange,
      id: exchanges.length + 1,
      createdAt: new Date().toISOString()
    };
    exchanges.push(newExchange);
    return newExchange;
  },
};
