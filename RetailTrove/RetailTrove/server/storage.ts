import { 
  Product, InsertProduct, 
  CartItem, InsertCartItem, CartItemWithProduct,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
} from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getNewArrivals(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Cart
  getCartItems(cartId: string): Promise<CartItemWithProduct[]>;
  getCartItem(cartId: string, productId: number): Promise<CartItemWithProduct | undefined>;
  addCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  
  // Orders
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    
    // Initialize with sample products
    this.initializeProducts();
  }
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      return undefined;
    }

    const updatedProduct = { ...existingProduct, ...productData, id };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  deleteProduct(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getAllOrders(): Promise<Order[]> {
    throw new Error("Method not implemented.");
  }

  // Product Methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category || category === 'All Products'
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.featured
    );
  }

  async getNewArrivals(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.newArrival
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchLower = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
    );
  }

  // Cart Methods
  async getCartItems(cartId: string): Promise<CartItemWithProduct[]> {
    return Array.from(this.cartItems.values())
      .filter((item) => item.cartId === cartId)
      .map((item) => {
        const product = this.products.get(item.productId);
        if (!product) {
          throw new Error(`Product not found for cart item: ${item.id}`);
        }
        return { ...item, product };
      });
  }

  async getCartItem(cartId: string, productId: number): Promise<CartItemWithProduct | undefined> {
    const cartItem = Array.from(this.cartItems.values()).find(
      (item) => item.cartId === cartId && item.productId === productId
    );
    
    if (!cartItem) return undefined;
    
    const product = this.products.get(cartItem.productId);
    if (!product) return undefined;
    
    return { ...cartItem, product };
  }

  async addCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if this product exists
    const product = this.products.get(cartItem.productId);
    if (!product) {
      throw new Error(`Product not found: ${cartItem.productId}`);
    }

    // Check if product already in cart, if so update quantity
    const existingCartItem = Array.from(this.cartItems.values()).find(
      (item) => item.cartId === cartItem.cartId && item.productId === cartItem.productId
    );

    if (existingCartItem) {
      existingCartItem.quantity += cartItem.quantity ?? 0;
      this.cartItems.set(existingCartItem.id, existingCartItem);
      return existingCartItem;
    }

    // Otherwise add new cart item
    const id = this.currentCartItemId++;
    const newCartItem: CartItem = { id, ...cartItem, quantity: cartItem.quantity ?? 1 };
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }
    
    cartItem.quantity = quantity;
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  // Order Methods
  async createOrder(orderData: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const orderId = this.currentOrderId++;
    const order: Order = { 
      id: orderId, 
      ...orderData,
      apartment: orderData.apartment ?? null,
      createdAt: new Date()
    };
    
    this.orders.set(orderId, order);
    
    // Create order items
    items.forEach(item => {
      const orderItemId = this.currentOrderItemId++;
      const orderItem: OrderItem = {
        id: orderItemId,
        ...item,
        quantity: item.quantity ?? 0, // Ensure quantity is always a number
        orderId
      };
      this.orderItems.set(orderItemId, orderItem);
    });
    
    return order;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  // Initialize with sample products
  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Premium Watch",
        description: "This premium stainless steel watch combines elegant design with precision craftsmanship. Featuring a scratch-resistant sapphire crystal face, water resistance up to 100 meters, and a comfortable silicone strap.",
        price: "299.99",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Accessories",
        subcategory: "Watches",
        badge: "NEW",
        featured: true,
        newArrival: false,
        inStock: true,
        rating: "5.0"
      },
      {
        name: "Wireless Headphones",
        description: "Experience immersive sound with these premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
        price: "149.99",
        imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Electronics",
        subcategory: "Audio",
        badge: "",
        featured: true,
        newArrival: false,
        inStock: true,
        rating: "4.5"
      },
      {
        name: "Classic Sneakers",
        description: "Timeless design meets modern comfort in these classic sneakers. Features a durable canvas upper, cushioned insole, and rubber outsole for traction.",
        price: "89.99",
        originalPrice: "119.99",
        imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Footwear",
        subcategory: "Sneakers",
        badge: "SALE",
        featured: true,
        newArrival: false,
        inStock: true,
        rating: "4.8"
      },
      {
        name: "Leather Backpack",
        description: "Crafted from premium full-grain leather, this backpack features multiple compartments, laptop sleeve, and adjustable straps for comfort.",
        price: "199.99",
        imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Accessories",
        subcategory: "Bags",
        badge: "",
        featured: true,
        newArrival: false,
        inStock: true,
        rating: "4.9"
      },
      {
        name: "Minimalist Tote Bag",
        description: "Simple yet elegant tote bag made from durable canvas. Features inner pockets and magnetic closure. Perfect for daily use.",
        price: "79.99",
        imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Accessories",
        subcategory: "Bags",
        badge: "NEW",
        featured: false,
        newArrival: true,
        inStock: true,
        rating: "4.6"
      },
      {
        name: "Smart Watch Pro",
        description: "Track your fitness, receive notifications, and more with this advanced smartwatch. Water-resistant with a 5-day battery life.",
        price: "249.99",
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Electronics",
        subcategory: "Wearables",
        badge: "NEW",
        featured: false,
        newArrival: true,
        inStock: true,
        rating: "4.7"
      },
      {
        name: "Minimalist Lamp",
        description: "Add elegant ambient lighting to your home with this minimalist lamp. Features adjustable brightness and warm white light.",
        price: "129.99",
        imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Home & Living",
        subcategory: "Lighting",
        badge: "NEW",
        featured: false,
        newArrival: true,
        inStock: true,
        rating: "4.5"
      },
      {
        name: "Cotton T-Shirt",
        description: "Made from 100% organic cotton, this comfortable t-shirt is a wardrobe essential that's perfect for everyday wear.",
        price: "29.99",
        imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Clothing",
        subcategory: "T-Shirts",
        badge: "",
        featured: false,
        newArrival: false,
        inStock: true,
        rating: "4.4"
      },
      {
        name: "Denim Jacket",
        description: "Classic denim jacket featuring a button front, chest pockets, and adjustable waistband. A timeless addition to any wardrobe.",
        price: "89.99",
        imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Clothing",
        subcategory: "Jackets",
        badge: "",
        featured: false,
        newArrival: false,
        inStock: true,
        rating: "4.6"
      },
      {
        name: "Ceramic Coffee Mug",
        description: "Handcrafted ceramic mug with a matte finish. Microwave and dishwasher safe. Holds 12oz of your favorite beverage.",
        price: "24.99",
        imageUrl: "https://images.unsplash.com/photo-1611704906392-c2cb00521051?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Home & Living",
        subcategory: "Kitchen",
        badge: "",
        featured: false,
        newArrival: false,
        inStock: true,
        rating: "4.8"
      },
      {
        name: "Portable Bluetooth Speaker",
        description: "Compact speaker with impressive sound quality. Water-resistant with 10-hour battery life and built-in microphone for calls.",
        price: "69.99",
        imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Electronics",
        subcategory: "Audio",
        badge: "",
        featured: false,
        newArrival: false,
        inStock: true,
        rating: "4.3"
      },
      {
        name: "Yoga Mat",
        description: "Premium non-slip yoga mat made from eco-friendly TPE material. 6mm thickness provides cushioning for joints.",
        price: "45.99",
        imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Sporting Goods",
        subcategory: "Fitness",
        badge: "",
        featured: false,
        newArrival: false,
        inStock: true,
        rating: "4.7"
      }
    ];

    sampleProducts.forEach((product) => {
      const id = this.currentProductId++;
      this.products.set(id, {
        id,
        ...product,
        subcategory: product.subcategory ?? null,
        originalPrice: product.originalPrice ?? null,
        badge: product.badge ?? null,
        featured: product.featured ?? null,
        newArrival: product.newArrival ?? null,
        inStock: product.inStock ?? null,
        rating: product.rating ?? null,
        createdAt: new Date()
      });
    });
  }
}

// Import and use the new database storage implementation
import { DatabaseStorage } from './database-storage';
export const storage = new DatabaseStorage();
