import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { Product as ProductType } from "@shared/schema";
import { StarIcon, CheckIcon, GlobeIcon, HeartIcon } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Mock additional product images (in a real app, these would come from the product data)
  const additionalImages = [
    "https://images.unsplash.com/photo-1623998021446-45cd9b013eee?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1526045612212-70caf35c14df?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  ];
  
  // Fetch product data
  const { data: product, isLoading, error } = useQuery<ProductType>({
    queryKey: [`/api/products/${id}`],
  });
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Loading skeleton for product images */}
          <div className="lg:max-w-lg lg:self-end">
            <Skeleton className="rounded-lg w-full h-96 mb-4" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-20 rounded-md" />
              ))}
            </div>
          </div>
          
          {/* Loading skeleton for product info */}
          <div className="mt-10 lg:mt-0 lg:max-w-lg lg:self-start">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-8 w-24 mb-6" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-6 w-40 mb-4" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-primary-900 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn't find the product you were looking for.</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }
  
  // Generate images array - main image first, then additional images
  const allImages = [product.imageUrl, ...additionalImages];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Product Images */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="rounded-lg overflow-hidden mb-4">
            <img 
              src={allImages[selectedImage]} 
              alt={product.name} 
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {allImages.map((image, index) => (
              <button 
                key={index}
                onClick={() => setSelectedImage(index)} 
                className={`rounded-md overflow-hidden border-2 ${
                  selectedImage === index ? "border-secondary-500" : "border-gray-200"
                }`}
              >
                <img 
                  src={image} 
                  alt={`${product.name} - View ${index + 1}`} 
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-10 lg:mt-0 lg:max-w-lg lg:self-start">
          <div className="flex items-center">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon 
                  key={i} 
                  className={`h-5 w-5 ${
                    i < Math.floor(Number(product.rating)) 
                      ? "text-yellow-400" 
                      : "text-gray-300"
                  }`} 
                  fill="currentColor" 
                />
              ))}
            </div>
            <p className="ml-2 text-sm text-gray-500">42 reviews</p>
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-bold text-primary-900">{product.name}</h1>
            <h2 className="sr-only">Product information</h2>
            <div className="mt-2 flex items-center">
              <p className="text-3xl text-primary-900">${Number(product.price).toFixed(2)}</p>
              {product.originalPrice && (
                <p className="ml-2 text-lg text-gray-500 line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-primary-900">Description</h3>
            <div className="mt-2 text-base text-gray-500 space-y-4">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-primary-900">Color</h3>
              <a href="#" className="text-sm font-medium text-secondary-600 hover:text-secondary-500">Size guide</a>
            </div>

            <div className="mt-2">
              <div className="flex items-center space-x-3">
                <button className="relative -m-0.5 p-0.5 rounded-full ring-2 ring-secondary-500 focus:outline-none">
                  <span className="block h-5 w-5 rounded-full bg-gray-800"></span>
                </button>
                <button className="relative -m-0.5 p-0.5 rounded-full ring-2 ring-transparent hover:ring-gray-300 focus:outline-none">
                  <span className="block h-5 w-5 rounded-full bg-gray-500"></span>
                </button>
                <button className="relative -m-0.5 p-0.5 rounded-full ring-2 ring-transparent hover:ring-gray-300 focus:outline-none">
                  <span className="block h-5 w-5 rounded-full bg-amber-700"></span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col space-y-4">
            <Button
              onClick={() => addToCart(product)}
              size="lg" 
              className="w-full bg-secondary-600 hover:bg-secondary-700 text-white"
            >
              Add to cart
            </Button>
            <Button variant="outline" className="flex items-center justify-center text-secondary-600 hover:text-secondary-500">
              <HeartIcon className="h-5 w-5 mr-2" />
              Add to wishlist
            </Button>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500" />
              <p className="ml-2 text-sm text-gray-500">In stock and ready to ship</p>
            </div>
            <div className="mt-4 flex items-center">
              <GlobeIcon className="h-5 w-5 text-gray-400" />
              <p className="ml-2 text-sm text-gray-500">Free shipping worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
