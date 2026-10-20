'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: "Priya Sharma",
    role: "Professional Stylist",
    content: "The Noir Repair collection is a game-changer. My clients have noticed immediate results in hair strength and shine. It's absolute luxury in a bottle.",
    rating: 5
  },
  {
    name: "Ananya Iyer",
    role: "Verified Customer",
    content: "I've tried many luxury brands, but ELENOR stands out. The Elixir is lightweight and makes my hair feel like silk. Highly recommend!",
    rating: 5
  },
  {
    name: "Rohan Gupta",
    role: "Verified Customer",
    content: "The scent is divine and the results are even better. My hair feels much more manageable and healthy after just a week of use.",
    rating: 5
  }
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-tight">Client Testimonials</h2>
          <div className="flex justify-center gap-1 text-primary mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
          </div>
          <p className="text-gray-500">Rated 4.9/5 by over 2,000+ happy customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-3xl relative"
            >
              <div className="flex gap-1 text-primary mb-6">
                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-gray-600 italic mb-8 leading-relaxed">
                "{review.content}"
              </p>
              <div>
                <p className="font-bold uppercase tracking-wider text-sm">{review.name}</p>
                <p className="text-xs text-gray-500">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
