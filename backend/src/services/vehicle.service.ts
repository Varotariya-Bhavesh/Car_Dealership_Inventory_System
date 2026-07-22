import { VehicleRepository } from '../repositories/vehicle.repository';
import { Vehicle, CreateVehicleRequestBody, UpdateVehicleRequestBody, VehicleSearchQuery } from '../types';
import { AppError } from '../errors/app-error';

export class VehicleService {
  /**
   * Creates a new vehicle after validating domain logic.
   */
  public static async createVehicle(payload: CreateVehicleRequestBody): Promise<Vehicle> {
    return VehicleRepository.create(payload);
  }

  /**
   * Retrieves all available vehicles.
   */
  public static async getAllVehicles(): Promise<Vehicle[]> {
    return VehicleRepository.findAll();
  }

  /**
   * Searches and filters vehicles based on parameters.
   */
  public static async searchVehicles(query: VehicleSearchQuery): Promise<Vehicle[]> {
    return VehicleRepository.search(query);
  }

  /**
   * Retrieves a single vehicle by ID.
   */
  public static async getVehicleById(id: string): Promise<Vehicle> {
    const vehicle = await VehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    return vehicle;
  }

  /**
   * Updates an existing vehicle.
   */
  public static async updateVehicle(id: string, payload: UpdateVehicleRequestBody): Promise<Vehicle> {
    const updated = await VehicleRepository.update(id, payload);
    if (!updated) {
      throw new AppError('Vehicle not found', 404);
    }
    return updated;
  }

  /**
   * Deletes a vehicle by ID.
   */
  public static async deleteVehicle(id: string): Promise<void> {
    const deleted = await VehicleRepository.delete(id);
    if (!deleted) {
      throw new AppError('Vehicle not found', 404);
    }
  }

  /**
   * Purchases a vehicle, decrementing quantity by 1.
   */
  public static async purchaseVehicle(id: string): Promise<Vehicle> {
    const vehicle = await VehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    if (vehicle.quantity <= 0) {
      throw new AppError('Vehicle is out of stock', 400);
    }
    const updated = await VehicleRepository.updateQuantity(id, vehicle.quantity - 1);
    if (!updated) {
      throw new AppError('Vehicle not found', 404);
    }
    return updated;
  }

  /**
   * Restocks a vehicle, incrementing quantity by the specified amount.
   */
  public static async restockVehicle(id: string, quantity: number): Promise<Vehicle> {
    const vehicle = await VehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    const updated = await VehicleRepository.updateQuantity(id, vehicle.quantity + quantity);
    if (!updated) {
      throw new AppError('Vehicle not found', 404);
    }
    return updated;
  }
}

