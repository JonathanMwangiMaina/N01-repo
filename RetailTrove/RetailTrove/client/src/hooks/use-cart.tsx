import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { 
  Product, 
  CartItemWithProduct, 
  InsertCartItem 
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cart: CartItemWithProduct[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => void;
  isLoading: boolean;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Get a unique cart ID for this session
  const getCartId = () => {
    let cartId = localStorage.getItem("cartId");
    if (!cartId) {
      cartId = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem("cartId", cartId);
    }
    return cartId;
  };
  
  // Calculate derived values
  const subtotal = cart.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );
  
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  
  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartId = getCartId();
        const res = await fetch(`/api/cart/${cartId}`, {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          setCart(data);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast({
          title: "Error",
          description: "Failed to load your cart",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCart();
  }, []);
  
  // Add item to cart
  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      const cartId = getCartId();
      
      // Check if product is already in cart
      const existingItem = cart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity if already in cart
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        // Add new item
        const cartItem: InsertCartItem = {
          productId: product.id,
          quantity,
          cartId,
        };
        
        const res = await apiRequest("POST", "/api/cart", cartItem);
        const newItem = await res.json();
        
        // We need to combine with product info
        setCart(prev => [...prev, { ...newItem, product }]);
        
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart`,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };
  
  // Update quantity
  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }
      
      const res = await apiRequest("PUT", `/api/cart/${itemId}`, { quantity });
      
      if (res.ok) {
        setCart(prev => 
          prev.map(item => 
            item.id === itemId ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive",
      });
    }
  };
  
  // Remove from cart
  const removeFromCart = async (itemId: number) => {
    try {
      await apiRequest("DELETE", `/api/cart/${itemId}`, undefined);
      
      setCart(prev => prev.filter(item => item.id !== itemId));
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };
  
  // Clear cart
  const clearCart = () => {
    // This only clears locally - in a real app you'd want to clear on the server too
    setCart([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };
  
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isLoading,
        subtotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
}
