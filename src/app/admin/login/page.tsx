'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/useAdminStore';
import Link from 'next/link';
import { ArrowLeft, Lock, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setSession, token } = useAdminStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect to admin dashboard
  useEffect(() => {
    if (token) {
      router.replace('/admin');
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === 'invalid_credentials') {
          setError('Invalid username or password.');
        } else {
          setError(data.message || 'Login failed. Please try again.');
        }
        return;
      }

      // Save to store
      setSession(data.token, data.admin);
      router.push('/admin');
    } catch (err: any) {
      console.error(err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 py-16 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-50 via-background to-orange-50/30 overflow-hidden">
      {/* Decorative luxury mesh gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,_rgba(197,160,89,0.08)_0%,_rgba(255,255,255,0)_70%)] pointer-events-none blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,_rgba(197,160,89,0.06)_0%,_rgba(255,255,255,0)_70%)] pointer-events-none blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-foreground/60 hover:text-primary transition-colors duration-300 group"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to site
        </Link>

        {/* Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="glass border border-glass-border/30 shadow-premium rounded-2xl p-8 md:p-10 mt-6 bg-white/70"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Elenor · Admin
          </p>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-light text-foreground tracking-tight">
            Sign in.
          </h1>
          <div className="h-[2px] w-10 bg-primary/40 mt-4 rounded-full" />
          <p className="mt-5 text-sm text-foreground/70 leading-relaxed font-light">
            Enter your administrator credentials to manage incoming inquiries.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label 
                htmlFor="adm-user" 
                className="block text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/35">
                  <User size={16} />
                </div>
                <input
                  id="adm-user"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/50 border border-foreground/10 focus:border-primary/60 rounded-xl pl-10 pr-4 py-3.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all duration-300 backdrop-blur-sm shadow-inner"
                  disabled={loading}
                  placeholder="e.g. admin"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label 
                htmlFor="adm-pass" 
                className="block text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/35">
                  <Lock size={16} />
                </div>
                <input
                  id="adm-pass"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/50 border border-foreground/10 focus:border-primary/60 rounded-xl pl-10 pr-10 py-3.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all duration-300 backdrop-blur-sm shadow-inner"
                  disabled={loading}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/35 hover:text-foreground/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-500 font-medium bg-rose-50 border border-rose-100 rounded-lg p-3 text-center"
                role="alert"
              >
                {error}
              </motion.p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-primary py-3.5 flex items-center justify-center font-bold uppercase tracking-wider text-xs shadow-md shadow-primary/10 hover:shadow-primary/20"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </motion.div>

        {/* Setup Hint */}
        <p className="mt-8 text-center text-[10px] text-foreground/40 font-light tracking-wide leading-relaxed">
          Need seed accounts or reset configuration? Run the update schema queries.<br />
          Default login: <span className="font-mono text-foreground/60">admin</span> / <span className="font-mono text-foreground/60">elenor-admin</span>
        </p>
      </div>
    </main>
  );
}
