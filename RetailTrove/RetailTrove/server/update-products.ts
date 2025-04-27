import { db } from "./db";
import { products } from "@shared/schema";
import { eq } from "drizzle-orm";

// Update specific products
async function updateExistingProducts() {
  console.log("Updating existing products...");
  
  try {
    // Update leather backpack (ID 2)
    await db.update(products)
      .set({
        imageUrl: "https://images.unsplash.com/photo-1622560480605-d83c661284a1?q=80&w=800&h=800&auto=format&fit=crop"
      })
      .where(eq(products.id, 2));
    
    // Update minimalist tote bag (ID 5)
    await db.update(products)
      .set({
        imageUrl: "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?q=80&w=800&h=800&auto=format&fit=crop"
      })
      .where(eq(products.id, 5));
    
    console.log("Successfully updated product images");
  } catch (error) {
    console.error("Error updating products:", error);
  }
}

// Add new products
async function addNewProducts() {
  console.log("Adding new products...");
  
  // Check if any of these products already exist
  const existingBeautyProducts = await db.select().from(products).where(
    eq(products.category, "Beauty & Personal Care")
  );
  
  if (existingBeautyProducts.length > 0) {
    console.log(`Already have ${existingBeautyProducts.length} beauty products, skipping addition`);
    return;
  }
  
  // New products to add
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
      rating: "4.8",
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
      rating: "4.5",
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
      rating: "4.6",
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
      rating: "4.7",
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
      rating: "4.9",
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
      rating: "4.8",
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
      rating: "4.7",
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
      rating: "4.8",
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
      rating: "4.6",
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
      rating: "4.7",
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
      rating: "4.9",
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
      rating: "4.7",
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
      rating: "4.6",
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
      rating: "4.8",
    }
  ];
  
  try {
    // Insert all new products
    await db.insert(products).values(newProducts);
    console.log(`Successfully added ${newProducts.length} new products`);
  } catch (error) {
    console.error("Error adding new products:", error);
  }
}

// Export update function for use in server
export async function updateProducts() {
  try {
    await updateExistingProducts();
    await addNewProducts();
    console.log("Product updates completed");
  } catch (error) {
    console.error("Error during product updates:", error);
  }
}