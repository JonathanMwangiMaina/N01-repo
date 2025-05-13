import React, { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/components/ui/cart-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOrderSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Loader2Icon } from "lucide-react";

// Extend order schema with validation
const checkoutFormSchema = insertOrderSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  postalCode: z.string().min(5, "Please enter a valid postal code"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate tax (10%)
  const tax = subtotal * 0.1;
  // Calculate total
  const total = subtotal + tax;
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
      total: total.toString(),
    },
  });
  
  const onSubmit = async (values: CheckoutFormValues) => {
    // Don't submit if cart is empty
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Update total with current value
      values.total = total.toString();
      
      // Create order items from cart
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));
      
      // Create order
      const response = await apiRequest("POST", "/api/orders", {
        order: values,
        items: orderItems,
      });
      
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      
      // Clear cart
      clearCart();
      
      // Get order data from response
      const orderData = await response.json();
      const orderId = orderData.id || 'ORDER123456'; // Fallback for demo purposes
      
      // Show success toast
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase",
        variant: "success",
      });
      
      // Redirect to order confirmation page
      navigate(`/order-confirmation?id=${orderId}&total=${total}`);
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Error",
        description: "Failed to submit your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Left column - Checkout form */}
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-bold text-primary-900 mb-8">Checkout</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Contact Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                  <h3 className="text-lg font-medium text-primary-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} className="mt-1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} className="mt-1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" className="mt-1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" className="mt-1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Shipping Address */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                  <h3 className="text-lg font-medium text-primary-900 mb-4">Shipping Address</h3>
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} className="mt-1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="apartment"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Apartment, suite, etc.</FormLabel>
                            <FormControl>
                            <Input {...field} value={field.value ?? ""} placeholder="e.g., Apt 101" className="mt-1" />
                            </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} className="mt-1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <FormControl>
                            <Input {...field} className="mt-1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal code</FormLabel>
                          <FormControl>
                            <Input {...field} className="mt-1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Australia">Australia</SelectItem>
                                <SelectItem value="Belgium">Belgium</SelectItem>
                                <SelectItem value="Brazil">Brazil</SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                                <SelectItem value="China">China</SelectItem>
                                <SelectItem value="Denmark">Denmark</SelectItem>
                                <SelectItem value="Finland">Finland</SelectItem>
                                <SelectItem value="France">France</SelectItem>
                                <SelectItem value="Germany">Germany</SelectItem>
                                <SelectItem value="India">India</SelectItem>
                                <SelectItem value="Italy">Italy</SelectItem>
                                <SelectItem value="Japan">Japan</SelectItem>
                                <SelectItem value="Kenya">Kenya</SelectItem>
                                <SelectItem value="Mexico">Mexico</SelectItem>
                                <SelectItem value="Netherlands">Netherlands</SelectItem>
                                <SelectItem value="Nigeria">Nigeria</SelectItem>
                                <SelectItem value="Norway">Norway</SelectItem>
                                <SelectItem value="Russia">Russia</SelectItem>
                                <SelectItem value="South Africa">South Africa</SelectItem>
                                <SelectItem value="Spain">Spain</SelectItem>
                                <SelectItem value="Sweden">Sweden</SelectItem>
                                <SelectItem value="Tanzania">Tanzania</SelectItem>
                                <SelectItem value="Uganda">Uganda</SelectItem>
                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                <SelectItem value="United States">United States</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-primary-900 mb-4">Payment Method</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input 
                        id="card" 
                        name="payment-method" 
                        type="radio" 
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="h-4 w-4 text-secondary-600 border-gray-300 focus:ring-secondary-500" 
                        title="Select Credit Card as Payment Method"
                      />
                      <Label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">Credit Card</Label>
                    </div>
                    
                    {paymentMethod === "card" && (
                      <div className="border rounded-md p-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="col-span-2">
                            <Label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card number</Label>
                            <Input 
                              type="text" 
                              id="card-number" 
                              name="card-number"
                              placeholder="1234 1234 1234 1234"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">Expiration date (MM/YY)</Label>
                            <Input 
                              type="text" 
                              id="expiration-date" 
                              name="expiration-date"
                              placeholder="MM/YY"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</Label>
                            <Input 
                              type="text" 
                              id="cvc" 
                              name="cvc"
                              placeholder="123"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <input 
                        id="paypal" 
                        name="payment-method" 
                        type="radio"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                        className="h-4 w-4 text-secondary-600 border-gray-300 focus:ring-secondary-500"
                        title="Select PayPal as Payment Method" 
                      />
                      <Label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">PayPal</Label>
                    </div>
                    
                    {paymentMethod === "paypal" && (
                      <div className="border rounded-md p-4">
                        <div className="flex flex-col items-center space-y-4">
                          <img 
                            src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" 
                            alt="PayPal" 
                            className="h-8" 
                          />
                          <p className="text-sm text-gray-600 text-center">
                            You&#39;ll be redirected to PayPal to complete your payment securely.
                          </p>
                          <Button
                            type="button"
                            onClick={() => {
                              // Simulate PayPal redirect and return
                              toast({
                                title: "Connecting to PayPal",
                                description: "Securely connecting to PayPal services...",
                              });
                              
                              // Simulate a redirect delay
                              setTimeout(() => {
                                toast({
                                  title: "PayPal Authorization Successful",
                                  description: "Completing your order...",
                                  variant: "success"
                                });
                                
                                // Continue with the checkout flow
                                form.handleSubmit(onSubmit)();
                              }, 1500);
                            }}
                            className="bg-[#0070ba] hover:bg-[#005ea6] text-white w-full"
                          >
                            Pay with PayPal
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Submit button - only visible on mobile */}
                <div className="mt-10 lg:hidden">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || cart.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Order"
                    )}
                  </Button>
                  <p className="mt-4 text-xs text-center text-gray-500">
                    By placing your order, you agree to our{" "}
                    <span className="text-secondary-600 hover:text-secondary-500 cursor-pointer" onClick={() => alert('Terms & Conditions - Coming Soon')}>Terms & Conditions</span> and{" "}
                    <span className="text-secondary-600 hover:text-secondary-500 cursor-pointer" onClick={() => alert('Privacy Policy - Coming Soon')}>Privacy Policy</span>.
                  </p>
                </div>
              </form>
            </Form>
          </div>

          {/* Right column - Order Summary */}
          <div className="mt-10 lg:mt-0 lg:col-span-5">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 sticky top-20">
              <h2 className="text-lg font-medium text-primary-900 mb-6">Order Summary</h2>
              
              <div className="flow-root">
                {cart.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">Your cart is empty</p>
                    <Link href="/shop">
                      <Button className="mt-4" variant="outline">
                        Go shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {cart.map((item) => (
                      <CartItem key={item.id} item={item} showControls={false} />
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between text-sm mb-2">
                  <p className="text-gray-500">Subtotal</p>
                  <p className="font-medium text-primary-900">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <p className="text-gray-500">Shipping</p>
                  <p className="font-medium text-primary-900">Free</p>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <p className="text-gray-500">Tax</p>
                  <p className="font-medium text-primary-900">${tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base font-medium mt-6">
                  <p className="text-primary-900">Total</p>
                  <p className="text-primary-900">${total.toFixed(2)}</p>
                </div>
              </div>

              {/* Desktop submit button */}
              <div className="mt-6 hidden lg:block">
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  className="w-full"
                  disabled={isSubmitting || cart.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Complete Order"
                  )}
                </Button>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    By placing your order, you agree to our{" "}
                    <span className="text-secondary-600 hover:text-secondary-500 cursor-pointer" onClick={() => alert('Terms & Conditions - Coming Soon')}>Terms & Conditions</span> and{" "}
                    <span className="text-secondary-600 hover:text-secondary-500 cursor-pointer" onClick={() => alert('Privacy Policy - Coming Soon')}>Privacy Policy</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
