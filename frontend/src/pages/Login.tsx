import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, Mail, Lock, AlertCircle, Loader2, Car, Shield, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
      showToast('Signed in successfully!', 'success');
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Invalid email or password.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Sleek Car Preview & Feature Showcase (Desktop Split Screen) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 pr-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Luxury Fleet Intelligence
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              Manage Your Prestige Dealership <span className="gradient-title">Effortlessly.</span>
            </h1>

            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              AutoVault gives your team real-time control over vehicle inventory, executive telemetry, live stock alerts, and instant sales workflows.
            </p>
          </div>

          {/* Luxury Showcase Feature Points */}
          <div className="space-y-4 pt-2">
            {[
              { icon: Car, title: 'Real-Time Catalog Tracking', desc: 'Live synchronization across all showroom models and stock numbers.' },
              { icon: Shield, title: 'Role-Based Executive Controls', desc: 'Granular administrative permissions for restocking & fleet edits.' },
              { icon: CheckCircle2, title: 'Instant Sales & Telemetry', desc: 'One-click purchasing flow with live inventory countdowns.' },
            ].map((feat, idx) => (
              <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 transition-all">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <feat.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{feat.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2 pt-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AutoVault Enterprise Edition v2.4 Active
          </div>
        </motion.div>

        {/* Right Side: Floating 3D-styled Glass Panel Login Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="lg:col-span-6 w-full max-w-md mx-auto"
        >
          <div className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            {/* Glowing Backdrop Orbs inside Card */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/30 transition-colors" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Card Brand Header */}
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl shadow-lg shadow-indigo-500/30 mb-3 border border-white/20">
                <Car className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
              <p className="text-slate-400 text-xs mt-1">Access the AutoVault dealership terminal</p>
            </div>

            {/* Error Notification Banner */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-300 text-xs"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.5)] focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.5)] focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    Authenticating Terminal...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In to Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-slate-400 relative z-10">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold underline-offset-4 hover:underline">
                Create Staff/Admin Account
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
