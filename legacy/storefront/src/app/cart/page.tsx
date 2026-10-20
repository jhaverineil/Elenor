'use client';

import { useCart } from '@/store/useCart';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCart();
  const total = getTotal();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Shopping Bag</h1>
          <p className="text-gray-500">Review your luxury haircare selection</p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass rounded-3xl"
          >
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
            <p className="text-gray-500 mb-8">Discover our Noir Repair collection and give your hair the luxury it deserves.</p>
            <Link href="/" className="btn-primary">
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="glass p-6 rounded-3xl flex flex-col sm:flex-row gap-6 items-center"
                >
                  <div className="relative w-32 h-32 bg-white/5 rounded-2xl overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold mb-1 uppercase tracking-tight">{item.name}</h3>
                    <p className="text-primary font-semibold mb-4">₹{item.price.toLocaleString('en-IN')}</p>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/10">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors ml-4"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xl font-bold">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="glass p-8 rounded-3xl sticky top-32">
                <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-500 font-medium">Complimentary</span>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 group">
                  Checkout Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <p className="mt-6 text-xs text-center text-gray-500">
                  Secure Checkout powered by Stripe. <br />
                  Free returns on all orders.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
