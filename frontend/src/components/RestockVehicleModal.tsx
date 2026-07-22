import React, { useState } from 'react';
import { Vehicle } from '../types';
import { X, PackagePlus, Loader2 } from 'lucide-react';

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

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-800 border border-slate-700/90 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/80 flex items-center justify-between bg-slate-800/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <PackagePlus className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Restock Vehicle Inventory</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-900/60 border border-slate-700/60 p-3.5 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">Vehicle</span>
              <strong className="text-slate-200 text-sm">{vehicle.make} {vehicle.model}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Current Stock</span>
              <span className="text-emerald-400 font-bold text-sm">{vehicle.quantity} units</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Additional Quantity to Add
            </label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 10"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-700/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-700/40 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
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
      </div>
    </div>
  );
};
