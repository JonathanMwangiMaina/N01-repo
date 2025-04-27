import { 
  type Product, 
  type CartItem,
  type CartItemWithProduct, 
  type InsertCartItem, 
  type Order, 
  type InsertOrder, 
  type OrderItem, 
  type InsertOrderItem,
} from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getNewArrivals(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Cart
  getCartItems(cartId: string): Promise<CartItemWithProduct[]>;
  getCartItem(cartId: string, productId: number): Promise<CartItemWithProduct | undefined>;
  addCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  
  // Orders
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
}

// Import the Database Storage implementation 
import { DatabaseStorage } from './database-storage';

// Export a database storage instance
export const storage = new DatabaseStorage();