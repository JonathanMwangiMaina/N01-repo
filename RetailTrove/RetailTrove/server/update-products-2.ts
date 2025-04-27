import { db } from "./db";
import { products } from "@shared/schema";
import { eq, or } from "drizzle-orm";

// Update images for specific products and add more products
async function updateProductImages() {
  console.log("Updating product images...");
  
  try {
    // Update leather backpack (ID 2)
    await db.update(products)
      .set({
        imageUrl: "https://images.unsplash.com/photo-1620833127432-2ca993c99a46?q=80&w=800&h=800&auto=format&fit=crop"
      })
      .where(eq(products.id, 2));
    
    // Update luxury perfume (ID 10)
    await db.update(products)
      .set({
        imageUrl: "https://images.unsplash.com/photo-1566977776052-050d53d7b11f?q=80&w=800&h=800&auto=format&fit=crop"
      })
      .where(eq(products.name, "Luxury Perfume"));
    
    // Update ceramic vase (ID 19)
    await db.update(products)
      .set({
        imageUrl: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=800&h=800&auto=format&fit=crop"
      })
      .where(eq(products.name, "Ceramic Vase"));
    
    // Update gold pendant necklace (ID 20)
    await db.update(products)
      .set({
        imageUrl: "https://images.unsplash.com/photo-1630018548696-e1900a69c3d8?q=80&w=800&h=800&auto=format&fit=crop"
      })
      .where(eq(products.name, "Gold Pendant Necklace"));
    
    // Update decorative throw pillows (ID 18)
    await db.update(products)
      .set({
        imageUrl: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&h=800&auto=format&fit=crop"
      })
      .where(eq(products.name, "Decorative Throw Pillows"));
    
    // Update beaded bracelet set (ID 22)
    await db.update(products)
      .set({
        imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&h=800&auto=format&fit=crop"
      })
      .where(eq(products.name, "Beaded Bracelet Set"));
    
    console.log("Successfully updated product images");
  } catch (error) {
    console.error("Error updating product images:", error);
  }
}

// Add products to empty categories
async function addCategoryProducts() {
  console.log("Adding products to empty categories...");
  
  // First, check if there are products in the sporting goods category
  const sportingGoodsProducts = await db.select().from(products).where(
    eq(products.category, "Sporting Goods")
  );
  
  // Similarly, check if there are products in the footwear category
  const footwearProducts = await db.select().from(products).where(
    eq(products.category, "Footwear")
  );
  
  // If these categories already have products, skip adding new ones
  if (sportingGoodsProducts.length > 0 && footwearProducts.length > 0) {
    console.log("Categories already have products, skipping addition");
    return;
  }
  
  // New products to add
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
      rating: "4.7",
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
      rating: "4.6",
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
      rating: "4.9",
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
      rating: "4.8",
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
      rating: "4.7",
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
      rating: "4.6",
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
      rating: "4.5",
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
      rating: "4.4",
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
      rating: "4.7",
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
      rating: "4.8",
    }
  ];
  
  try {
    // Insert all new products
    await db.insert(products).values(newProducts);
    console.log(`Successfully added ${newProducts.length} new products to empty categories`);
  } catch (error) {
    console.error("Error adding new category products:", error);
  }
}

// Categories that should have a representative product
const categoriesToFill = [
  "All Products"
];

// Add products to All Products category
async function addAllProductsCategory() {
  console.log("Updating 'All Products' category...");
  
  try {
    // Get some existing products
    const existingProducts = await db.select().from(products).limit(5);
    
    // Update these products to also belong to the "All Products" category
    for (const product of existingProducts) {
      await db.insert(products)
        .values({
          ...product,
          id: undefined, // Let the database assign a new ID
          category: "All Products"
        });
    }
    
    console.log("Successfully added products to 'All Products' category");
  } catch (error) {
    console.error("Error updating 'All Products' category:", error);
  }
}

// Export update function for use in server
export async function updateProducts2() {
  try {
    await updateProductImages();
    await addCategoryProducts();
    await addAllProductsCategory();
    console.log("Product updates completed");
  } catch (error) {
    console.error("Error during product updates:", error);
  }
}