'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/useAdminStore';
import Link from 'next/link';
import { 
  Trash2, RefreshCw, LogOut, Search, UserPlus, Eye, 
  Trash, Shield, Mail, Phone, Calendar, Tag, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types to match original frontend
interface ContactEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  brand: string; // Tag / Label
  message: string;
  createdAt: string;
}

interface AdminUser {
  id: string;
  username: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { token, admin, clearSession } = useAdminStore();

  // State
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [inquiryActionPending, setInquiryActionPending] = useState(false);

  // Modal State
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    kind: 'contact' | 'all-contacts' | 'admin' | null;
    target: any | null;
  }>({
    open: false,
    kind: null,
    target: null,
  });

  // Admin Form State
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');
  const [adminPending, setAdminPending] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      router.replace('/admin/login');
    }
  }, [token, router]);

  // Fetch Data (Contacts + Admins)
  const fetchData = useCallback(async () => {
    if (!token) return;
    setStatus('loading');
    setGlobalError('');

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [contactsRes, adminsRes] = await Promise.all([
        fetch('/api/admin/contacts', { headers }),
        fetch('/api/admin/auth/admins', { headers }),
      ]);

      if (contactsRes.status === 401 || adminsRes.status === 401) {
        clearSession();
        router.replace('/admin/login');
        return;
      }

      if (!contactsRes.ok || !adminsRes.ok) {
        throw new Error('Failed to retrieve inquiries or administrative data.');
      }

      const contactsData = await contactsRes.json();
      const adminsData = await adminsRes.json();

      setContacts(Array.isArray(contactsData) ? contactsData : []);
      setAdmins(Array.isArray(adminsData) ? adminsData : []);
      setStatus('idle');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setGlobalError(err.message || 'Could not load dashboard data.');
    }
  }, [token, clearSession, router]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  // Logout Handler
  const handleSignOut = () => {
    clearSession();
    router.replace('/admin/login');
  };

  // Date Formatter
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Search Filter
  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return contacts;

    return contacts.filter((c) =>
      [c.name, c.email, c.phone, c.brand, c.message]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(query))
    );
  }, [contacts, searchQuery]);

  // Create Admin Handler
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (newUsername.trim().length < 3) {
      setAdminError('Username must be at least 3 characters.');
      return;
    }
    if (newPassword.length < 6) {
      setAdminError('Password must be at least 6 characters.');
      return;
    }

    setAdminPending(true);
    try {
      const res = await fetch('/api/admin/auth/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newUsername.trim(),
          password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === 'username_taken') {
          setAdminError('That username is already taken.');
        } else {
          setAdminError(data.message || 'Could not create administrator account.');
        }
        return;
      }

      setAdminSuccess(`Administrator "${newUsername.trim()}" created successfully.`);
      setNewUsername('');
      setNewPassword('');
      fetchData(); // Reload list
    } catch (err: any) {
      setAdminError('Failed to create account. Please check network and try again.');
    } finally {
      setAdminPending(false);
    }
  };

  // Confirmation Modal Actions
  const triggerDeleteContact = (item: ContactEntry) => {
    setConfirmModal({ open: true, kind: 'contact', target: item });
  };

  const triggerClearAllContacts = () => {
    setConfirmModal({ open: true, kind: 'all-contacts', target: null });
  };

  const triggerDeleteAdmin = (adm: AdminUser) => {
    setConfirmModal({ open: true, kind: 'admin', target: adm });
  };

  const closeModal = () => {
    setConfirmModal({ open: false, kind: null, target: null });
  };

  const executeDeleteAction = async () => {
    if (!confirmModal.kind) return;
    setInquiryActionPending(true);
    setGlobalError('');

    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (confirmModal.kind === 'contact') {
        const id = confirmModal.target.id;
        const res = await fetch(`/api/admin/contacts/${id}`, {
          method: 'DELETE',
          headers,
        });
        if (!res.ok) throw new Error('Failed to delete inquiry.');
        setContacts((prev) => prev.filter((c) => c.id !== id));
      } 
      else if (confirmModal.kind === 'all-contacts') {
        const res = await fetch('/api/admin/contacts', {
          method: 'DELETE',
          headers,
        });
        if (!res.ok) throw new Error('Failed to clear inbox.');
        setContacts([]);
      } 
      else if (confirmModal.kind === 'admin') {
        const id = confirmModal.target.id;
        const res = await fetch(`/api/admin/auth/admins/${id}`, {
          method: 'DELETE',
          headers,
        });

        if (!res.ok) {
          const data = await res.json();
          if (data.message === 'cannot_delete_self') {
            throw new Error('cannot_delete_self');
          } else if (data.message === 'cannot_delete_last_admin') {
            throw new Error('cannot_delete_last_admin');
          } else {
            throw new Error(data.message || 'Failed to delete administrative user.');
          }
        }

        setAdmins((prev) => prev.filter((a) => a.id !== id));
      }

      closeModal();
    } catch (err: any) {
      console.error(err);
      if (err.message === 'cannot_delete_self') {
        setGlobalError('You cannot delete your own administrator account.');
      } else if (err.message === 'cannot_delete_last_admin') {
        setGlobalError('At least one administrator must remain.');
      } else {
        setGlobalError(err.message || 'Operation failed. Please try again.');
      }
    } finally {
      setInquiryActionPending(false);
    }
  };

  // Safeguard Check
  const isOnlyOneAdmin = admins.length <= 1;

  if (!token) return null;

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-50/50 via-background to-orange-50/20 px-4 sm:px-6 md:px-10 py-10 md:py-14 relative overflow-x-hidden">
      {/* Decorative luxury mesh gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,_rgba(197,160,89,0.06)_0%,_rgba(255,255,255,0)_70%)] pointer-events-none blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-[radial-gradient(circle,_rgba(197,160,89,0.04)_0%,_rgba(255,255,255,0)_70%)] pointer-events-none blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-foreground/5 pb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Elenor · Admin
            </p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-light text-foreground tracking-tight">
              Inbox.
            </h1>
            <div className="h-[2px] w-12 bg-primary/40 mt-4 rounded-full" />
            <p className="mt-4 text-xs sm:text-sm text-foreground/60 leading-relaxed font-light">
              Signed in as <span className="text-foreground font-semibold">{admin?.username || 'administrator'}</span>
              {admins.length > 0 && ` · ${admins.length} administrator${admins.length === 1 ? '' : 's'}`}
              {` · ${contacts.length} inquiry entry${contacts.length === 1 ? '' : 'ies'}`}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link 
              href="/" 
              className="px-6 py-2.5 rounded-full border border-foreground/10 text-xs font-bold uppercase tracking-wider hover:bg-white/60 hover:border-primary/40 transition-all duration-300 bg-white/30 backdrop-blur-sm"
            >
              View site
            </Link>
            <button
              onClick={handleSignOut}
              className="px-6 py-2.5 rounded-full bg-foreground text-white hover:bg-foreground/90 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-md shadow-foreground/5"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        </header>

        {/* Filters Panel */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-end">
          <div className="md:col-span-8 lg:col-span-9 space-y-2">
            <label 
              htmlFor="search" 
              className="block text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50"
            >
              Search entries
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground/40">
                <Search size={16} />
              </div>
              <input
                id="search"
                type="search"
                placeholder="Search name, email, phone, tag, or message content…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/60 border border-foreground/10 focus:border-primary/60 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all duration-300 backdrop-blur-sm shadow-sm"
              />
            </div>
          </div>
          
          <div className="md:col-span-4 lg:col-span-3 flex flex-wrap md:justify-end gap-3 shrink-0">
            <button
              onClick={fetchData}
              className="px-5 py-3 rounded-xl border border-foreground/10 hover:border-primary/40 bg-white/40 hover:bg-white/70 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-sm"
              title="Refresh inbox"
            >
              <RefreshCw size={13} className={status === 'loading' ? 'animate-spin text-primary' : ''} />
              Refresh
            </button>
            <button
              onClick={triggerClearAllContacts}
              disabled={contacts.length === 0}
              className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-sm ${
                contacts.length === 0 
                  ? 'bg-foreground/5 border border-foreground/5 text-foreground/30 cursor-not-allowed'
                  : 'border border-rose-100 hover:border-rose-300 bg-rose-50/30 hover:bg-rose-50 text-rose-600'
              }`}
              title="Bulk clear inbox"
            >
              <Trash2 size={13} />
              Delete all
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600 shadow-sm flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <p className="font-medium">{globalError}</p>
          </div>
        )}

        {/* Main Inbox Section */}
        <section className="mt-8" aria-label="Contact entries">
          
          {/* 1. Loading Skeleton */}
          {status === 'loading' && (
            <div className="glass border border-glass-border/20 rounded-2xl p-8 space-y-6 bg-white/60 shadow-sm">
              <div className="h-4 w-28 bg-foreground/10 rounded animate-pulse" />
              <div className="space-y-4">
                <div className="h-10 w-full bg-foreground/5 rounded animate-pulse" />
                <div className="h-14 w-full bg-foreground/5 rounded animate-pulse" />
                <div className="h-14 w-full bg-foreground/5 rounded animate-pulse" />
              </div>
            </div>
          )}

          {/* 2. Error State */}
          {status === 'error' && (
            <div className="glass border border-glass-border/30 rounded-2xl p-10 text-center bg-white/50 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Error</p>
              <h3 className="mt-3 font-serif text-2xl text-foreground font-light">Could not load entries.</h3>
              <p className="mt-2 text-sm text-foreground/60">An issue occurred while communicating with the database.</p>
              <button
                onClick={fetchData}
                className="btn-primary mt-6 text-xs font-bold uppercase tracking-wider py-3 px-6"
              >
                Try again
              </button>
            </div>
          )}

          {/* 3. Idle / Loaded State */}
          {status === 'idle' && (
            <>
              {filteredContacts.length === 0 ? (
                /* Empty state */
                <div className="glass border border-glass-border/20 rounded-2xl p-12 text-center bg-white/60 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">No entries yet</p>
                  <h3 className="mt-3 font-serif text-2xl text-foreground font-light">A quiet shelf.</h3>
                  <div className="h-px w-10 bg-foreground/10 mx-auto mt-4" />
                  <p className="mt-4 text-sm text-foreground/50 font-light max-w-sm mx-auto leading-relaxed">
                    When a visitor submits a contact form or requests a stock notification, it will safely appear here.
                  </p>
                </div>
              ) : (
                /* Grid / Table View */
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block glass border border-glass-border/20 rounded-2xl overflow-hidden bg-white/70 shadow-sm">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="text-left bg-amber-50/30 border-b border-foreground/5">
                          <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/55">Name</th>
                          <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/55">Email</th>
                          <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/55">Phone</th>
                          <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/55">Tag</th>
                          <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/55">Message</th>
                          <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/55">Date</th>
                          <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/55 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-foreground/5">
                        <AnimatePresence>
                          {filteredContacts.map((c) => (
                            <motion.tr 
                              key={c.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="hover:bg-amber-50/10 transition-colors"
                            >
                              {/* Name */}
                              <td className="px-6 py-5 align-top font-serif text-base text-foreground font-light whitespace-nowrap">
                                {c.name}
                              </td>
                              {/* Email */}
                              <td className="px-6 py-5 align-top text-foreground/80">
                                <a 
                                  href={`mailto:${c.email}`} 
                                  className="hover:text-primary transition-colors hover:underline flex items-center gap-1.5"
                                >
                                  <Mail size={12} className="text-primary/70 shrink-0" />
                                  {c.email}
                                </a>
                              </td>
                              {/* Phone */}
                              <td className="px-6 py-5 align-top text-foreground/85 whitespace-nowrap font-light">
                                {c.phone ? (
                                  <a 
                                    href={`tel:${c.phone}`} 
                                    className="hover:text-primary transition-colors hover:underline flex items-center gap-1.5"
                                  >
                                    <Phone size={12} className="text-primary/70 shrink-0" />
                                    {c.phone}
                                  </a>
                                ) : (
                                  <span className="text-foreground/30 font-serif">—</span>
                                )}
                              </td>
                              {/* Tag (Brand) */}
                              <td className="px-6 py-5 align-top whitespace-nowrap">
                                {c.brand ? (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-amber-50/50 px-3 py-1 text-[9px] font-bold tracking-[0.12em] uppercase text-primary">
                                    <Tag size={8} />
                                    {c.brand}
                                  </span>
                                ) : (
                                  <span className="text-foreground/30 font-serif">—</span>
                                )}
                              </td>
                              {/* Message */}
                              <td className="px-6 py-5 align-top text-foreground/75 max-w-[360px]">
                                <p className="line-clamp-3 leading-relaxed whitespace-pre-wrap font-light">
                                  {c.message}
                                </p>
                              </td>
                              {/* Date */}
                              <td className="px-6 py-5 align-top text-foreground/50 whitespace-nowrap text-xs font-light">
                                {formatDateTime(c.createdAt)}
                              </td>
                              {/* Actions */}
                              <td className="px-6 py-5 align-top text-right whitespace-nowrap">
                                <button
                                  onClick={() => triggerDeleteContact(c)}
                                  className="text-[10px] font-bold tracking-[0.18em] uppercase text-rose-500 hover:text-rose-700 transition-colors border-b border-transparent hover:border-rose-700 pb-0.5"
                                >
                                  Delete
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {filteredContacts.map((c) => (
                        <motion.article 
                          key={c.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="glass border border-glass-border/20 rounded-2xl p-5 bg-white/70 shadow-sm relative space-y-4"
                        >
                          <div className="flex items-start justify-between gap-3 border-b border-foreground/5 pb-3">
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/45 flex items-center gap-1">
                                <Calendar size={10} />
                                {formatDateTime(c.createdAt)}
                              </p>
                              <h3 className="mt-1 font-serif text-lg text-foreground font-light leading-tight">
                                {c.name}
                              </h3>
                            </div>
                            <button
                              onClick={() => triggerDeleteContact(c)}
                              className="text-[9px] font-bold tracking-[0.18em] uppercase text-rose-500 hover:text-rose-700 shrink-0 transition-colors"
                            >
                              Delete
                            </button>
                          </div>

                          {c.brand && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-amber-50/50 px-2.5 py-0.5 text-[8px] font-bold tracking-[0.12em] uppercase text-primary">
                              <Tag size={8} />
                              {c.brand}
                            </span>
                          )}

                          <dl className="space-y-3 text-xs">
                            <div className="grid grid-cols-3 gap-1">
                              <dt className="text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/40">Email</dt>
                              <dd className="col-span-2 text-foreground/80 truncate">
                                <a href={`mailto:${c.email}`} className="text-primary hover:underline">{c.email}</a>
                              </dd>
                            </div>
                            {c.phone && (
                              <div className="grid grid-cols-3 gap-1">
                                <dt className="text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/40">Phone</dt>
                                <dd className="col-span-2 text-foreground/80 font-light">
                                  <a href={`tel:${c.phone}`} className="text-foreground/70 hover:text-primary transition-colors">{c.phone}</a>
                                </dd>
                              </div>
                            )}
                            <div className="space-y-1">
                              <dt className="text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/40">Message</dt>
                              <dd className="text-foreground/75 leading-relaxed font-light whitespace-pre-wrap bg-foreground/[0.02] border border-foreground/[0.04] p-3 rounded-lg">
                                {c.message}
                              </dd>
                            </div>
                          </dl>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </>
          )}
        </section>

        {/* Administrators Management Section */}
        <section className="mt-12">
          <div className="glass border border-glass-border/20 rounded-2xl p-6 md:p-8 bg-white/60 shadow-sm space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-foreground/5 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary flex items-center gap-1">
                  <Shield size={12} />
                  Access
                </p>
                <h2 className="mt-2 font-serif text-2xl font-light text-foreground tracking-tight">
                  Administrators
                </h2>
                <p className="mt-1.5 text-xs text-foreground/50 font-light leading-relaxed">
                  Manage administrator accounts who have authorization to view user inquiries.
                </p>
              </div>
              
              <button
                onClick={() => setShowAdminForm(!showAdminForm)}
                className="px-4 py-2 rounded-full border border-foreground/10 hover:border-primary/40 bg-white/40 hover:bg-white/70 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300"
              >
                <UserPlus size={12} />
                {showAdminForm ? 'Hide form' : 'New admin'}
              </button>
            </div>

            {/* Admin Add Form */}
            <AnimatePresence>
              {showAdminForm && (
                <motion.form
                  onSubmit={handleCreateAdmin}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50/20 border border-glass-border/10 p-5 rounded-2xl space-y-4 overflow-hidden"
                >
                  <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">Create Administrative User</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="new-adm-user" 
                        className="block text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/55"
                      >
                        Username
                      </label>
                      <input
                        id="new-adm-user"
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full bg-white/60 border border-foreground/10 focus:border-primary/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none transition-colors shadow-sm"
                        disabled={adminPending}
                        autoComplete="off"
                        placeholder="Username (min 3 chars)"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="new-adm-pass" 
                        className="block text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/55"
                      >
                        Password
                      </label>
                      <input
                        id="new-adm-pass"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white/60 border border-foreground/10 focus:border-primary/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none transition-colors shadow-sm"
                        disabled={adminPending}
                        autoComplete="new-password"
                        placeholder="Password (min 6 chars)"
                      />
                    </div>
                  </div>

                  {adminError && (
                    <p className="text-xs text-rose-500 font-medium bg-rose-50 border border-rose-100 rounded-lg p-2.5 text-center">
                      {adminError}
                    </p>
                  )}
                  {adminSuccess && (
                    <p className="text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-center">
                      {adminSuccess}
                    </p>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={adminPending}
                      className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider text-[10px] transition-all duration-300 shadow-md shadow-primary/5 active:scale-95"
                    >
                      {adminPending ? 'Creating…' : 'Create Admin'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Admins List */}
            <ul className="divide-y divide-foreground/5 border-t border-b border-foreground/5">
              {admins.length === 0 ? (
                <li className="py-4 text-sm text-foreground/45 italic font-light">
                  No administrators configured.
                </li>
              ) : (
                admins.map((adm) => {
                  const isSelf = adm.id === admin?.id;
                  const isBlocked = isSelf || isOnlyOneAdmin;
                  const blockReason = isSelf 
                    ? 'You cannot delete your own administrative session.' 
                    : isOnlyOneAdmin 
                    ? 'At least one administrative user must remain in the database.' 
                    : '';

                  return (
                    <li 
                      key={adm.id} 
                      className="py-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Profile Initial Badge */}
                        <div className="w-10 h-10 rounded-full border border-primary/20 bg-amber-50 flex items-center justify-center text-primary font-serif text-lg shrink-0">
                          {adm.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif text-lg text-foreground font-light truncate flex items-center gap-2">
                            {adm.username}
                            {isSelf && (
                              <span className="inline-flex items-center gap-0.5 rounded-full border border-primary/30 bg-amber-100/50 px-2 py-0.5 text-[8px] font-bold tracking-[0.2em] uppercase text-primary">
                                <ShieldCheck size={8} />
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-foreground/40 font-light flex items-center gap-1">
                            <Calendar size={10} />
                            Added {adm.createdAt ? new Date(adm.createdAt).toLocaleDateString() : '—'}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => !isBlocked && triggerDeleteAdmin(adm)}
                        disabled={isBlocked}
                        title={blockReason}
                        className={`text-[10px] font-bold tracking-[0.18em] uppercase shrink-0 pb-0.5 border-b border-transparent ${
                          isBlocked 
                            ? 'text-foreground/30 cursor-not-allowed'
                            : 'text-rose-500 hover:text-rose-700 transition-colors hover:border-rose-700'
                        }`}
                      >
                        Delete
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-foreground/5 text-[10px] font-light text-foreground/40 tracking-wider text-center">
          Elenor · Luxury Admin Dashboard · {new Date().getFullYear()}
        </footer>

      </div>

      {/* Confirmation Modal Component (B in decoded code) */}
      <AnimatePresence>
        {confirmModal.open && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              type="button"
              aria-label="Close confirmation"
              onClick={inquiryActionPending ? undefined : closeModal}
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              disabled={inquiryActionPending}
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              role="dialog"
              aria-modal="true"
              className="relative glass border border-glass-border/30 rounded-2xl p-7 md:p-8 w-full max-w-md bg-white shadow-premium"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                Confirm
              </p>
              
              <h3 className="mt-3 font-serif text-2xl font-light text-foreground tracking-tight">
                {confirmModal.kind === 'admin' 
                  ? 'Delete this administrator?' 
                  : confirmModal.kind === 'all-contacts' 
                  ? 'Delete every entry?' 
                  : 'Delete this entry?'}
              </h3>
              
              <div className="h-px bg-foreground/5 mt-4" />
              
              <p className="mt-5 text-sm text-foreground/65 leading-relaxed font-light">
                {confirmModal.kind === 'admin' && confirmModal.target && (
                  `This will permanently revoke all access permissions for administrative account "${confirmModal.target.username}". They will no longer be authorized to sign in. This action is final.`
                )}
                {confirmModal.kind === 'all-contacts' && (
                  `Are you absolutely sure you want to permanently clear all ${contacts.length} inquiry entries from the database? This covers both contact inquiries and stock alerts. This action is final.`
                )}
                {confirmModal.kind === 'contact' && confirmModal.target && (
                  `This will permanently delete the inquiry from ${confirmModal.target.name} (${confirmModal.target.email}) and clear it from the inbox. This action is final.`
                )}
              </p>
              
              <div className="mt-7 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-full border border-foreground/10 hover:bg-foreground/5 text-xs font-bold uppercase tracking-wider transition-colors duration-300"
                  onClick={closeModal}
                  disabled={inquiryActionPending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold uppercase tracking-wider text-xs transition-colors duration-300 flex items-center justify-center min-w-[90px]"
                  onClick={executeDeleteAction}
                  disabled={inquiryActionPending}
                >
                  {inquiryActionPending ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Working…
                    </span>
                  ) : confirmModal.kind === 'all-contacts' ? (
                    'Delete all'
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
