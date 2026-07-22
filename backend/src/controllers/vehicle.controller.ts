import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleRequestBody, VehicleSearchQuery } from '../types';
import { AppError } from '../errors/app-error';

/**
 * POST /api/vehicles — Add a new vehicle
 */
export const addVehicle = async (
  req: Request<Record<string, never>, unknown, CreateVehicleRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const vehicle = await VehicleService.createVehicle(req.body);
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
