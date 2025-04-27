import { Link } from "wouter";
import { 
  FacebookIcon, 
  InstagramIcon, 
  TwitterIcon 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              Modern<span className="text-accent-500">Retail</span>
            </h3>
            <p className="text-primary-300 text-sm">
              Your one-stop shop for premium products with exceptional quality and design.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-primary-300 hover:text-white">
                <span className="sr-only">Facebook</span>
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-primary-300 hover:text-white">
                <span className="sr-only">Instagram</span>
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-primary-300 hover:text-white">
                <span className="sr-only">Twitter</span>
                <TwitterIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link className="text-primary-300 hover:text-white text-sm" href="/shop">
                  All Products
                </Link>
              </li>
              <li>
                <Link className="text-primary-300 hover:text-white text-sm" href="/shop?category=New%20Arrivals">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link className="text-primary-300 hover:text-white text-sm" href="/shop?featured=true">
                  Featured
                </Link>
              </li>
              <li>
                <Link className="text-primary-300 hover:text-white text-sm" href="/shop?sale=true">
                  Sales & Discounts
                </Link>
              </li>
              <li>
                <a href="#" className="text-primary-300 hover:text-white text-sm">Gift Cards</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-base mb-4">About</h3>
            <ul className="space-y-3">
              <li>
                <Link className="text-primary-300 hover:text-white text-sm" href="/about">
                  Our Story
                </Link>
              </li>
              <li>
                <a href="#" className="text-primary-300 hover:text-white text-sm">Careers</a>
              </li>
              <li>
                <a href="#" className="text-primary-300 hover:text-white text-sm">Press</a>
              </li>
              <li>
                <a href="#" className="text-primary-300 hover:text-white text-sm">Sustainability</a>
              </li>
              <li>
                <a href="#" className="text-primary-300 hover:text-white text-sm">Blog</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link className="text-primary-300 hover:text-white text-sm" href="/contact">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-primary-300 hover:text-white text-sm">Shipping & Returns</a>
              </li>
              <li>
                <a href="#" className="text-primary-300 hover:text-white text-sm">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-primary-300 hover:text-white text-sm">Track Order</a>
              </li>
              <li>
                <a href="#" className="text-primary-300 hover:text-white text-sm">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-primary-300 hover:text-white text-sm">Terms & Conditions</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-300 text-sm">© {new Date().getFullYear()} ModernRetail. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            {/* Payment method SVGs */}
            <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
              <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#0E4595"/>
              <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFF"/>
              <path d="M15 19h2v-9h-2v9zm-5.8-9L6.6 15c-.3.7-.6 1.3-.9 1.5H9.2L13 10h-3.8zm21.5 9h2l-5-9h-1.6l-5 9h1.8l1.1-2.3h5.6l1.1 2.3zm-4.7-3.7l2.3-4.9 2.3 4.9h-4.6z" fill="#0E4595"/>
            </svg>
            <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
              <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000"/>
              <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFF"/>
              <path d="M15 19h6v-1h-6v1zm17-10c0-3.3-2.7-6-6-6s-6 2.7-6 6 2.7 6 6 6 6-2.7 6-6zm-6-4c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zM9 9c0-3.3-2.7-6-6-6S-3 5.7-3 9s2.7 6 6 6 6-2.7 6-6zm-6-4c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z" fill="#FF5F00"/>
            </svg>
            <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
              <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#003087"/>
              <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFF"/>
              <path d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 14.6c0 .2.1.4.3.4h3c.2 0 .4-.2.5-.4l.2-1c0-.2.3-.4.5-.4h1.6c2.3 0 4.1-1 4.6-3.1l.2-.8c.1-.5.1-.9.1-1.3zm-1.6 1.3l-.2.8c-.3 1.3-1.4 1.9-2.9 1.9h-.8c-.2 0-.3-.2-.2-.4l.4-1.9.1-.4c0-.2.3-.4.5-.4h1.1c.5 0 .9.1 1.2.3.3.2.5.6.4 1.1zm-7.8-4.8c-.1-.1 0-.2.1-.2h3.1c.8 0 1.3.2 1.7.5.4.3.6.8.5 1.5v.3c0 .2-.1.3-.3.3h-2.7c-2 0-3.5.8-4 2.8l-.5 2.5c0 .1-.1.2-.2.2h-1.5c-.2 0-.3-.2-.3-.4l1.1-7.3z" fill="#003087"/>
            </svg>
            <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
              <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#006FCF"/>
              <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFF"/>
              <path d="M9 11h4v4H9z" fill="#006FCF"/>
              <path d="M9 7h4v3H9z" fill="#006FCF"/>
              <path d="M11 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#FFF"/>
              <path d="M13 15.5c0-.8-.7-1.5-1.5-1.5h-1.2c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5h1.2c.8 0 1.5-.7 1.5-1.5z" fill="#006FCF"/>
              <path d="M20 10.5h-4c-.3 0-.5.2-.5.5s.2.5.5.5h4c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm.5 2h-5c-.3 0-.5.2-.5.5s.2.5.5.5h5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm.5 2h-6c-.3 0-.5.2-.5.5s.2.5.5.5h6c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm-4.5 3h-2c-.3 0-.5.2-.5.5s.2.5.5.5h2c.3 0 .5-.2.5-.5s-.2-.5-.5-.5z" fill="#006FCF"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
