'use client';

import { useSession, signIn } from "next-auth/react";
import { CreditCard, Truck, ShieldCheck, CheckCircle2, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/useCart';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { placeOrder } from '@/services/orderService';
import type { CheckoutFormData } from '@/types';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const { data: session } = useSession();
  const total = getTotal();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India'
  });

  useEffect(() => {
    if (session?.user) {
      const names = session.user.name?.split(' ') || ['', ''];
      setFormData(prev => ({
        ...prev,
        email: session.user?.email || prev.email,
        firstName: names[0] || prev.firstName,
        lastName: names.slice(1).join(' ') || prev.lastName,
      }));
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call to n8n / Payment
    try {
      const result = await placeOrder({ customer: formData, items, total });

      if (result.success) {
        setIsSuccess(true);
        clearCart();
        setTimeout(() => { router.push('/'); }, 5000);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-3xl text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold mb-4 uppercase">Order Confirmed!</h1>
          <p className="text-gray-400 mb-8">
            Thank you for your purchase, {formData.firstName}. A confirmation email has been sent to {formData.email}.
          </p>
          <p className="text-sm text-gray-500">Redirecting to home page...</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Shipping Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl font-bold mb-4 uppercase flex items-center gap-3">
              <Truck size={28} className="text-primary" /> Shipping Details
            </h2>
            
            {!session && (
              <div className="glass p-4 rounded-2xl mb-8 border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <User size={18} className="text-primary" />
                  <span>Log in for a faster checkout experience</span>
                </div>
                <button 
                  onClick={() => signIn('google')}
                  className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                >
                  Login
                </button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary outline-none transition-colors"
                    placeholder="alex@example.com"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                    <input
                      required
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                    <input
                      required
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Street Address</label>
                  <input
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary outline-none transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                    <input
                      required
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Postal Code</label>
                    <input
                      required
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <h2 className="text-3xl font-bold mb-8 uppercase flex items-center gap-3">
                  <CreditCard size={28} className="text-primary" /> Payment
                </h2>
                <div className="glass p-6 rounded-3xl border-primary/30 border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/20 rounded-xl text-primary">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <p className="font-bold">Secure Payment via Stripe</p>
                      <p className="text-sm text-gray-500">All transactions are encrypted and secure.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="btn-primary w-full py-5 text-xl uppercase tracking-widest disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <ShieldCheck size={16} /> 256-bit SSL Secure Checkout
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <div className="glass p-10 rounded-3xl sticky top-32">
              <h3 className="text-2xl font-bold mb-8 uppercase">Your Order</h3>
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-white/5 rounded-xl shrink-0">
                      <img src={item.image} alt={item.name} className="object-contain p-2" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase tracking-tight">{item.name}</p>
                      <p className="text-primary font-semibold mb-4">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="ml-auto font-bold">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-500">Complimentary</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-4">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
