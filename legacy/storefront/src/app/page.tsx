import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductDetails from "@/components/ProductDetails";
import Reviews from "@/components/Reviews";
import InquiryForm from "@/components/InquiryForm";
import { BRAND_NAME, BRAND_YEAR } from "@/constants";
import { ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative flex flex-col min-h-screen bg-background">
      <Navbar />
      <ProductDetails />
      <Hero />
      <Features />
      <Reviews />
      <InquiryForm />
      
      {/* Luxury Footer */}
      <footer className="relative border-t border-glass-border glass mt-auto bg-secondary/90 text-gray-300">
        {/* Fine gold border detail at the top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 items-start">
            
            {/* Column 1: Brand Intro */}
            <div className="md:col-span-1 space-y-4">
              <Link href="/" className="text-2xl font-bold tracking-[0.2em] text-gradient uppercase block">
                ELENOR
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-light">
                The science of advanced keratin complexes and natural botanicals engineered for ultra-luxury hair restoration.
              </p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="md:col-span-1 space-y-4">
              <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-white">Menu</h4>
              <ul className="space-y-2.5 text-sm font-light text-gray-400">
                <li><Link href="#specs" className="hover:text-primary transition-colors">Specifications</Link></li>
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#reviews" className="hover:text-primary transition-colors">Testimonials</Link></li>
                <li><Link href="#inquiry" className="hover:text-primary transition-colors">Inquire</Link></li>
              </ul>
            </div>

            {/* Column 3: Professional Info */}
            <div className="md:col-span-1 space-y-4">
              <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-white">Professional</h4>
              <ul className="space-y-2.5 text-sm font-light text-gray-400">
                <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Dashboard</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Salon Network</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Safety Sheets</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Distribution FAQ</a></li>
              </ul>
            </div>

            {/* Column 4: Shipping Guarantee & Secure Badges */}
            <div className="md:col-span-1 space-y-4">
              <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-white">Complimentary Delivery</h4>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Enjoy complimentary express delivery and signature luxury packaging on all collections.
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-xl text-xs font-light text-gray-400 shadow-sm">
                  <ShieldCheck size={14} className="text-primary" />
                  <span>Stripe Secure Payments</span>
                </div>
              </div>
            </div>

          </div>

          <div className="border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-light">
            <div>
              © {BRAND_YEAR} {BRAND_NAME} Luxury Haircare. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <span>•</span>
              <span className="flex items-center gap-1">
                Crafted with <Heart size={10} className="text-red-400 fill-red-400" /> for elite salons
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
