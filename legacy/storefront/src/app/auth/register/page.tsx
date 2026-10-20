'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { registerUser } from '@/services/authService';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      console.warn("⚠️ [Register] Password and Confirm Password fields do not match.");
      return;
    }

    setLoading(true);
    console.log(`📝 [Register] Initiating registration request for: "${formData.email}" (Name: "${formData.fullName}")...`);

    try {
      const result = await registerUser(formData.email, formData.password, formData.fullName);

      if (!result.success) {
        console.error(`❌ [Register] Registration failed: ${result.error}`);
        throw new Error(result.error);
      }

      console.log(`✅ [Register] Registration succeeded! Result:`, result);
      alert(result.message ?? 'Registration successful! Please check your email for verification.');
      router.push('/auth/signin');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-10 rounded-[3rem] w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2 uppercase tracking-tight">Join <span className="text-gradient">ELENOR</span></h1>
            <p className="text-gray-500">Create an account for luxury benefits</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 focus:border-primary outline-none transition-colors"
                  placeholder="Alex Johnson"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 focus:border-primary outline-none transition-colors"
                  placeholder="alex@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 focus:border-primary outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  required
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 focus:border-primary outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 group uppercase tracking-widest font-bold"
            >
              {loading ? "Creating Account..." : "Register Now"} 
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm mb-4">Already have an account?</p>
            <Link href="/auth/signin" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
            <ShieldCheck size={12} /> Secure & Encrypted Registration
          </div>
        </motion.div>
      </div>
    </main>
  );
}
