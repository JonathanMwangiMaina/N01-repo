import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/components/ui/cart-item";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { XIcon, ShoppingBagIcon } from "lucide-react";

interface CartDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CartDrawer({ open, setOpen }: CartDrawerProps) {
  const { cart, subtotal, totalItems } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-40">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => setOpen(false)}
        ></div>
        
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md transform transition ease-in-out duration-500">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-primary-900">Shopping cart</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <Button
                      onClick={() => setOpen(false)}
                      variant="ghost"
                      size="icon"
                      className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <XIcon className="h-6 w-6" />
                      <span className="sr-only">Close panel</span>
                    </Button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flow-root">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBagIcon className="h-12 w-12 mx-auto text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                        <p className="mt-1 text-sm text-gray-500">Start adding some products to your cart</p>
                        <div className="mt-6">
                          <Button
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700"
                          >
                            Continue Shopping
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {cart.map((item) => (
                          <CartItem key={item.id} item={item} />
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {cart.length > 0 && (
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-primary-900">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <Link href="/checkout">
                      <Button
                        onClick={() => setOpen(false)}
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-secondary-600 hover:bg-secondary-700"
                      >
                        Checkout
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                      or{" "}
                      <Button
                        onClick={() => setOpen(false)}
                        variant="link"
                        className="text-secondary-600 font-medium hover:text-secondary-500"
                      >
                        Continue Shopping<span aria-hidden="true"> &rarr;</span>
                      </Button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
