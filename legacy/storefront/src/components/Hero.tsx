'use client';

import { useCart } from '@/store/useCart';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { PRODUCT_ID, PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_IMAGE } from '@/constants';

export default function Hero() {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
      id: PRODUCT_ID,
        name: PRODUCT_NAME,
        price: PRODUCT_PRICE,
        image: PRODUCT_IMAGE
      });
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-4 uppercase text-center lg:text-left">
              Ultra Luxury <br />
              <span className="text-gradient">Haircare</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
              Experience the Noir Repair Collection. A sophisticated blend of advanced keratin complex and natural botanicals designed for salon-exclusive results.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-4 bg-white/5 rounded-full p-2 border border-white/10 w-full sm:w-auto justify-between sm:justify-start">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="w-8 text-center font-bold text-xl">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="btn-primary flex items-center justify-center gap-2 group w-full sm:w-auto"
              >
                Add to Bag <ShoppingBag size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="mt-8 flex justify-center lg:justify-start">
              <Link 
                href="#features"
                className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-bold"
              >
                Discover the Collection <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-2 sm:flex sm:items-center gap-6 sm:gap-8 border-t border-glass-border pt-8">
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl font-bold uppercase">Sulphate</div>
                <div className="text-xs sm:text-sm text-gray-500">Free Formula</div>
              </div>
              <div className="border-l border-glass-border pl-6 sm:pl-8 text-center sm:text-left">
                <div className="text-xl sm:text-2xl font-bold uppercase">Keratin</div>
                <div className="text-xs sm:text-sm text-gray-500">Advanced Complex</div>
              </div>
              <div className="hidden sm:block border-l border-glass-border pl-8">
                <div className="text-2xl font-bold uppercase">Salon</div>
                <div className="text-sm text-gray-500">Exclusive Quality</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-[500px] aspect-square">
              <Image
                src="/elenor-product-hair.png"
                alt="ELENOR Noir Repair Collection"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
