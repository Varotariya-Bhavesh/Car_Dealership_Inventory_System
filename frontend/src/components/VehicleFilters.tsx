import React from 'react';
import { Search, Filter, RotateCcw, DollarSign } from 'lucide-react';
import { VehicleFilterParams } from '../types';

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

  const hasActiveFilters =
    !!filters.make || !!filters.model || !!filters.category || !!filters.minPrice || !!filters.maxPrice;

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 mb-8 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <Filter className="w-5 h-5 text-blue-400" />
          <span>Search & Filter Catalog</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors bg-slate-700/50 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-600/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Make */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Make
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Toyota, Honda..."
              value={filters.make || ''}
              onChange={(e) => handleInputChange('make', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Search Model */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Model
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. RAV4, Civic..."
              value={filters.model || ''}
              onChange={(e) => handleInputChange('model', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Min Price ($)
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => handleInputChange('minPrice', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Max Price ($)
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              placeholder="100000"
              value={filters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
