import React, { useState } from 'react';
import { Vehicle } from '../types';
import { ShoppingBag, Loader2, Tag, Car, Layers } from 'lucide-react';

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

  const handlePurchase = async () => {
    if (vehicle.quantity <= 0) return;
    try {
      setIsPurchasing(true);
      await onPurchase(vehicle.id);
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
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-600 transition-all duration-300 group">
      <div>
        {/* Top Header & Stock Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
                {vehicle.make}
              </span>
              <h3 className="text-lg font-bold text-slate-100 leading-tight">
                {vehicle.model}
              </h3>
            </div>
          </div>

          {/* Stock Badge */}
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Only {vehicle.quantity} left
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {vehicle.quantity} In Stock
            </span>
          )}
        </div>

        {/* Category & Details */}
        <div className="flex items-center gap-4 text-xs text-slate-400 my-4 py-2 px-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Category: <strong className="text-slate-200">{vehicle.category}</strong></span>
          </div>
        </div>
      </div>

      {/* Price & Action Buttons */}
      <div className="pt-4 border-t border-slate-700/60 mt-4 space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-slate-400 uppercase font-semibold">Price</span>
          <span className="text-2xl font-black text-slate-100 tracking-tight">{formattedPrice}</span>
        </div>

        {/* Purchase Button - MUST BE DISABLED IF QUANTITY === 0 */}
        <button
          onClick={handlePurchase}
          disabled={isOutOfStock || isPurchasing}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
            isOutOfStock
              ? 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/20 active:scale-[0.99]'
          }`}
        >
          {isPurchasing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              Processing...
            </>
          ) : isOutOfStock ? (
            <>
              <ShoppingBag className="w-4 h-4 text-slate-500" />
              Out of Stock
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Purchase Vehicle
            </>
          )}
        </button>

        {/* Admin Quick Action Controls (Placeholder for Step 4 integration) */}
        {isAdmin && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/40 text-xs font-semibold">
            {onEdit && (
              <button
                onClick={() => onEdit(vehicle)}
                className="py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Edit
              </button>
            )}
            {onRestock && (
              <button
                onClick={() => onRestock(vehicle)}
                className="py-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors"
              >
                Restock
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(vehicle)}
                className="py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30 rounded-lg transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
