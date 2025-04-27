import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { PlusIcon } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-64 overflow-hidden cursor-pointer">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          {product.badge && (
            <div className={`absolute top-2 right-2 ${
              product.badge === 'NEW' 
                ? 'bg-accent-500' 
                : product.badge === 'SALE' 
                  ? 'bg-secondary-500' 
                  : 'bg-primary-500'
            } text-white text-xs font-semibold px-2 py-1 rounded`}>
              {product.badge}
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-sm text-gray-500 mb-1">{product.category}</h3>
        <Link href={`/product/${product.id}`}>
          <h2 className="text-lg font-medium text-primary-900 hover:text-secondary-600 transition-colors cursor-pointer">
            {product.name}
          </h2>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <p className="text-lg font-medium text-primary-900">
              ${Number(product.price).toFixed(2)}
            </p>
            {product.originalPrice && (
              <p className="ml-2 text-sm text-gray-500 line-through">
                ${Number(product.originalPrice).toFixed(2)}
              </p>
            )}
          </div>
          <Button
            onClick={() => addToCart(product)}
            variant="default"
            size="icon"
            className="rounded-full bg-primary-900 text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-900"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
