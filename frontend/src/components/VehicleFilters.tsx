import React from 'react';
import { Search, Filter, RotateCcw, DollarSign, X, Layers, Tag } from 'lucide-react';
import { VehicleFilterParams } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface VehicleFiltersProps {
  filters: VehicleFilterParams;
  onChange: (filters: VehicleFilterParams) => void;
  onReset: () => void;
  categories: string[];
}

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  onChange,
  onReset,
  categories,
}) => {
  const handleInputChange = (field: keyof VehicleFilterParams, value: string) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  const removeSingleFilter = (field: keyof VehicleFilterParams) => {
    onChange({
      ...filters,
      [field]: '',
    });
  };

  const hasActiveFilters =
    !!filters.make || !!filters.model || !!filters.category || !!filters.minPrice || !!filters.maxPrice;

  // Active filter tags array
  const activeTags: { key: keyof VehicleFilterParams; label: string; value: string }[] = [];
  if (filters.make) activeTags.push({ key: 'make', label: 'Make', value: filters.make });
  if (filters.model) activeTags.push({ key: 'model', label: 'Model', value: filters.model });
  if (filters.category) activeTags.push({ key: 'category', label: 'Category', value: filters.category });
  if (filters.minPrice) activeTags.push({ key: 'minPrice', label: 'Min Price', value: `$${filters.minPrice}` });
  if (filters.maxPrice) activeTags.push({ key: 'maxPrice', label: 'Max Price', value: `$${filters.maxPrice}` });

  return (
    <div className="glass-panel rounded-3xl p-5 mb-8 shadow-2xl relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar inside filter card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-sm tracking-wide">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Filter className="w-4 h-4" />
          </div>
          <span>Filter Fleet Catalog</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-200 transition-all bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-xl border border-rose-500/30 active:scale-95 self-start sm:self-auto font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All Filters
          </button>
        )}
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Search Make */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
            Make
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Porsche, Tesla..."
              value={filters.make || ''}
              onChange={(e) => handleInputChange('make', e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-xs text-slate-100 placeholder-slate-500 glow-input outline-none"
            />
          </div>
        </div>

        {/* Search Model */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
            Model
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. 911, Model S..."
              value={filters.model || ''}
              onChange={(e) => handleInputChange('model', e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-xs text-slate-100 placeholder-slate-500 glow-input outline-none"
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" /> Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-xs text-slate-100 glow-input outline-none cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-200">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
            Min Price ($)
          </label>
          <div className="relative">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => handleInputChange('minPrice', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-xs text-slate-100 placeholder-slate-500 glow-input outline-none"
            />
          </div>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
            Max Price ($)
          </label>
          <div className="relative">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              placeholder="250,000"
              value={filters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-xs text-slate-100 placeholder-slate-500 glow-input outline-none"
            />
          </div>
        </div>
      </div>

      {/* Real-time Active Filter Tag Pills */}
      <AnimatePresence>
        {activeTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2 pt-3.5 mt-3.5 border-t border-white/5"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3" /> Active Filters:
            </span>
            {activeTags.map((tag) => (
              <motion.span
                key={tag.key}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1.5 text-xs bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full shadow-sm"
              >
                <span className="font-semibold text-slate-400 text-[10px]">{tag.label}:</span>
                <span className="font-bold text-slate-100">{tag.value}</span>
                <button
                  onClick={() => removeSingleFilter(tag.key)}
                  className="hover:text-rose-400 p-0.5 rounded-full hover:bg-rose-500/20 transition-colors ml-0.5"
                  title={`Remove ${tag.label} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
