import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Car, LogOut, User, ShieldCheck, Menu, X, Sparkles, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'warning');
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-950/70 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/20 group-hover:scale-105 transition-transform duration-300">
            <Car className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              Auto<span className="gradient-title">Vault</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping inline-block"></span>
            </span>
            <span className="block text-[9px] text-slate-400 -mt-1 font-bold uppercase tracking-widest">Luxury Inventory Terminal</span>
          </div>
        </Link>

        {/* Desktop Navigation & Polished User Avatar Badge */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              
              {/* User Profile Badge */}
              <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-1.5 shadow-inner">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-indigo-500/20 border border-white/20">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-100 leading-tight flex items-center gap-1.5">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">{user.email}</div>
                </div>

                {/* Role Badge: Dynamic Glowing ADMIN Tag */}
                {isAdmin ? (
                  <span className="ml-2 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full shadow-lg shadow-amber-500/20 animate-pulse">
                    <ShieldCheck className="w-3 h-3 text-amber-400" /> ADMIN
                  </span>
                ) : (
                  <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-slate-800 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full">
                    <UserCheck className="w-3 h-3 text-indigo-400" /> STAFF
                  </span>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-rose-500/20 hover:border-rose-500/50 border border-white/10 px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 border border-white/10 transition-all active:scale-95"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900/80 border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 border-b border-white/10 p-4 space-y-4 overflow-hidden backdrop-blur-2xl"
          >
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-900/80 border border-white/10 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100">{user.name}</div>
                      <div className="text-[10px] text-slate-400">{user.email}</div>
                    </div>
                  </div>
                  {isAdmin ? (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      ADMIN
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                      STAFF
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-slate-900 text-slate-200 font-bold text-xs rounded-xl border border-white/10"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
