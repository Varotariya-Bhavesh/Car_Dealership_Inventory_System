import React, { useState } from 'react';
import { Vehicle } from '../types';
import { ShoppingBag, Loader2, Car, Layers, Edit3, PackagePlus, Trash2, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (vehicleId: string) => Promise<void>;
  isAdmin?: boolean;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
  onRestock?: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onPurchase,
  isAdmin,
  onEdit,
  onDelete,
  onRestock,
}) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [imageError, setImageError] = useState(false);

  const triggerCelebrationConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#34d399', '#22d3ee', '#6366f1', '#a855f7', '#fbbf24'],
        disableForReducedMotion: true,
      });
    } catch (e) {
      console.log('Confetti failed to trigger:', e);
    }
  };

  const handlePurchase = async () => {
    if (vehicle.quantity <= 0 || isPurchasing) return;
    try {
      setIsPurchasing(true);
      await onPurchase(vehicle.id);
      triggerCelebrationConfetti();
    } finally {
      setIsPurchasing(false);
    }
  };

  const isOutOfStock = vehicle.quantity === 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 3;

  // Formatted price string (e.g. $28,500)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel-interactive rounded-3xl flex flex-col justify-between group overflow-hidden relative"
    >
      {/* Dynamic Glow Border on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Top Image Frame with Smooth Hover Zoom */}
      <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
        {vehicle.image_url && !imageError ? (
          <img
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 text-slate-600">
            <Car className="w-12 h-12 text-slate-700 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">AutoVault Showroom</span>
          </div>
        )}

        {/* Ambient Gradient Overlay on Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Floating Category Pill Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-slate-300 border border-white/10 shadow-lg">
            {vehicle.category}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 backdrop-blur-md text-rose-300 border border-rose-500/40 shadow-lg flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" /> Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/20 animate-pulse flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" /> Only {vehicle.quantity} Left
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {vehicle.quantity} In Stock
            </span>
          )}
        </div>

        {/* Admin Hover Quick Actions Overlay */}
        {isAdmin && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-slate-950/90 backdrop-blur-md border-t border-white/10 flex items-center justify-around translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-20">
            {onEdit && (
              <button
                onClick={() => onEdit(vehicle)}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Specs
              </button>
            )}
            {onRestock && (
              <button
                onClick={() => onRestock(vehicle)}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition-all"
              >
                <PackagePlus className="w-3.5 h-3.5" /> Restock
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(vehicle)}
                className="flex items-center gap-1 text-[11px] font-bold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-xl transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Vehicle Info Header */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400 block mb-0.5">
              {vehicle.make}
            </span>
            <h3 className="text-xl font-black text-white leading-snug group-hover:text-indigo-200 transition-colors">
              {vehicle.model}
            </h3>
          </div>
        </div>

        {/* Specs Pill Summary */}
        <div className="flex items-center gap-3 text-xs text-slate-400 my-3.5 py-2 px-3 bg-slate-950/50 rounded-xl border border-white/5">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px]">Class: <strong className="text-slate-200 font-semibold">{vehicle.category}</strong></span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="text-[11px]">
            Stock ID: <span className="font-mono text-slate-400">#{vehicle.id.substring(0, 6)}</span>
          </div>
        </div>
      </div>

      {/* Price & Purchase Action */}
      <div className="p-5 pt-3 border-t border-white/10 mt-2 space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Showroom Price</span>
          <span className="text-2xl font-black price-gradient tracking-tight">{formattedPrice}</span>
        </div>

        {/* Purchase CTA Button */}
        <button
          onClick={handlePurchase}
          disabled={isOutOfStock || isPurchasing}
          className={`w-full py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
            isOutOfStock
              ? 'bg-slate-900/80 text-slate-600 border border-white/5 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white shadow-indigo-600/30 hover:shadow-indigo-500/50 border border-white/20 active:scale-[0.98]'
          }`}
        >
          {isPurchasing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              Processing Sale...
            </>
          ) : isOutOfStock ? (
            <>
              <ShoppingBag className="w-4 h-4 text-slate-600" />
              Vehicle Sold Out
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Purchase Vehicle
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
