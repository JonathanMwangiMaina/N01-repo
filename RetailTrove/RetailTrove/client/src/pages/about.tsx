import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gray-50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/70 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1581075653353-85200216e351?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
              alt="Team working together" 
              className="h-full w-full object-cover opacity-30"
            />
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">About ModernRetail</h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            We're dedicated to bringing you premium quality products with exceptional design and craftsmanship.
          </p>
        </div>
      </div>

      {/* Our story section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-extrabold text-primary-900 tracking-tight sm:text-4xl">Our Story</h2>
            <p className="mt-4 text-lg text-gray-500">
              ModernRetail began with a simple idea: to create a shopping experience that prioritizes quality, design, and customer satisfaction. Founded in 2018, we've grown from a small startup to a beloved brand with customers worldwide.
            </p>
            <p className="mt-4 text-lg text-gray-500">
              Our team of passionate designers and curators search the globe for exceptional products that combine functionality with beautiful aesthetics. We believe that everyday items should bring joy and enhance your lifestyle.
            </p>
            <p className="mt-4 text-lg text-gray-500">
              From premium watches to minimalist home goods, every item in our collection is carefully selected to ensure it meets our high standards for quality and design excellence.
            </p>
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="Our team" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-primary-900 tracking-tight sm:text-4xl">Our Values</h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
              These core principles guide everything we do at ModernRetail.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-12 w-12 rounded-md bg-secondary-600 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-primary-900">Quality First</h3>
              <p className="mt-2 text-base text-gray-500">
                We never compromise on quality. Every product we offer is carefully vetted to ensure it meets our high standards for materials, craftsmanship, and durability.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-12 w-12 rounded-md bg-secondary-600 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-primary-900">Thoughtful Design</h3>
              <p className="mt-2 text-base text-gray-500">
                We believe that good design solves problems. Our products combine aesthetics with functionality to enhance your everyday life in meaningful ways.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-12 w-12 rounded-md bg-secondary-600 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-primary-900">Ethical Sourcing</h3>
              <p className="mt-2 text-base text-gray-500">
                We partner with manufacturers who share our commitment to ethical production practices, fair labor standards, and sustainable materials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-primary-900 tracking-tight sm:text-4xl">Meet Our Team</h2>
          <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
            The passionate people behind ModernRetail.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Team member 1 */}
          <div className="text-center">
            <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                alt="Sarah Johnson" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-primary-900">Sarah Johnson</h3>
              <p className="text-sm text-gray-500">Founder & CEO</p>
              <p className="mt-2 text-base text-gray-500 max-w-xs mx-auto">
                With 15 years of retail experience, Sarah founded ModernRetail with a vision to transform online shopping.
              </p>
            </div>
          </div>

          {/* Team member 2 */}
          <div className="text-center">
            <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                alt="David Chen" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-primary-900">David Chen</h3>
              <p className="text-sm text-gray-500">Head of Product</p>
              <p className="mt-2 text-base text-gray-500 max-w-xs mx-auto">
                David leads our product curation team with an expert eye for quality and emerging design trends.
              </p>
            </div>
          </div>

          {/* Team member 3 */}
          <div className="text-center">
            <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                alt="Maya Rodriguez" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-primary-900">Maya Rodriguez</h3>
              <p className="text-sm text-gray-500">Creative Director</p>
              <p className="mt-2 text-base text-gray-500 max-w-xs mx-auto">
                Maya brings our brand to life through thoughtful design and storytelling that connects with customers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-secondary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to explore our collection?</span>
            <span className="block text-secondary-200">Find your perfect product today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/shop">
                <Button size="lg" className="bg-white text-secondary-600 hover:bg-gray-50">
                  Shop Now
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/contact">
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
