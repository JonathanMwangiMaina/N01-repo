import { db } from "./db";
import { products } from "@shared/schema";

async function seedProducts() {
  // Check if products already exist in the database
  const existingProducts = await db.select().from(products);
  
  if (existingProducts.length > 0) {
    console.log(`Database already has ${existingProducts.length} products. Skipping seed.`);
    return;
  }

  console.log("Seeding products to database...");

  // Sample product data
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
      rating: "4.8",
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
      rating: "4.6",
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
      rating: "4.9",
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
      rating: "4.7",
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
      rating: "4.5",
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
      rating: "4.8",
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
      rating: "4.6",
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
      rating: "4.7",
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
      rating: "4.8",
    },
  ];

  try {
    // Insert all products
    const result = await db.insert(products).values(productData);
    console.log(`Successfully inserted ${productData.length} products`);
    return result;
  } catch (error) {
    console.error("Error seeding products:", error);
  }
}

// Export seed function for use in index.ts
export async function seed() {
  try {
    await seedProducts();
    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}