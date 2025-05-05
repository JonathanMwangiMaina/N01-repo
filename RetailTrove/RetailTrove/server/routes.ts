import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-new";
import { insertCartItemSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req: Request, res: Response) => {
    try {
      const featuredProducts = await storage.getFeaturedProducts();
      res.json(featuredProducts);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/new-arrivals", async (req: Request, res: Response) => {
    try {
      const newArrivals = await storage.getNewArrivals();
      res.json(newArrivals);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      res.status(500).json({ message: "Failed to fetch new arrivals" });
    }
  });

  app.get("/api/products/category/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      console.error(`Error fetching products by category ${req.params.category}:`, error);
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  app.get("/api/products/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string || "";
      const products = await storage.searchProducts(query);
      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error(`Error fetching product ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart
  app.get("/api/cart/:cartId", async (req: Request, res: Response) => {
    try {
      const { cartId } = req.params;
      const cartItems = await storage.getCartItems(cartId);
      res.json(cartItems);
    } catch (error) {
      console.error(`Error fetching cart items for cart ${req.params.cartId}:`, error);
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req: Request, res: Response) => {
    try {
      const result = insertCartItemSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid cart item data", errors: result.error.format() });
      }
      
      const cartItem = await storage.addCartItem(result.data);
      res.status(201).json(cartItem);
    } catch (error) {
      console.error("Error adding cart item:", error);
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const { quantity } = req.body;
      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const cartItem = await storage.updateCartItem(id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found or removed" });
      }
      
      res.json(cartItem);
    } catch (error) {
      console.error(`Error updating cart item ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const removed = await storage.removeCartItem(id);
      if (!removed) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error removing cart item ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  // Orders
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const { order, items } = req.body;
      
      // Validate order data
      const orderResult = insertOrderSchema.safeParse(order);
      if (!orderResult.success) {
        return res.status(400).json({ message: "Invalid order data", errors: orderResult.error.format() });
      }
      
      // Validate order items
      const orderItemsSchema = z.array(insertOrderItemSchema);
      const itemsResult = orderItemsSchema.safeParse(items);
      if (!itemsResult.success) {
        return res.status(400).json({ message: "Invalid order items data", errors: itemsResult.error.format() });
      }
      
      const createdOrder = await storage.createOrder(orderResult.data, itemsResult.data);
      res.status(201).json(createdOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
