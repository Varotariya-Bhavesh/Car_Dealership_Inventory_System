import { Router } from 'express';
import { addVehicle, getVehicles, searchVehicles } from '../controllers/vehicle.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { validateCreateVehicle } from '../middleware/validate';

const router = Router();

/**
 * @openapi
 * /api/vehicles/search:
 *   get:
 *     summary: Search and filter vehicles
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: make
 *         schema:
 *           type: string
 *         description: Filter by vehicle make (e.g. Toyota)
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: Filter by vehicle model (e.g. RAV4)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (e.g. SUV, Sedan)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price limit
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price limit
 *     responses:
 *       200:
 *         description: Matching vehicles list
 *       401:
 *         description: Unauthorized
 */
router.get('/search', authenticateJwt, searchVehicles);

/**
 * @openapi
 * /api/vehicles:
 *   post:
 *     summary: Add a new vehicle
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVehicleRequest'
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Retrieve all available vehicles
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all available vehicles
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateJwt, validateCreateVehicle, addVehicle);
router.get('/', authenticateJwt, getVehicles);

export default router;
