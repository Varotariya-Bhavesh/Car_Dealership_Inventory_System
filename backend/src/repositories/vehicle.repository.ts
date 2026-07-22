import { supabase } from '../config/supabase';
import { Vehicle, CreateVehicleRequestBody, UpdateVehicleRequestBody, VehicleSearchQuery } from '../types';

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
   * Find vehicle by ID.
   */
  public static async findById(id: string): Promise<Vehicle | null> {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
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

  /**
   * Update an existing vehicle by ID.
   */
  public static async update(id: string, payload: UpdateVehicleRequestBody): Promise<Vehicle | null> {
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (payload.make !== undefined) updatePayload.make = payload.make.trim();
    if (payload.model !== undefined) updatePayload.model = payload.model.trim();
    if (payload.category !== undefined) updatePayload.category = payload.category.trim();
    if (payload.price !== undefined) updatePayload.price = payload.price;
    if (payload.quantity !== undefined) updatePayload.quantity = payload.quantity;

    const { data, error } = await supabase
      .from('vehicles')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return null;
    }

    return data as Vehicle;
  }

  /**
   * Delete a vehicle by ID.
   */
  public static async delete(id: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return false;
    }

    return true;
  }

  /**
   * Update stock quantity for a vehicle by ID.
   */
  public static async updateQuantity(id: string, newQuantity: number): Promise<Vehicle | null> {
    const { data, error } = await supabase
      .from('vehicles')
      .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return null;
    }

    return data as Vehicle;
  }
}
