var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  cartItems: () => cartItems,
  cartItemsRelations: () => cartItemsRelations,
  insertCartItemSchema: () => insertCartItemSchema,
  insertOrderItemSchema: () => insertOrderItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertProductSchema: () => insertProductSchema,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  products: () => products,
  productsRelations: () => productsRelations
});
import { pgTable, text, serial, integer, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  badge: text("badge"),
  featured: boolean("featured").default(false),
  newArrival: boolean("new_arrival").default(false),
  inStock: boolean("in_stock").default(true),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("5"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true
});
var cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  cartId: text("cart_id").notNull()
});
var insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true
});
var cartItemsRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id]
  })
}));
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  apartment: text("apartment"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true
});
var orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  productName: text("product_name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1)
});
var insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true
});
var orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));
var ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems)
}));
var productsRelations = relations(products, ({ many }) => ({
  cartItems: many(cartItems),
  orderItems: many(orderItems)
}));

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle(pool, { schema: schema_exports });

// server/database-storage.ts
import { eq, and, ilike, or, desc } from "drizzle-orm";
var DatabaseStorage = class {
  async updateProduct(id, productData) {
    const [updatedProduct] = await db.update(products).set(productData).where(eq(products.id, id)).returning();
    return updatedProduct;
  }
  async deleteProduct(id) {
    const [deleted] = await db.delete(products).where(eq(products.id, id)).returning({ id: products.id });
    return !!deleted;
  }
  async getAllOrders() {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }
  // Products
  async getProducts() {
    return await db.select().from(products);
  }
  async getProductById(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  async getProductsByCategory(category) {
    return await db.select().from(products).where(eq(products.category, category));
  }
  async getFeaturedProducts() {
    return await db.select().from(products).where(eq(products.featured, true));
  }
  async getNewArrivals() {
    return await db.select().from(products).where(eq(products.newArrival, true));
  }
  async searchProducts(query) {
    return await db.select().from(products).where(
      or(
        ilike(products.name, `%${query}%`),
        ilike(products.description, `%${query}%`),
        ilike(products.category, `%${query}%`)
      )
    );
  }
  // Cart
  async getCartItems(cartId) {
    const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cartId));
    const itemsWithProducts = [];
    for (const item of items) {
      const product = await this.getProductById(item.productId);
      if (product) {
        itemsWithProducts.push({ ...item, product });
      }
    }
    return itemsWithProducts;
  }
  async getCartItem(cartId, productId) {
    const [item] = await db.select().from(cartItems).where(
      and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId))
    );
    if (item) {
      const product = await this.getProductById(item.productId);
      if (product) {
        return { ...item, product };
      }
    }
    return void 0;
  }
  async addCartItem(cartItem) {
    const [item] = await db.insert(cartItems).values(cartItem).returning();
    return item;
  }
  async updateCartItem(id, quantity) {
    const [item] = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return item;
  }
  async removeCartItem(id) {
    const [deleted] = await db.delete(cartItems).where(eq(cartItems.id, id)).returning({ id: cartItems.id });
    return !!deleted;
  }
  // Orders
  async createOrder(orderData, items) {
    const order = await db.transaction(async (tx) => {
      const [newOrder] = await tx.insert(orders).values(orderData).returning();
      for (const item of items) {
        await tx.insert(orderItems).values({ ...item, orderId: newOrder.id }).returning();
      }
      return newOrder;
    });
    return order;
  }
  async getOrderById(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
};

// server/storage-new.ts
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/products", async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      res.json(products2);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/featured", async (req, res) => {
    try {
      const featuredProducts = await storage.getFeaturedProducts();
      res.json(featuredProducts);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });
  app2.get("/api/products/new-arrivals", async (req, res) => {
    try {
      const newArrivals = await storage.getNewArrivals();
      res.json(newArrivals);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      res.status(500).json({ message: "Failed to fetch new arrivals" });
    }
  });
  app2.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products2 = await storage.getProductsByCategory(category);
      res.json(products2);
    } catch (error) {
      console.error(`Error fetching products by category ${req.params.category}:`, error);
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });
  app2.get("/api/products/search", async (req, res) => {
    try {
      const query = req.query.q || "";
      const products2 = await storage.searchProducts(query);
      res.json(products2);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Failed to search products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
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
  app2.get("/api/cart/:cartId", async (req, res) => {
    try {
      const { cartId } = req.params;
      const cartItems2 = await storage.getCartItems(cartId);
      res.json(cartItems2);
    } catch (error) {
      console.error(`Error fetching cart items for cart ${req.params.cartId}:`, error);
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });
  app2.post("/api/cart", async (req, res) => {
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
  app2.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      const { quantity } = req.body;
      if (typeof quantity !== "number" || quantity < 0) {
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
  app2.delete("/api/cart/:id", async (req, res) => {
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
  app2.post("/api/orders", async (req, res) => {
    try {
      const { order, items } = req.body;
      const orderResult = insertOrderSchema.safeParse(order);
      if (!orderResult.success) {
        return res.status(400).json({ message: "Invalid order data", errors: orderResult.error.format() });
      }
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: void 0
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/seed-db.ts
async function seedProducts() {
  const existingProducts = await db.select().from(products);
  if (existingProducts.length > 0) {
    console.log(`Database already has ${existingProducts.length} products. Skipping seed.`);
    return;
  }
  console.log("Seeding products to database...");
  const productData = [
    {
      name: "Premium Watch",
      description: "Elegant premium watch with automatic movement and sapphire crystal.",
      price: "299.99",
      originalPrice: "349.99",
      imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Accessories",
      subcategory: "Watches",
      badge: "Sale",
      featured: true,
      newArrival: false,
      inStock: true,
      rating: "4.8"
    },
    {
      name: "Leather Backpack",
      description: "Handcrafted genuine leather backpack with multiple compartments.",
      price: "159.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Bags",
      subcategory: "Backpacks",
      badge: null,
      featured: true,
      newArrival: false,
      inStock: true,
      rating: "4.6"
    },
    {
      name: "Wireless Headphones",
      description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
      price: "249.99",
      originalPrice: "299.99",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Electronics",
      subcategory: "Audio",
      badge: "Sale",
      featured: true,
      newArrival: false,
      inStock: true,
      rating: "4.9"
    },
    {
      name: "Ceramic Coffee Mug",
      description: "Handmade ceramic coffee mug with minimalist design.",
      price: "24.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Home",
      subcategory: "Kitchenware",
      badge: null,
      featured: false,
      newArrival: false,
      inStock: true,
      rating: "4.7"
    },
    {
      name: "Minimalist Tote Bag",
      description: "Premium cotton tote bag with reinforced handles.",
      price: "39.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1623831854743-8126a920d2ec?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Bags",
      subcategory: "Totes",
      badge: null,
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.5"
    },
    {
      name: "Smart Watch Pro",
      description: "Advanced smartwatch with heart rate monitoring and GPS.",
      price: "199.99",
      originalPrice: "249.99",
      imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Electronics",
      subcategory: "Wearables",
      badge: "Sale",
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.8"
    },
    {
      name: "Minimalist Lamp",
      description: "Modern minimalist desk lamp with adjustable brightness.",
      price: "89.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Home",
      subcategory: "Lighting",
      badge: null,
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.6"
    },
    {
      name: "Denim Jacket",
      description: "Classic denim jacket with modern fit.",
      price: "79.99",
      originalPrice: "99.99",
      imageUrl: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Clothing",
      subcategory: "Outerwear",
      badge: "Sale",
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.7"
    },
    {
      name: "Yoga Mat",
      description: "Premium non-slip yoga mat with carrying strap.",
      price: "49.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1599447292246-759abaa2be95?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Fitness",
      subcategory: "Yoga",
      badge: null,
      featured: false,
      newArrival: false,
      inStock: true,
      rating: "4.8"
    }
  ];
  try {
    const result = await db.insert(products).values(productData);
    console.log(`Successfully inserted ${productData.length} products`);
    return result;
  } catch (error) {
    console.error("Error seeding products:", error);
  }
}
async function seed() {
  try {
    await seedProducts();
    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// server/update-products.ts
import { eq as eq2 } from "drizzle-orm";
async function updateExistingProducts() {
  console.log("Updating existing products...");
  try {
    await db.update(products).set({
      imageUrl: "https://images.unsplash.com/photo-1622560480605-d83c661284a1?q=80&w=800&h=800&auto=format&fit=crop"
    }).where(eq2(products.id, 2));
    await db.update(products).set({
      imageUrl: "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?q=80&w=800&h=800&auto=format&fit=crop"
    }).where(eq2(products.id, 5));
    console.log("Successfully updated product images");
  } catch (error) {
    console.error("Error updating products:", error);
  }
}
async function addNewProducts() {
  console.log("Adding new products...");
  const existingBeautyProducts = await db.select().from(products).where(
    eq2(products.category, "Beauty & Personal Care")
  );
  if (existingBeautyProducts.length > 0) {
    console.log(`Already have ${existingBeautyProducts.length} beauty products, skipping addition`);
    return;
  }
  const newProducts = [
    // Beauty & Personal Care products
    {
      name: "Luxury Perfume",
      description: "Elegant fragrance with notes of jasmine, vanilla, and amber for a lasting scent.",
      price: "79.99",
      originalPrice: "99.99",
      imageUrl: "https://images.unsplash.com/photo-1605651531144-51381895e23d?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Beauty & Personal Care",
      subcategory: "Fragrance",
      badge: "Sale",
      featured: true,
      newArrival: true,
      inStock: true,
      rating: "4.8"
    },
    {
      name: "Moisturizing Hair Cream",
      description: "Nourishing hair cream that adds moisture and reduces frizz for all hair types.",
      price: "24.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1597354984706-fac992d9306f?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Beauty & Personal Care",
      subcategory: "Hair Care",
      badge: null,
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.5"
    },
    {
      name: "Hydrating Shampoo",
      description: "Gentle cleansing shampoo that restores moisture to dry, damaged hair.",
      price: "18.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Beauty & Personal Care",
      subcategory: "Hair Care",
      badge: null,
      featured: false,
      newArrival: false,
      inStock: true,
      rating: "4.6"
    },
    {
      name: "Volumizing Conditioner",
      description: "Lightweight conditioner that adds volume while detangling and softening hair.",
      price: "19.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Beauty & Personal Care",
      subcategory: "Hair Care",
      badge: null,
      featured: false,
      newArrival: false,
      inStock: true,
      rating: "4.7"
    },
    {
      name: "Professional Makeup Kit",
      description: "Complete makeup set with eyeshadows, blushes, and lip colors for every occasion.",
      price: "59.99",
      originalPrice: "69.99",
      imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Beauty & Personal Care",
      subcategory: "Makeup",
      badge: "Sale",
      featured: true,
      newArrival: true,
      inStock: true,
      rating: "4.9"
    },
    {
      name: "Nourishing Body Lotion",
      description: "Rich body lotion with shea butter and essential oils for deep hydration.",
      price: "22.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Beauty & Personal Care",
      subcategory: "Body Care",
      badge: null,
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.8"
    },
    {
      name: "Anti-Aging Face Cream",
      description: "Advanced formula face cream that reduces fine lines and improves skin elasticity.",
      price: "45.99",
      originalPrice: "54.99",
      imageUrl: "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Beauty & Personal Care",
      subcategory: "Skin Care",
      badge: "Sale",
      featured: true,
      newArrival: false,
      inStock: true,
      rating: "4.7"
    },
    // Home & Living products
    {
      name: "Scented Candle Set",
      description: "Set of three premium scented candles with vanilla, lavender, and sandalwood fragrances.",
      price: "34.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Home & Living",
      subcategory: "Home Decor",
      badge: null,
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.8"
    },
    {
      name: "Decorative Throw Pillows",
      description: "Set of two hand-crafted throw pillows with modern geometric patterns.",
      price: "49.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1584215952178-333b9582b6b2?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Home & Living",
      subcategory: "Home Decor",
      badge: null,
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.6"
    },
    {
      name: "Ceramic Vase",
      description: "Handcrafted ceramic vase with minimalist design, perfect for fresh or dried arrangements.",
      price: "39.99",
      originalPrice: "49.99",
      imageUrl: "https://images.unsplash.com/photo-1612620535624-f827a1e6d8fc?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Home & Living",
      subcategory: "Home Decor",
      badge: "Sale",
      featured: true,
      newArrival: false,
      inStock: true,
      rating: "4.7"
    },
    // Jewelry products
    {
      name: "Gold Pendant Necklace",
      description: "Elegant 14k gold plated pendant necklace with delicate chain.",
      price: "69.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74628c?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Jewelry",
      subcategory: "Necklaces",
      badge: null,
      featured: true,
      newArrival: true,
      inStock: true,
      rating: "4.9"
    },
    {
      name: "Silver Hoop Earrings",
      description: "Sterling silver contemporary hoop earrings with secure clasp closure.",
      price: "45.99",
      originalPrice: "59.99",
      imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Jewelry",
      subcategory: "Earrings",
      badge: "Sale",
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.7"
    },
    {
      name: "Beaded Bracelet Set",
      description: "Set of three natural stone beaded bracelets that can be worn together or separately.",
      price: "34.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Jewelry",
      subcategory: "Bracelets",
      badge: null,
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.6"
    },
    {
      name: "Designer Sunglasses",
      description: "Polarized UV-protective sunglasses with lightweight frame and premium lenses.",
      price: "89.99",
      originalPrice: "109.99",
      imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Accessories",
      subcategory: "Sunglasses",
      badge: "Sale",
      featured: true,
      newArrival: false,
      inStock: true,
      rating: "4.8"
    }
  ];
  try {
    await db.insert(products).values(newProducts);
    console.log(`Successfully added ${newProducts.length} new products`);
  } catch (error) {
    console.error("Error adding new products:", error);
  }
}
async function updateProducts() {
  try {
    await updateExistingProducts();
    await addNewProducts();
    console.log("Product updates completed");
  } catch (error) {
    console.error("Error during product updates:", error);
  }
}

// server/update-products-2.ts
import { eq as eq3 } from "drizzle-orm";
async function updateProductImages() {
  console.log("Updating product images...");
  try {
    await db.update(products).set({
      imageUrl: "https://images.unsplash.com/photo-1620833127432-2ca993c99a46?q=80&w=800&h=800&auto=format&fit=crop"
    }).where(eq3(products.id, 2));
    await db.update(products).set({
      imageUrl: "https://images.unsplash.com/photo-1566977776052-050d53d7b11f?q=80&w=800&h=800&auto=format&fit=crop"
    }).where(eq3(products.name, "Luxury Perfume"));
    await db.update(products).set({
      imageUrl: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=800&h=800&auto=format&fit=crop"
    }).where(eq3(products.name, "Ceramic Vase"));
    await db.update(products).set({
      imageUrl: "https://images.unsplash.com/photo-1630018548696-e1900a69c3d8?q=80&w=800&h=800&auto=format&fit=crop"
    }).where(eq3(products.name, "Gold Pendant Necklace"));
    await db.update(products).set({
      imageUrl: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&h=800&auto=format&fit=crop"
    }).where(eq3(products.name, "Decorative Throw Pillows"));
    await db.update(products).set({
      imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&h=800&auto=format&fit=crop"
    }).where(eq3(products.name, "Beaded Bracelet Set"));
    console.log("Successfully updated product images");
  } catch (error) {
    console.error("Error updating product images:", error);
  }
}
async function addCategoryProducts() {
  console.log("Adding products to empty categories...");
  const sportingGoodsProducts = await db.select().from(products).where(
    eq3(products.category, "Sporting Goods")
  );
  const footwearProducts = await db.select().from(products).where(
    eq3(products.category, "Footwear")
  );
  if (sportingGoodsProducts.length > 0 && footwearProducts.length > 0) {
    console.log("Categories already have products, skipping addition");
    return;
  }
  const newProducts = [
    // Sporting Goods products
    {
      name: "Premium Yoga Mat",
      description: "Non-slip yoga mat with alignment markings and eco-friendly materials.",
      price: "45.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1607081759141-5035e9a756e3?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Sporting Goods",
      subcategory: "Yoga",
      badge: null,
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.7"
    },
    {
      name: "Fitness Resistance Bands",
      description: "Set of 5 resistance bands with different strengths for home workouts.",
      price: "29.99",
      originalPrice: "39.99",
      imageUrl: "https://images.unsplash.com/photo-1598575468023-f8713845c4bc?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Sporting Goods",
      subcategory: "Fitness",
      badge: "Sale",
      featured: true,
      newArrival: true,
      inStock: true,
      rating: "4.6"
    },
    {
      name: "Insulated Water Bottle",
      description: "24oz stainless steel water bottle that keeps drinks cold for 24 hours.",
      price: "34.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1588187284031-938b3710ae01?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Sporting Goods",
      subcategory: "Hydration",
      badge: null,
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.9"
    },
    {
      name: "Adjustable Dumbbell Set",
      description: "Space-saving adjustable dumbbells that replace multiple weights.",
      price: "199.99",
      originalPrice: "249.99",
      imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Sporting Goods",
      subcategory: "Weights",
      badge: "Sale",
      featured: true,
      newArrival: false,
      inStock: true,
      rating: "4.8"
    },
    // Footwear products
    {
      name: "Minimalist Running Shoes",
      description: "Lightweight running shoes with excellent cushioning and flexibility.",
      price: "129.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Footwear",
      subcategory: "Running",
      badge: null,
      featured: true,
      newArrival: true,
      inStock: true,
      rating: "4.7"
    },
    {
      name: "Leather Ankle Boots",
      description: "Premium leather ankle boots with cushioned insoles and durable construction.",
      price: "159.99",
      originalPrice: "189.99",
      imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Footwear",
      subcategory: "Boots",
      badge: "Sale",
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.6"
    },
    {
      name: "Casual Canvas Sneakers",
      description: "Classic low-top canvas sneakers for everyday comfort and style.",
      price: "49.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Footwear",
      subcategory: "Sneakers",
      badge: null,
      featured: false,
      newArrival: false,
      inStock: true,
      rating: "4.5"
    },
    {
      name: "Comfort Slide Sandals",
      description: "Ergonomic slide sandals with contoured footbeds for all-day comfort.",
      price: "34.99",
      originalPrice: "44.99",
      imageUrl: "https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Footwear",
      subcategory: "Sandals",
      badge: "Sale",
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.4"
    },
    // Additional Clothing products
    {
      name: "Cotton T-Shirt",
      description: "Premium cotton t-shirt with a comfortable fit and reinforced seams.",
      price: "24.99",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Clothing",
      subcategory: "T-Shirts",
      badge: null,
      featured: false,
      newArrival: true,
      inStock: true,
      rating: "4.7"
    },
    {
      name: "Wool Sweater",
      description: "Warm wool blend sweater with classic cable knit pattern.",
      price: "79.99",
      originalPrice: "99.99",
      imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&h=800&auto=format&fit=crop",
      category: "Clothing",
      subcategory: "Sweaters",
      badge: "Sale",
      featured: true,
      newArrival: false,
      inStock: true,
      rating: "4.8"
    }
  ];
  try {
    await db.insert(products).values(newProducts);
    console.log(`Successfully added ${newProducts.length} new products to empty categories`);
  } catch (error) {
    console.error("Error adding new category products:", error);
  }
}
async function addAllProductsCategory() {
  console.log("Updating 'All Products' category...");
  try {
    const existingProducts = await db.select().from(products).limit(5);
    for (const product of existingProducts) {
      await db.insert(products).values({
        ...product,
        id: void 0,
        // Let the database assign a new ID
        category: "All Products"
      });
    }
    console.log("Successfully added products to 'All Products' category");
  } catch (error) {
    console.error("Error updating 'All Products' category:", error);
  }
}
async function updateProducts2() {
  try {
    await updateProductImages();
    await addCategoryProducts();
    await addAllProductsCategory();
    console.log("Product updates completed");
  } catch (error) {
    console.error("Error during product updates:", error);
  }
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    await seed();
    await updateProducts();
    await updateProducts2();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
