import React, { useState } from 'react';
import { Vehicle } from '../types';
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteVehicleModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export const DeleteVehicleModal: React.FC<DeleteVehicleModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!vehicle) return;
    setError(null);
    try {
      setIsDeleting(true);
      await onConfirm(vehicle.id);
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete vehicle.';
      setError(msg);
    } finally {
      setIsDeleting(false);
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
            className="glass-panel rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative z-10 p-6 border border-rose-500/20"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-500/10">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white mb-1.5">Remove Vehicle from Fleet?</h3>
              <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                Are you sure you want to permanently delete{' '}
                <strong className="text-slate-100 font-bold">{vehicle.make} {vehicle.model}</strong>?
                This action cannot be reversed.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-xl">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-rose-600/30 border border-white/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-95"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
