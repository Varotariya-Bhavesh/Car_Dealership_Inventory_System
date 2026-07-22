import { supabase } from '../config/supabase';
import { Vehicle, CreateVehicleRequestBody, VehicleSearchQuery } from '../types';

export class VehicleRepository {
  /**
   * Insert a vehicle into Supabase.
   */
  public static async create(payload: CreateVehicleRequestBody): Promise<Vehicle> {
    const { data, error } = await supabase
      .from('vehicles')
      .insert({
        make: payload.make.trim(),
        model: payload.model.trim(),
        category: payload.category.trim(),
        price: payload.price,
        quantity: payload.quantity,
      })
      .select('*')
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? 'Failed to create vehicle');
    }

    return data as Vehicle;
  }

  /**
   * Fetch all vehicles from Supabase.
   */
  public static async findAll(): Promise<Vehicle[]> {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message ?? 'Failed to fetch vehicles');
    }

    return (data as Vehicle[]) ?? [];
  }

  /**
   * Search/filter vehicles from Supabase.
   */
  public static async search(query: VehicleSearchQuery): Promise<Vehicle[]> {
    let dbQuery = supabase.from('vehicles').select('*');

    if (query.make && query.make.trim() !== '') {
      dbQuery = dbQuery.ilike('make', `%${query.make.trim()}%`);
    }

    if (query.model && query.model.trim() !== '') {
      dbQuery = dbQuery.ilike('model', `%${query.model.trim()}%`);
    }

    if (query.category && query.category.trim() !== '') {
      dbQuery = dbQuery.ilike('category', `%${query.category.trim()}%`);
    }

    if (query.minPrice !== undefined && query.minPrice !== '') {
      const minVal = Number(query.minPrice);
      if (!isNaN(minVal)) {
        dbQuery = dbQuery.gte('price', minVal);
      }
    }

    if (query.maxPrice !== undefined && query.maxPrice !== '') {
      const maxVal = Number(query.maxPrice);
      if (!isNaN(maxVal)) {
        dbQuery = dbQuery.lte('price', maxVal);
      }
    }

    const { data, error } = await dbQuery.order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message ?? 'Failed to search vehicles');
    }

    return (data as Vehicle[]) ?? [];
  }
}
