'use client';

import { useCart } from '@/store/useCart';
import { useSession, signIn, signOut } from "next-auth/react";
import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl sm:text-3xl font-bold tracking-[0.2em] text-gradient uppercase">
              ELENOR
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="#specs" className="text-gray-300 hover:text-white transition-colors">Specifications</Link>
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link href="#reviews" className="text-gray-300 hover:text-white transition-colors">Reviews</Link>
              <Link href="#inquiry" className="text-gray-300 hover:text-white transition-colors">Inquire</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-4">
              {session ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">{session.user?.name}</span>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => signIn('google')}
                  className="hidden sm:flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
                >
                  <User size={20} /> Login
                </button>
              )}

              <Link href="/cart" className="relative p-2 hover:bg-white/5 rounded-full transition-colors group">
                <ShoppingBag size={24} />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-background">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
            
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white transition-colors">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass border-b border-glass-border"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="#specs" className="block px-3 py-4 text-base font-medium text-gray-300 hover:text-white">Specifications</Link>
              <Link href="#features" className="block px-3 py-4 text-base font-medium text-gray-300 hover:text-white">Features</Link>
              <Link href="#reviews" className="block px-3 py-4 text-base font-medium text-gray-300 hover:text-white">Reviews</Link>
              <Link href="#inquiry" className="block px-3 py-4 text-base font-medium text-gray-300 hover:text-white">Inquire</Link>
              <Link href="/cart" className="block px-3 py-4 text-base font-medium text-gray-300 hover:text-white">Cart ({itemCount})</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
