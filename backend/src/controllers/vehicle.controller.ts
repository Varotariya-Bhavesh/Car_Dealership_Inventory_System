import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleRequestBody, UpdateVehicleRequestBody, VehicleSearchQuery } from '../types';
import { AppError } from '../errors/app-error';

/**
 * POST /api/vehicles — Add a new vehicle
 */
export const addVehicle = async (
  req: Request<Record<string, never>, unknown, CreateVehicleRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const vehicle = await VehicleService.createVehicle(req.body, req.file);
    res.status(201).json({
      message: 'Vehicle created successfully',
      vehicle,
    });
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[VehicleController] addVehicle error:', message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /api/vehicles — Retrieve all available vehicles
 */
export const getVehicles = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const vehicles = await VehicleService.getAllVehicles();
    res.status(200).json({ vehicles });
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[VehicleController] getVehicles error:', message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /api/vehicles/search — Search and filter vehicles
 */
export const searchVehicles = async (
  req: Request<Record<string, never>, unknown, unknown, VehicleSearchQuery>,
  res: Response
): Promise<void> => {
  try {
    const vehicles = await VehicleService.searchVehicles(req.query);
    res.status(200).json({ vehicles });
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[VehicleController] searchVehicles error:', message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /api/vehicles/:id — Retrieve vehicle by ID
 */
export const getVehicleById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const vehicle = await VehicleService.getVehicleById(req.params.id);
    res.status(200).json({ vehicle });
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[VehicleController] getVehicleById error:', message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * PUT /api/vehicles/:id — Update vehicle details
 */
export const updateVehicle = async (
  req: Request<{ id: string }, unknown, UpdateVehicleRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const vehicle = await VehicleService.updateVehicle(req.params.id, req.body, req.file);
    res.status(200).json({
      message: 'Vehicle updated successfully',
      vehicle,
    });
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[VehicleController] updateVehicle error:', message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * DELETE /api/vehicles/:id — Delete vehicle (Admin only)
 */
export const deleteVehicle = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    await VehicleService.deleteVehicle(req.params.id);
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[VehicleController] deleteVehicle error:', message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * POST /api/vehicles/:id/purchase — Purchase vehicle (decrement stock)
 */
export const purchaseVehicle = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const vehicle = await VehicleService.purchaseVehicle(req.params.id);
    res.status(200).json({
      message: 'Vehicle purchased successfully',
      vehicle,
    });
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[VehicleController] purchaseVehicle error:', message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * POST /api/vehicles/:id/restock — Restock vehicle quantity (Admin only)
 */
export const restockVehicle = async (
  req: Request<{ id: string }, unknown, { quantity?: number; adjustment?: number }>,
  res: Response
): Promise<void> => {
  try {
    const quantity = req.body.quantity ?? req.body.adjustment ?? 0;
    const vehicle = await VehicleService.restockVehicle(req.params.id, quantity);
    res.status(200).json({
      message: 'Vehicle restocked successfully',
      vehicle,
    });
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[VehicleController] restockVehicle error:', message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

