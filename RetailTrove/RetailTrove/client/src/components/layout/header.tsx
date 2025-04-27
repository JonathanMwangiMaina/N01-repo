import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import CartDrawer from "@/components/cart/cart-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  SearchIcon, 
  ShoppingBagIcon, 
  UserIcon, 
  MenuIcon, 
  XIcon 
} from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { cart, totalItems } = useCart();
  const { toast } = useToast();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to shop page with search query
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
    } else {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
    }
  };

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Announcement Banner */}
      <div className="bg-secondary-600 text-white text-sm text-center py-2 px-4">
        <p>Free shipping on all orders over $50! Use code: FREESHIP</p>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="font-bold text-xl text-primary-900 cursor-pointer">
                  Modern<span className="text-accent-500">Retail</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 text-sm">
              {navigationLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <span className={`font-medium cursor-pointer ${
                    location === link.href
                      ? "text-secondary-600"
                      : "text-primary-900 hover:text-secondary-600"
                  } transition-colors`}>
                    {link.name}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button
                onClick={() => setSearchOpen(!searchOpen)}
                variant="ghost"
                size="icon"
                className="text-primary-500 hover:text-primary-900 p-1 rounded-full"
              >
                <SearchIcon className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              
              {/* Account */}
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-500 hover:text-primary-900 p-1 rounded-full hidden sm:block"
              >
                <UserIcon className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
              
              {/* Cart */}
              <Button
                onClick={() => setCartOpen(!cartOpen)}
                variant="ghost"
                size="icon"
                className="text-primary-500 hover:text-primary-900 p-1 rounded-full relative"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
              
              {/* Mobile menu button */}
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="ghost"
                size="icon"
                className="md:hidden text-primary-500 hover:text-primary-900"
              >
                {mobileMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
                <span className="sr-only">Open menu</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <span 
                    className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                      location === link.href
                        ? "bg-primary-50 text-secondary-600"
                        : "text-primary-900 hover:bg-primary-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-gray-200 py-3 px-4">
            <form className="max-w-3xl mx-auto" onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </form>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
    </>
  );
}
