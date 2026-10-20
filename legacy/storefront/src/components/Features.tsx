'use client';

import { motion } from 'framer-motion';
import { Battery, Shield, Cpu, Zap, Heart, Bell } from 'lucide-react';

const features = [
  {
    icon: <Zap className="text-primary" />,
    title: "Noir Repair Ritual",
    description: "Deep cleansing hair ritual infused with advanced keratin complex to restore strength and shine."
  },
  {
    icon: <Shield className="text-secondary" />,
    title: "Sulphate Free",
    description: "Gentle formulation that preserves natural oils while providing intensive nourishment and protection."
  },
  {
    icon: <Cpu className="text-accent" />,
    title: "Advanced Keratin",
    description: "Bio-engineered keratin complex that penetrates deep into the hair shaft for structural repair."
  },
  {
    icon: <Bell className="text-primary" />,
    title: "Salon Exclusive",
    description: "Professional grade products previously only available in high-end boutique salons."
  },
  {
    icon: <Heart className="text-red-400" />,
    title: "Luxe Hair Elixir",
    description: "A transformative elixir that adds luminous shine and manages frizz for a flawless finish."
  },
  {
    icon: <Battery className="text-green-600" />,
    title: "Sustainable Luxury",
    description: "Responsibly sourced ingredients packaged in eco-conscious, premium materials."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Pure Luxury, Proven Results</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Every bottle of ELENOR has been meticulously crafted to provide a seamless and luxury haircare experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-3xl hover:bg-white/5 transition-all duration-300 border border-white/5 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
