import {
  type Product,
  type CartItem,
  type CartItemWithProduct,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  products,
  cartItems,
  orders,
  orderItems,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, ilike, or, desc } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.category, category));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async getNewArrivals(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.newArrival, true));
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        or(
          ilike(products.name, `%${query}%`),
          ilike(products.description, `%${query}%`),
          ilike(products.category, `%${query}%`),
        ),
      );
  }

  // Cart
  async getCartItems(cartId: string): Promise<CartItemWithProduct[]> {
    const items = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cartId));

    const itemsWithProducts: CartItemWithProduct[] = [];

    for (const item of items) {
      const product = await this.getProductById(item.productId);
      if (product) {
        itemsWithProducts.push({ ...item, product });
      }
    }

    return itemsWithProducts;
  }

  async getCartItem(
    cartId: string,
    productId: number,
  ): Promise<CartItemWithProduct | undefined> {
    const [item] = await db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)),
      );

    if (item) {
      const product = await this.getProductById(item.productId);
      if (product) {
        return { ...item, product };
      }
    }

    return undefined;
  }

  async addCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    const [item] = await db.insert(cartItems).values(cartItem).returning();

    return item;
  }

  async updateCartItem(
    id: number,
    quantity: number,
  ): Promise<CartItem | undefined> {
    const [item] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();

    return item;
  }

  async removeCartItem(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(cartItems)
      .where(eq(cartItems.id, id))
      .returning({ id: cartItems.id });

    return !!deleted;
  }

  // Orders
  async createOrder(
    orderData: InsertOrder,
    items: InsertOrderItem[],
  ): Promise<Order> {
    // Use a transaction to ensure all operations succeed or fail together
    const order = await db.transaction(async (tx) => {
      // Create the order
      const [newOrder] = await tx.insert(orders).values(orderData).returning();

      // Create all order items
      for (const item of items) {
        await tx
          .insert(orderItems)
          .values({ ...item, orderId: newOrder.id })
          .returning();
      }

      return newOrder;
    });

    return order;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
}
