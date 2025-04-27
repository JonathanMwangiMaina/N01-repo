import { CartItemWithProduct } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";

interface CartItemProps {
  item: CartItemWithProduct;
  showControls?: boolean;
}

export function CartItem({ item, showControls = true }: CartItemProps) {
  const { product, quantity } = item;
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <li className="py-6 flex">
      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-center object-cover"
        />
      </div>

      <div className="ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-primary-900">
            <h3>{product.name}</h3>
            <p className="ml-4">${(Number(product.price) * quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        </div>
        {showControls ? (
          <div className="flex-1 flex items-end justify-between text-sm">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => updateQuantity(item.id, quantity - 1)}
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border border-gray-300 p-0"
              >
                <MinusIcon className="h-4 w-4" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <span className="text-gray-500">{quantity}</span>
              <Button
                onClick={() => updateQuantity(item.id, quantity + 1)}
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border border-gray-300 p-0"
              >
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>

            <Button
              onClick={() => removeFromCart(item.id)}
              variant="ghost"
              className="font-medium text-secondary-600 hover:text-secondary-500"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex items-end justify-between text-sm">
            <p className="text-gray-500">Qty {quantity}</p>
          </div>
        )}
      </div>
    </li>
  );
}
