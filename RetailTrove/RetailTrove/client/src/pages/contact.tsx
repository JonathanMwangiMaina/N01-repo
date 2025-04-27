import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  MapPinIcon, 
  PhoneIcon, 
  RectangleEllipsis, 
  ClockIcon,
  Loader2Icon
} from "lucide-react";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      
      // In a real app, you'd send this data to a backend API
      console.log("Form submitted:", values);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset the form
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gray-50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/70 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
              alt="Contact us" 
              className="h-full w-full object-cover opacity-30"
            />
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Get in Touch</h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            We'd love to hear from you. Whether you have a question about our products, shipping, or anything else, our team is ready to help.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact information */}
          <div>
            <h2 className="text-2xl font-bold text-primary-900 mb-8">Contact Information</h2>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-600 text-white">
                    <MapPinIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-primary-900">Visit Us</h3>
                  <p className="mt-1 text-gray-500">
                    123 Market Street<br />
                    San Francisco, CA 94105<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-600 text-white">
                    <PhoneIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-primary-900">Call Us</h3>
                  <p className="mt-1 text-gray-500">
                    +1 (555) 123-4567<br />
                    Monday through Friday, 9am-6pm PT
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-600 text-white">
                    <RectangleEllipsis className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-primary-900">Email Us</h3>
                  <p className="mt-1 text-gray-500">
                    support@modernretail.com<br />
                    sales@modernretail.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-600 text-white">
                    <ClockIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-primary-900">Business Hours</h3>
                  <p className="mt-1 text-gray-500">
                    Monday-Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact form */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-primary-900 mb-8">Send Us a Message</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="h-36"
                            placeholder="How can we help you?"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      
      {/* Map section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-primary-900 mb-8 text-center">Find Us</h2>
          <div className="h-96 bg-gray-300 rounded-lg overflow-hidden">
            {/* In a real app, you'd use a map library like Google Maps or Mapbox */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12615.555082498943!2d-122.4003697139452!3d37.79274754665997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085806285ddb1b3%3A0x7b6e831ecaf245!2sSan%20Francisco%2C%20CA%2094105!5e0!3m2!1sen!2sus!4v1660598211457!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="ModernRetail store location"
            ></iframe>
          </div>
        </div>
      </div>
      
      {/* FAQ section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-primary-900">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-500">
            Can't find the answer you're looking for? Reach out to our customer support team.
          </p>
        </div>
        <div className="mt-12 space-y-6 divide-y divide-gray-200">
          <div className="pt-6">
            <div className="text-lg">
              <h3 className="font-medium text-primary-900">What are your shipping times?</h3>
              <div className="mt-2 text-base text-gray-500">
                <p>We process most orders within 1-2 business days. Standard shipping typically takes 3-5 business days once shipped. Express shipping options are available at checkout.</p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <div className="text-lg">
              <h3 className="font-medium text-primary-900">Do you offer international shipping?</h3>
              <div className="mt-2 text-base text-gray-500">
                <p>Yes, we ship to most countries worldwide. International shipping times vary by destination, typically 7-14 business days.</p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <div className="text-lg">
              <h3 className="font-medium text-primary-900">What is your return policy?</h3>
              <div className="mt-2 text-base text-gray-500">
                <p>We accept returns within 30 days of delivery. Items must be unused and in their original packaging. Please contact our customer service team to initiate a return.</p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <div className="text-lg">
              <h3 className="font-medium text-primary-900">How can I track my order?</h3>
              <div className="mt-2 text-base text-gray-500">
                <p>Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order in your account dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
