import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-[#080d1a] text-slate-100 font-sans flex flex-col antialiased relative overflow-hidden selection:bg-indigo-500 selection:text-white">
            {/* Dynamic Ambient Glowing Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              {/* Primary Indigo/Violet Blur Orb */}
              <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-indigo-600/15 blur-[130px] animate-ambient-1" />
              {/* Secondary Blue Blur Orb */}
              <div className="absolute top-[40%] -right-[15%] w-[60vw] h-[60vw] rounded-full bg-blue-600/15 blur-[140px] animate-ambient-2" />
              {/* Bottom Purple Accent Orb */}
              <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[150px] animate-ambient-1" />
              {/* Subtle Ambient Mesh Grid Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]" />
            </div>

            <Navbar />
            <main className="flex-1 relative z-10">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Dashboard />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
