'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitInquiry } from '@/services/contactService';
import { Send, CheckCircle2, User, Mail, Phone, MessageSquare, Tag } from 'lucide-react';

export default function InquiryForm() {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('Noir Repair Ritual');
  const [message, setMessage] = useState('');

  // Status state
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMsg('');

    try {
      const result = await submitInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        brand: inquiryType,
        message: message.trim(),
      });

      if (!result.success) {
        setErrorMsg(result.error || 'Failed to submit inquiry. Please try again.');
        return;
      }

      setIsSuccess(true);
      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg('A network error occurred. Please verify your connection.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section id="inquiry" className="py-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10 animate-pulse" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-xs sm:text-sm font-bold uppercase tracking-[0.3em] block mb-3"
          >
            Bespoke Service
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4"
          >
            Contact & <span className="text-gradient">Inquiries</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed"
          >
            Connect with our dedicated client services team. Whether asking about our professional salon collections, distribution pathways, or custom orders, we are here to assist.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative min-h-[500px]"
        >
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="inquiry-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass p-8 sm:p-12 rounded-[2.5rem] border border-glass-border space-y-6 shadow-glass relative backdrop-blur-2xl"
              >
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-medium animate-shake text-center">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="relative group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 transition-colors group-focus-within:text-primary">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                        <User size={18} />
                      </span>
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary focus:bg-white/[0.05] outline-none transition-all duration-300 font-medium tracking-wide placeholder-gray-600 focus:shadow-[0_0_15px_rgba(197,160,89,0.1)]"
                        placeholder="e.g. Lady Isabella"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="relative group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 transition-colors group-focus-within:text-primary">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                        <Mail size={18} />
                      </span>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary focus:bg-white/[0.05] outline-none transition-all duration-300 font-medium tracking-wide placeholder-gray-600 focus:shadow-[0_0_15px_rgba(197,160,89,0.1)]"
                        placeholder="e.g. isabella@luxury.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Input */}
                  <div className="relative group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 transition-colors group-focus-within:text-primary">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                        <Phone size={18} />
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary focus:bg-white/[0.05] outline-none transition-all duration-300 font-medium tracking-wide placeholder-gray-600 focus:shadow-[0_0_15px_rgba(197,160,89,0.1)]"
                        placeholder="e.g. +91 99999 88888"
                      />
                    </div>
                  </div>

                  {/* Inquiry Type Select */}
                  <div className="relative group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 transition-colors group-focus-within:text-primary">
                      Nature of Inquiry
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors pointer-events-none">
                        <Tag size={18} />
                      </span>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-sm focus:border-primary focus:bg-white/[0.05] outline-none transition-all duration-300 font-medium tracking-wide appearance-none cursor-pointer focus:shadow-[0_0_15px_rgba(197,160,89,0.1)]"
                      >
                        <option value="Noir Repair Ritual" className="bg-secondary text-white">Noir Repair Ritual</option>
                        <option value="Salon Partnership" className="bg-secondary text-white">Salon Partnership</option>
                        <option value="Bespoke Order" className="bg-secondary text-white">Bespoke Order</option>
                        <option value="General Inquiry" className="bg-secondary text-white">General Inquiry</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-t-gray-500 border-l-transparent border-r-transparent pointer-events-none group-focus-within:border-t-primary transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="relative group">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 transition-colors group-focus-within:text-primary">
                    Message
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-5 text-gray-500 group-focus-within:text-primary transition-colors">
                      <MessageSquare size={18} />
                    </span>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary focus:bg-white/[0.05] outline-none transition-all duration-300 font-medium tracking-wide placeholder-gray-600 min-h-[140px] focus:shadow-[0_0_15px_rgba(197,160,89,0.1)]"
                      placeholder="Share the details of your request..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex justify-center">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="btn-primary flex items-center justify-center gap-3 px-12 py-4 text-sm uppercase tracking-widest font-bold w-full sm:w-auto relative overflow-hidden group/btn disabled:opacity-50 cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isPending ? 'Submitting...' : 'Send Message'}
                      {!isPending && <Send size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform" />}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-[#8e6f3e] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -z-0" />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass p-12 rounded-[2.5rem] border border-glass-border text-center shadow-glass flex flex-col items-center justify-center py-20 backdrop-blur-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-24 h-24 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary mb-8"
                >
                  <CheckCircle2 size={48} />
                </motion.div>
                <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide mb-4">Inquiry Received</h3>
                <p className="text-gray-400 max-w-md leading-relaxed text-sm sm:text-base mb-8">
                  Thank you for connecting with ELENOR. Our luxury client services department will review your request and contact you shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="btn-secondary px-8 py-3 text-xs sm:text-sm uppercase tracking-widest font-bold cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
