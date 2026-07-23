import React from 'react';
import { Vehicle } from '../types';
import { X, AlertTriangle, AlertCircle, PackagePlus, Car, ArrowRight, CheckCircle2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type StockModalType = 'low_stock' | 'out_of_stock' | null;

interface StockDetailsModalProps {
  type: StockModalType;
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  isAdmin?: boolean;
  onRestockVehicle?: (vehicle: Vehicle) => void;
  onFilterCatalog?: (type: 'low_stock' | 'out_of_stock') => void;
}

export const StockDetailsModal: React.FC<StockDetailsModalProps> = ({
  type,
  isOpen,
  onClose,
  vehicles,
  isAdmin,
  onRestockVehicle,
  onFilterCatalog,
}) => {
  if (!type || !isOpen) return null;

  const isLowStockType = type === 'low_stock';
  const filteredVehicles = isLowStockType
    ? vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3)
    : vehicles.filter((v) => v.quantity === 0);

  const modalTitle = isLowStockType
    ? 'Low Stock Vehicles (3 or fewer in stock)'
    : 'Out of Stock Vehicles (0 in stock)';

  const modalSubtitle = isLowStockType
    ? 'These models are running low and need immediate restock attention.'
    : 'These models are currently sold out and unavailable for purchase.';

  const handleFilterCatalog = () => {
    if (onFilterCatalog) {
      onFilterCatalog(type);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          
          {/* Backdrop Blur Fade-In */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Glassmorphic Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-panel rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden relative z-10 border border-white/10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-slate-950/70 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-lg ${
                    isLowStockType
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/20'
                  }`}
                >
                  {isLowStockType ? (
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-snug flex items-center gap-2">
                    {modalTitle}
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isLowStockType
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {filteredVehicles.length} {filteredVehicles.length === 1 ? 'Model' : 'Models'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{modalSubtitle}</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Vehicle Table List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
              {filteredVehicles.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/40 border border-white/5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white">All Models Well Stocked! 🎉</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    {isLowStockType
                      ? 'No vehicles currently have low stock (3 or fewer units).'
                      : 'No vehicles are currently out of stock. Outstanding inventory health!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredVehicles.map((vehicle) => {
                    const formattedPrice = new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    }).format(vehicle.price);

                    return (
                      <div
                        key={vehicle.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-white/20 transition-all gap-4 group"
                      >
                        {/* Vehicle Thumbnail & Info */}
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-slate-900 overflow-hidden border border-white/10 flex-shrink-0 relative">
                            {vehicle.image_url ? (
                              <img
                                src={vehicle.image_url}
                                alt={`${vehicle.make} ${vehicle.model}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
                                <Car className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                                {vehicle.make}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-white/5">
                                {vehicle.category}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white leading-tight mt-0.5">
                              {vehicle.model}
                            </h4>
                            <div className="text-xs font-bold price-gradient mt-1">
                              {formattedPrice}
                            </div>
                          </div>
                        </div>

                        {/* Stock Badge & Restock CTA */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                          <div>
                            {vehicle.quantity === 0 ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm">
                                <AlertCircle className="w-3.5 h-3.5" /> 0 Sold Out
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse">
                                <AlertTriangle className="w-3.5 h-3.5" /> Only {vehicle.quantity} Left
                              </span>
                            )}
                          </div>

                          {/* Quick Restock Action for Admin */}
                          {isAdmin && onRestockVehicle && (
                            <button
                              onClick={() => {
                                onClose();
                                onRestockVehicle(vehicle);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                            >
                              <PackagePlus className="w-3.5 h-3.5" /> Restock
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer with Actions */}
            <div className="px-6 py-4 border-t border-white/10 bg-slate-950/70 flex items-center justify-between flex-shrink-0">
              <span className="text-xs text-slate-400 font-medium">
                {filteredVehicles.length} vehicles requiring review
              </span>

              <div className="flex items-center gap-3">
                {filteredVehicles.length > 0 && (
                  <button
                    onClick={handleFilterCatalog}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white text-xs font-bold rounded-xl border border-indigo-500/30 transition-all active:scale-95"
                  >
                    <span>Filter Catalog Below</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
