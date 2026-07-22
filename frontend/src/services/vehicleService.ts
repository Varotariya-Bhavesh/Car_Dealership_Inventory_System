import api from '../api/axios';
import { Vehicle, VehicleFilterParams } from '../types';

export interface GetVehiclesResponse {
  vehicles: Vehicle[];
}

export interface SingleVehicleResponse {
  message?: string;
  vehicle: Vehicle;
}

export interface CreateVehicleParams {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  image?: File | null;
  image_url?: string | null;
}

export interface UpdateVehicleParams {
  make?: string;
  model?: string;
  category?: string;
  price?: number;
  quantity?: number;
  image?: File | null;
  image_url?: string | null;
}

export const VehicleService = {
  // Fetch all vehicles
  getAllVehicles: async (): Promise<Vehicle[]> => {
    const response = await api.get<GetVehiclesResponse>('/vehicles');
    return response.data.vehicles;
  },

  // Search & filter vehicles
  searchVehicles: async (params: VehicleFilterParams): Promise<Vehicle[]> => {
    const query = new URLSearchParams();
    if (params.make) query.append('make', params.make);
    if (params.model) query.append('model', params.model);
    if (params.category) query.append('category', params.category);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);

    const response = await api.get<GetVehiclesResponse>(`/vehicles/search?${query.toString()}`);
    return response.data.vehicles;
  },

  // Purchase vehicle (decrements stock by 1)
  purchaseVehicle: async (id: string): Promise<Vehicle> => {
    const response = await api.post<SingleVehicleResponse>(`/vehicles/${id}/purchase`);
    return response.data.vehicle;
  },

  // [Admin] Add new vehicle (supports image file upload via FormData)
  addVehicle: async (data: CreateVehicleParams): Promise<Vehicle> => {
    if (data.image) {
      const formData = new FormData();
      formData.append('make', data.make);
      formData.append('model', data.model);
      formData.append('category', data.category);
      formData.append('price', data.price.toString());
      formData.append('quantity', data.quantity.toString());
      formData.append('image', data.image);

      const response = await api.post<SingleVehicleResponse>('/vehicles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.vehicle;
    }

    const response = await api.post<SingleVehicleResponse>('/vehicles', data);
    return response.data.vehicle;
  },

  // [Admin] Update vehicle details (supports image file upload via FormData)
  updateVehicle: async (id: string, data: UpdateVehicleParams): Promise<Vehicle> => {
    if (data.image) {
      const formData = new FormData();
      if (data.make !== undefined) formData.append('make', data.make);
      if (data.model !== undefined) formData.append('model', data.model);
      if (data.category !== undefined) formData.append('category', data.category);
      if (data.price !== undefined) formData.append('price', data.price.toString());
      if (data.quantity !== undefined) formData.append('quantity', data.quantity.toString());
      formData.append('image', data.image);

      const response = await api.put<SingleVehicleResponse>(`/vehicles/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.vehicle;
    }

    const response = await api.put<SingleVehicleResponse>(`/vehicles/${id}`, data);
    return response.data.vehicle;
  },

  // [Admin] Delete vehicle
  deleteVehicle: async (id: string): Promise<void> => {
    await api.delete<{ message: string }>(`/vehicles/${id}`);
  },

  // [Admin] Restock vehicle quantity
  restockVehicle: async (id: string, quantity: number): Promise<Vehicle> => {
    const response = await api.post<SingleVehicleResponse>(`/vehicles/${id}/restock`, {
      quantity,
      adjustment: quantity,
    });
    return response.data.vehicle;
  },
};
