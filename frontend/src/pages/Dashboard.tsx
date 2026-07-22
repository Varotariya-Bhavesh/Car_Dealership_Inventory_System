import React, { useEffect, useState, useCallback } from 'react';
import { Vehicle, VehicleFilterParams } from '../types';
import { VehicleService, CreateVehicleParams, UpdateVehicleParams } from '../services/vehicleService';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleFilters } from '../components/VehicleFilters';
import { AddVehicleModal } from '../components/AddVehicleModal';
import { EditVehicleModal } from '../components/EditVehicleModal';
import { DeleteVehicleModal } from '../components/DeleteVehicleModal';
import { RestockVehicleModal } from '../components/RestockVehicleModal';
import { Car, Plus, AlertCircle } from 'lucide-react';
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

  // Modal States (Admin Only)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const [restockingVehicle, setRestockingVehicle] = useState<Vehicle | null>(null);

  // Fetch vehicles with debouncing/filtering
  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const hasFilter =
        filters.make || filters.model || filters.category || filters.minPrice || filters.maxPrice;

      let data: Vehicle[];
      if (hasFilter) {
        data = await VehicleService.searchVehicles(filters);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <Car className="w-8 h-8 text-blue-500" />
            Vehicle Inventory Catalog
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse available vehicles, filter specs, and manage inventory operations.
          </p>
        </div>

        {/* Admin Quick Action Button */}
        {isAdmin && (
          <div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add New Vehicle
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Controls */}
      <VehicleFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        categories={categories}
      />

      {/* Main Grid View */}
      {error ? (
        <div className="p-8 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-rose-300">Error Loading Vehicles</h3>
          <p className="text-slate-400 text-sm mt-1">{error}</p>
          <button
            onClick={fetchVehicles}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Retry Fetching Catalog
          </button>
        </div>
      ) : isLoading ? (
        // Skeleton Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 animate-pulse space-y-4"
            >
              <div className="h-6 bg-slate-700/60 rounded-lg w-3/4"></div>
              <div className="h-4 bg-slate-700/40 rounded-lg w-1/2"></div>
              <div className="h-10 bg-slate-700/30 rounded-xl my-4"></div>
              <div className="h-10 bg-slate-700/70 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        // Empty State
        <div className="text-center py-16 bg-slate-800/40 border border-slate-700/60 rounded-2xl max-w-md mx-auto p-8">
          <Car className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">No Vehicles Match Criteria</h3>
          <p className="text-slate-400 text-sm mt-1 mb-4">
            Try adjusting or clearing your search filters to view available inventory.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all"
          >
            Clear Search Filters
          </button>
        </div>
      ) : (
        // Vehicle Grid Display
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
