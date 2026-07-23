import React, { useEffect, useState, useCallback } from 'react';
import { Vehicle, VehicleFilterParams } from '../types';
import { VehicleService, CreateVehicleParams, UpdateVehicleParams } from '../services/vehicleService';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleFilters } from '../components/VehicleFilters';
import { DashboardStats } from '../components/DashboardStats';
import { StockDetailsModal, StockModalType } from '../components/StockDetailsModal';
import { AddVehicleModal } from '../components/AddVehicleModal';
import { EditVehicleModal } from '../components/EditVehicleModal';
import { DeleteVehicleModal } from '../components/DeleteVehicleModal';
import { RestockVehicleModal } from '../components/RestockVehicleModal';
import { Car, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Dashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<VehicleFilterParams>({
    make: '',
    model: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  // Modal States
  const [stockModalType, setStockModalType] = useState<StockModalType>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const [restockingVehicle, setRestockingVehicle] = useState<Vehicle | null>(null);

  // Fetch vehicles with debouncing/filtering (case-insensitive & trimmed)
  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const trimmedMake = filters.make?.trim() || '';
      const trimmedModel = filters.model?.trim() || '';
      const trimmedCategory = filters.category?.trim() || '';

      const hasFilter =
        trimmedMake ||
        trimmedModel ||
        (trimmedCategory && trimmedCategory !== 'All Categories') ||
        filters.minPrice ||
        filters.maxPrice;

      let data: Vehicle[];
      if (hasFilter) {
        data = await VehicleService.searchVehicles({
          make: trimmedMake,
          model: trimmedModel,
          category: trimmedCategory === 'All Categories' ? '' : trimmedCategory,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        });
      } else {
        data = await VehicleService.getAllVehicles();
      }

      setVehicles(data);

      // Extract unique categories for filter dropdown
      const uniqueCategories = Array.from(
        new Set(data.map((v) => v.category).filter(Boolean))
      );
      if (uniqueCategories.length > 0) {
        setCategories((prev) => Array.from(new Set([...prev, ...uniqueCategories])));
      }
    } catch (err: any) {
      console.error('Failed to fetch vehicles:', err);
      const msg = err.response?.data?.message || 'Failed to load vehicle catalog.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVehicles();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchVehicles]);

  // Handle Purchase trigger
  const handlePurchase = async (vehicleId: string) => {
    try {
      const updatedVehicle = await VehicleService.purchaseVehicle(vehicleId);
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? updatedVehicle : v))
      );
      showToast(`Vehicle purchased successfully! (${updatedVehicle.make} ${updatedVehicle.model})`, 'success');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Vehicle is out of stock!';
      showToast(msg, 'error');
    }
  };

  // [Admin] Add Vehicle Handler
  const handleAddVehicle = async (params: CreateVehicleParams) => {
    const newVehicle = await VehicleService.addVehicle(params);
    setVehicles((prev) => [newVehicle, ...prev]);
    showToast(`Added vehicle: ${newVehicle.make} ${newVehicle.model}`, 'success');
  };

  // [Admin] Edit Vehicle Handler
  const handleEditVehicle = async (id: string, params: UpdateVehicleParams) => {
    const updated = await VehicleService.updateVehicle(id, params);
    setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
    showToast(`Updated specs for ${updated.make} ${updated.model}`, 'success');
  };

  // [Admin] Delete Vehicle Handler
  const handleDeleteVehicle = async (id: string) => {
    await VehicleService.deleteVehicle(id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    showToast('Vehicle permanently deleted from inventory.', 'warning');
  };

  // [Admin] Restock Vehicle Handler
  const handleRestockVehicle = async (id: string, qty: number) => {
    const updated = await VehicleService.restockVehicle(id, qty);
    setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
    showToast(`Restocked ${updated.make} ${updated.model} (+${qty} units).`, 'success');
  };

  const handleResetFilters = () => {
    setFilters({
      make: '',
      model: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  const handleFilterCatalogFromModal = () => {
    const filterSection = document.getElementById('catalog-search-section');
    if (filterSection) {
      filterSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Luxury Automotive Terminal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            Fleet Inventory & Metrics
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time telemetry, executive fleet analytics, and instant vehicle sales management.
          </p>
        </div>

        {/* Admin Quick Action Button */}
        {isAdmin && (
          <div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-600/30 border border-white/20 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add New Vehicle
            </button>
          </div>
        )}
      </div>

      {/* Top Executive Metrics Bar (4 Cards, Interactive Stock Inspection) */}
      <DashboardStats
        vehicles={vehicles}
        onOpenStockModal={(type) => setStockModalType(type)}
      />

      {/* Search & Filter Controls */}
      <div id="catalog-search-section">
        <VehicleFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          categories={categories}
        />
      </div>

      {/* Main Grid View */}
      {error ? (
        <div className="p-8 bg-rose-500/10 border border-rose-500/30 rounded-3xl text-center max-w-lg mx-auto backdrop-blur-xl">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-rose-300">Error Loading Vehicles</h3>
          <p className="text-slate-400 text-xs mt-1">{error}</p>
          <button
            onClick={fetchVehicles}
            className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-white/10 transition-colors"
          >
            Retry Fetching Catalog
          </button>
        </div>
      ) : isLoading ? (
        /* Skeleton Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className="glass-panel rounded-3xl p-6 animate-pulse space-y-4 h-96 flex flex-col justify-between"
            >
              <div className="h-44 bg-slate-900/80 rounded-2xl w-full"></div>
              <div className="space-y-2">
                <div className="h-5 bg-slate-800 rounded-lg w-3/4"></div>
                <div className="h-4 bg-slate-800/60 rounded-lg w-1/2"></div>
              </div>
              <div className="h-10 bg-slate-800/90 rounded-2xl"></div>
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 glass-panel rounded-3xl max-w-md mx-auto p-8 border border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Vehicles Match Criteria</h3>
          <p className="text-slate-400 text-xs mt-1 mb-5">
            Try adjusting or clearing your search filters to view available inventory.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            Clear Search Filters
          </button>
        </div>
      ) : (
        /* Vehicle Grid Display */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onPurchase={handlePurchase}
              isAdmin={isAdmin}
              onEdit={(v) => setEditingVehicle(v)}
              onDelete={(v) => setDeletingVehicle(v)}
              onRestock={(v) => setRestockingVehicle(v)}
            />
          ))}
        </div>
      )}

      {/* Stock Details Modal for Inspection */}
      <StockDetailsModal
        type={stockModalType}
        isOpen={!!stockModalType}
        onClose={() => setStockModalType(null)}
        vehicles={vehicles}
        isAdmin={isAdmin}
        onRestockVehicle={(vehicle) => setRestockingVehicle(vehicle)}
        onFilterCatalog={handleFilterCatalogFromModal}
      />

      {/* Admin Modals */}
      {isAdmin && (
        <>
          <AddVehicleModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddVehicle}
          />
          <EditVehicleModal
            vehicle={editingVehicle}
            isOpen={!!editingVehicle}
            onClose={() => setEditingVehicle(null)}
            onSubmit={handleEditVehicle}
          />
          <DeleteVehicleModal
            vehicle={deletingVehicle}
            isOpen={!!deletingVehicle}
            onClose={() => setDeletingVehicle(null)}
            onConfirm={handleDeleteVehicle}
          />
          <RestockVehicleModal
            vehicle={restockingVehicle}
            isOpen={!!restockingVehicle}
            onClose={() => setRestockingVehicle(null)}
            onConfirm={handleRestockVehicle}
          />
        </>
      )}
    </div>
  );
};
