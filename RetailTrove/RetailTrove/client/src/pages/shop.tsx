import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ProductCard } from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@shared/schema";
import { SearchIcon, FilterIcon } from "lucide-react";

interface ShopProps {
  params?: {
    category?: string;
  };
}

export default function Shop({ params }: ShopProps) {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState<URLSearchParams>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("featured");
  const [filterCategory, setFilterCategory] = useState(params?.category || "All Products");
  
  // Extract query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSearchParams(urlParams);
    
    const q = urlParams.get("q");
    if (q) setSearchQuery(q);
    
    const category = urlParams.get("category");
    if (category) setFilterCategory(category);
  }, [location]);
  
  // Fetch products by category
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: [`/api/products/category/${filterCategory}`],
  });
  
  // Filter and sort products
  const filteredAndSortedProducts = products ? products
    // Filter by search query if present
    .filter(product => 
      !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    // Sort based on selected order
    .sort((a, b) => {
      switch (sortOrder) {
        case "price-low":
          return Number(a.price) - Number(b.price);
        case "price-high":
          return Number(b.price) - Number(a.price);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return a.featured ? -1 : 1; // Featured products first
      }
    })
    : [];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search query
    const url = new URL(window.location.href);
    url.searchParams.set("q", searchQuery);
    window.history.pushState({}, "", url.toString());
  };
  
  const handleCategoryChange = (category: string) => {
    setFilterCategory(category);
    // Update URL
    const url = new URL(window.location.href);
    url.pathname = `/shop/${category === "All Products" ? "" : category}`;
    window.history.pushState({}, "", url.toString());
  };
  
  const categories = [
    'All Products',
    'New Arrivals',
    'Clothing',
    'Accessories',
    'Home & Living',
    'Electronics',
    'Sporting Goods',
    'Footwear'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">
            {filterCategory === "All Products" ? "All Products" : filterCategory}
          </h1>
          <p className="text-gray-500 mt-1">
            {filteredAndSortedProducts.length} products
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Button type="submit" className="sr-only">Search</Button>
          </form>
          
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Category Filter Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-primary-900">Filters</h3>
              <FilterIcon className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start px-2 ${
                        filterCategory === category
                          ? "text-secondary-600 font-medium"
                          : "text-gray-500"
                      }`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="product-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-4">
                  <Skeleton className="h-64 w-full rounded-md" />
                  <Skeleton className="h-4 w-20 mt-4" />
                  <Skeleton className="h-6 w-40 mt-2" />
                  <div className="flex justify-between mt-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
