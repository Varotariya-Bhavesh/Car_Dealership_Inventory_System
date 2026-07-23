import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import { UpdateVehicleParams } from '../services/vehicleService';
import { X, Edit3, Loader2, Upload, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditVehicleModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, params: UpdateVehicleParams) => Promise<void>;
}

export const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (vehicle) {
      setMake(vehicle.make);
      setModel(vehicle.model);
      setCategory(vehicle.category);
      setPrice(vehicle.price.toString());
      setQuantity(vehicle.quantity.toString());
      setImageFile(null);
      setImagePreview(vehicle.image_url || null);
    }
  }, [vehicle]);

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WEBP, GIF).');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    if (imagePreview && imagePreview !== vehicle?.image_url) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    setError(null);

    const priceNum = parseFloat(price);
    const quantityNum = parseInt(quantity, 10);

    if (!make.trim() || !model.trim() || !category.trim()) {
      setError('Please fill in all vehicle fields.');
      return;
    }

    if (isNaN(priceNum) || priceNum < 0) {
      setError('Please enter a valid non-negative price.');
      return;
    }

    if (isNaN(quantityNum) || quantityNum < 0) {
      setError('Please enter a valid stock quantity.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(vehicle.id, {
        make: make.trim(),
        model: model.trim(),
        category: category.trim(),
        price: priceNum,
        quantity: quantityNum,
        ...(imageFile ? { image: imageFile } : {}),
      });
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update vehicle.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && vehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Framer Motion Backdrop Blur Fade-In */}
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
            className="glass-panel rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative z-10 border border-white/10"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-tight">Edit Vehicle Specifications</h3>
                  <p className="text-[11px] text-slate-400">Update catalog specs & stock counts</p>
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
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-xl">
                  {error}
                </div>
              )}

              {/* Vehicle Image Upload Field / Dropzone */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Showroom Vehicle Photo
                </label>

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-slate-950 group h-40 shadow-inner">
                    <img
                      src={imagePreview}
                      alt="Vehicle Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                      <span className="text-xs text-slate-200 font-semibold truncate max-w-[200px]">
                        {imageFile ? imageFile.name : 'Current photo'}
                      </span>
                      <button
                        type="button"
                        onClick={clearImage}
                        className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all shadow-lg active:scale-95"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all text-center ${
                      isDragging
                        ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                        : 'border-white/10 hover:border-amber-500/50 bg-slate-950/50 hover:bg-slate-950/80'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-2 shadow-inner">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      Upload / Replace Photo
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">
                      PNG, JPG, WEBP, or GIF (max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Make & Model */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Make
                  </label>
                  <input
                    type="text"
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-100 glow-input outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Model
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-100 glow-input outline-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Category Class
                </label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-100 glow-input outline-none"
                />
              </div>

              {/* Price & Quantity */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-100 glow-input outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-100 glow-input outline-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
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
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-600/30 border border-white/20 flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      Save Changes
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
