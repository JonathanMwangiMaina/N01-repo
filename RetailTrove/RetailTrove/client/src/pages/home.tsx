import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { StarIcon } from "lucide-react";
import { Product } from "@shared/schema";

export default function Home() {
  // Fetch featured products
  const { data: featuredProducts, isLoading: featuredLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });
  
  // Fetch new arrivals
  const { data: newArrivals, isLoading: newArrivalsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/new-arrivals"],
  });
  
  // List of categories
  const categories = [
    'All Products',
    'New Arrivals',
    'Clothing',
    'Accessories',
    'Home & Living',
    'Electronics'
  ];
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/70 z-10"></div>
        <div className="relative h-[500px] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" alt="Hero" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 flex items-center z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Summer Collection 2023</h1>
              <p className="mt-4 text-xl">Discover our latest collection of premium products for your lifestyle.</p>
              <div className="mt-8 flex gap-x-4">
                <Link href="/shop">
                  <Button size="lg" className="bg-accent-500 text-white hover:bg-accent-600">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 hover:border-accent-300">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Category Nav */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar">
            {categories.map((category, index) => (
              <Link key={index} href={`/shop/${category}`}>
                <span className="whitespace-nowrap text-sm font-medium text-primary-600 hover:text-primary-900 px-3 py-2 cursor-pointer">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-primary-900">Featured Products</h2>
            <Link href="/shop">
              <span className="hidden sm:block text-sm font-semibold text-secondary-600 hover:text-secondary-500 cursor-pointer">
                Browse all products<span aria-hidden="true"> &rarr;</span>
              </span>
            </Link>
          </div>

          <div className="mt-8 product-grid">
            {featuredLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-4">
                  <Skeleton className="h-64 w-full rounded-md" />
                  <Skeleton className="h-4 w-20 mt-4" />
                  <Skeleton className="h-6 w-40 mt-2" />
                  <div className="flex justify-between mt-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
              ))
            ) : (
              featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/shop">
              <span className="text-sm font-semibold text-secondary-600 hover:text-secondary-500 cursor-pointer">
                Browse all products<span aria-hidden="true"> &rarr;</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-primary-900">New Arrivals</h2>
            <p className="mt-4 max-w-2xl mx-auto text-base text-gray-500">Check out our latest products just added to our inventory.</p>
          </div>

          <div className="mt-10 product-grid">
            {newArrivalsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-4">
                  <Skeleton className="h-64 w-full rounded-md" />
                  <Skeleton className="h-4 w-20 mt-4" />
                  <Skeleton className="h-6 w-40 mt-2" />
                  <div className="flex justify-between mt-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
              ))
            ) : (
              newArrivals?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Promo Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-800/70 z-10"></div>
              <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80" alt="Men's Collection" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white">Men's Collection</h3>
                  <p className="mt-2 text-white text-opacity-80">Premium quality for every style</p>
                  <Link href="/shop/Clothing">
                    <Button size="sm" className="mt-4 bg-white text-primary-900 hover:bg-gray-100 rounded-full">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/80 to-secondary-800/70 z-10"></div>
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80" alt="Women's Collection" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white">Women's Collection</h3>
                  <p className="mt-2 text-white text-opacity-80">Trendy styles updated seasonally</p>
                  <Link href="/shop/Clothing">
                    <Button size="sm" className="mt-4 bg-white text-secondary-900 hover:bg-gray-100 rounded-full">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-primary-900">What Our Customers Say</h2>
            <p className="mt-4 max-w-2xl mx-auto text-base text-gray-500">Don't just take our word for it — see what customers are saying about our products.</p>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">JD</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-primary-900">Jane Doe</h4>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"I've been looking for a quality watch that doesn't break the bank. This premium watch exceeded my expectations. The design is elegant and it's extremely comfortable to wear all day."</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">MS</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-primary-900">Mark Smith</h4>
                  <div className="flex items-center">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
                    ))}
                    <StarIcon className="h-4 w-4 text-gray-300" fill="currentColor" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"The wireless headphones have incredible sound quality and the battery life is impressive. I use them daily for work calls and listening to music. Worth every penny."</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">AK</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-primary-900">Alex Kim</h4>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"The leather backpack is exactly what I was looking for. The quality is outstanding, and it has enough compartments to keep all my items organized. Fast shipping too!"</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-secondary-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Subscribe to our newsletter</h2>
          <p className="mt-4 text-xl text-secondary-100">Get the latest updates on new products and special sales</p>
          <div className="mt-8 max-w-md mx-auto">
            <form className="sm:flex">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input 
                id="email-address" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                className="w-full rounded-md border-gray-300 px-5 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-secondary-700" 
                placeholder="Enter your email"
              />
              <Button 
                type="submit" 
                className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-secondary-700 bg-white hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-secondary-700"
              >
                Subscribe
              </Button>
            </form>
            <p className="mt-3 text-sm text-secondary-200">
              We care about your data. Read our <span className="font-medium text-white underline cursor-pointer" onClick={() => alert('Privacy Policy - Coming Soon')}>Privacy Policy</span>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
