import { VehicleRepository } from '../repositories/vehicle.repository';
import { Vehicle, CreateVehicleRequestBody, VehicleSearchQuery } from '../types';

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
}
