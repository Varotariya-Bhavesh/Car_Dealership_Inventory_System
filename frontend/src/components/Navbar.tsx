import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Car, LogOut, User, ShieldCheck, Menu, X } from 'lucide-react';

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
    <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-100 tracking-tight">Auto<span className="text-blue-500">Vault</span></span>
            <span className="block text-[10px] text-slate-400 -mt-1 font-semibold uppercase tracking-wider">Inventory System</span>
          </div>
        </Link>

        {/* Desktop User Navigation / Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              {/* User Profile Badge */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 border border-slate-700/60 rounded-xl px-3.5 py-1.5">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{user.email}</div>
                </div>

                {/* Role Badge */}
                {isAdmin ? (
                  <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  <span className="ml-1.5 inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-slate-700/60 text-slate-300 border border-slate-600 px-2 py-0.5 rounded-md">
                    Staff
                  </span>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-700/50 hover:bg-rose-600/20 hover:border-rose-500/40 border border-slate-600 px-3 py-2 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl shadow-md shadow-blue-600/20 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-700/40 border border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-b border-slate-700 p-4 space-y-4 animate-fade-in">
          {isAuthenticated && user ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-900/80 border border-slate-700/60 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-100">{user.name}</div>
                  <div className="text-xs text-slate-400">{user.email}</div>
                </div>
                {isAdmin ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md">
                    Admin
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-700/60 text-slate-300 border border-slate-600 px-2 py-0.5 rounded-md">
                    Staff
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs rounded-xl transition-colors"
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
                className="text-center py-2.5 bg-slate-700/60 text-slate-200 font-semibold text-xs rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
