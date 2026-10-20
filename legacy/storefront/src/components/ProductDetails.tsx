'use client';

import { motion } from 'framer-motion';

export default function ProductDetails() {
  return (
    <section id="specs" className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 px-4 sm:px-0"
          >
            <div className="glass p-1 rounded-[2rem] sm:rounded-[3rem] overflow-hidden">
              <img 
                src="/lifestyle.png" 
                alt="ELENOR Noir Repair Experience" 
                className="rounded-[1.8rem] sm:rounded-[2.8rem] w-full h-[600px] object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-4xl font-bold mb-8 uppercase tracking-tight">The Science of <span className="text-gradient">Noir Repair</span></h2>
            
            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wider text-primary">Benefits</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Intensive Repair & Strength
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Silken Texture & Luminous Shine
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Anti-Frizz Shield for 48 Hours
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wider text-primary">Directions</h3>
                <p className="text-gray-400 leading-relaxed">
                  A refined cleansing ritual crafted with an advanced keratin complex to restore strength, enhance smoothness, and reveal naturally radiant hair. Massage into wet hair to create a rich lather. Rinse thoroughly. Repeat if desired.
                </p>
              </div>

              <div className="p-8 glass rounded-3xl">
                <h3 className="text-sm font-bold mb-3 uppercase tracking-widest text-gray-500">Premium Ingredients</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Water, Sodium Lauroyl Sarcosinate, Cocamidopropyl Betaine, Glycerin, Sodium Chloride, Dimethicone, Hydrolyzed Keratin, Argan Oil, Macadamia Seed Oil, Panthenol, Hydrolyzed Silk Protein, Lactic Acid, Fragrance, Phenoxyethanol, Ethylhexylglycerin.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
