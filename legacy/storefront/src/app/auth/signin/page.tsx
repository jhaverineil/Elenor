'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Search, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setLoading(true);

    console.log(`🔐 [SignIn] Initiating credentials sign-in for: "${formData.email}"...`);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      console.log('🔄 [SignIn] NextAuth sign-in response received:', result);

      if (result?.error) {
        console.warn(`❌ [SignIn] Sign-in failed: ${result.error}`);
        // If it's the generic credentials error, show standard message, else show the descriptive error
        if (result.error === 'CredentialsSignin') {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else {
          setError(result.error);
        }
      } else {
        console.log(`✅ [SignIn] Sign-in succeeded! Redirecting to home page...`);
        router.push('/');
      }
    } catch (err: any) {
      console.error(`💥 [SignIn] Unexpected exception in sign-in handler:`, err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
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
            <h1 className="text-3xl font-bold mb-2 uppercase tracking-tight">Welcome Back to <span className="text-gradient">ELENOR</span></h1>
            <p className="text-gray-500">Sign in to your luxury account</p>
          </div>

          <div className="space-y-4 mb-8">
            <button 
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full glass p-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-xs"
            >
              <Search size={20} className="text-primary" /> Continue with Google
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-4 text-gray-500">Or email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm text-center">
                {error}
              </div>
            )}

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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 group uppercase tracking-widest font-bold"
            >
              {loading ? "Signing In..." : "Sign In"} 
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm mb-4">Don't have an account?</p>
            <Link href="/auth/register" className="text-primary font-bold hover:underline">
              Register Now
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
            <ShieldCheck size={12} /> 256-bit Secure Authentication
          </div>
        </motion.div>
      </div>
    </main>
  );
}
