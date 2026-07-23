import React, { useState } from 'react';
import { Vehicle } from '../types';
import { X, PackagePlus, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RestockVehicleModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, quantity: number) => Promise<void>;
}

export const RestockVehicleModal: React.FC<RestockVehicleModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [amount, setAmount] = useState('5');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    setError(null);

    const qty = parseInt(amount, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a positive number of units to add.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm(vehicle.id, qty);
      setAmount('5');
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to restock vehicle.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && vehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Framer Motion Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Framer Motion Scale-Up Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-panel rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative z-10 border border-white/10"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-tight">Restock Vehicle Units</h3>
                  <p className="text-[11px] text-slate-400">Increase available showroom stock</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Vehicle Current Telemetry Box */}
              <div className="bg-slate-950/60 border border-white/10 p-4 rounded-2xl flex items-center justify-between text-xs shadow-inner">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Target Model</span>
                  <strong className="text-white text-sm font-black">{vehicle.make} {vehicle.model}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Current Fleet Stock</span>
                  <span className="text-emerald-400 font-black text-sm">{vehicle.quantity} units</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Additional Units to Restock
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-sm font-bold text-slate-100 glow-input outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 border border-white/20 flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Restocking...
                    </>
                  ) : (
                    <>
                      <PackagePlus className="w-4 h-4" />
                      Confirm Restock
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
