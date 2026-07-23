import React from 'react';
import { Vehicle } from '../types';
import { Car, DollarSign, AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { StockModalType } from './StockDetailsModal';

interface DashboardStatsProps {
  vehicles: Vehicle[];
  onOpenStockModal: (type: 'low_stock' | 'out_of_stock') => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  vehicles,
  onOpenStockModal,
}) => {
  // Executive Metrics Calculations
  const totalFleetUnits = vehicles.reduce((sum, v) => sum + (v.quantity || 0), 0);
  const totalFleetValue = vehicles.reduce((sum, v) => sum + v.price * (v.quantity || 0), 0);
  const lowStockCount = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3).length;
  const outOfStockCount = vehicles.filter((v) => v.quantity === 0).length;

  const formattedFleetValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalFleetValue);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
      {/* Metric 1: Total Fleet Vehicles */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Fleet Vehicles</span>
            <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-2">
              {totalFleetUnits} <span className="text-xs text-slate-400 font-semibold">Units ({vehicles.length} Models)</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Car className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 text-[11px] text-indigo-400 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span> Active catalog synced
        </div>
      </motion.div>

      {/* Metric 2: Total Fleet Value */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Fleet Valuation</span>
            <div className="text-2xl font-black price-gradient mt-1 tracking-tight">
              {formattedFleetValue}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Gross showroom capital
        </div>
      </motion.div>

      {/* Metric 3: Low Stock Alerts (Interactive & Clickable Card) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        onClick={() => onOpenStockModal('low_stock')}
        className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden cursor-pointer hover:scale-[1.02] hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Low Stock Alerts (≤ 3)</span>
            <div className="text-2xl font-black text-amber-300 mt-1 flex items-baseline gap-2">
              {lowStockCount} <span className="text-xs text-slate-400 font-semibold">Models</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
            {lowStockCount > 0 ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span> Restock attention required
              </>
            ) : (
              <span className="text-slate-500">All models well stocked</span>
            )}
          </div>
          
          <div className="text-[10px] font-bold text-amber-300 group-hover:text-white flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-all bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
            <span>Inspect models</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </motion.div>

      {/* Metric 4: Out of Stock (Interactive & Clickable Card) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        onClick={() => onOpenStockModal('out_of_stock')}
        className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden cursor-pointer hover:scale-[1.02] hover:border-rose-500/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.25)] transition-all group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Out of Stock</span>
            <div className="text-2xl font-black text-rose-400 mt-1 flex items-baseline gap-2">
              {outOfStockCount} <span className="text-xs text-slate-400 font-semibold">Models</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/10 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
            {outOfStockCount > 0 ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span> Sold out models
              </>
            ) : (
              <span className="text-slate-500">Zero models out of stock</span>
            )}
          </div>

          <div className="text-[10px] font-bold text-rose-300 group-hover:text-white flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-all bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg">
            <span>Inspect models</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </motion.div>

    </div>
  );
};
