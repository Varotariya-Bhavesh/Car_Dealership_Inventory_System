import { Router } from 'express';
import {
  addVehicle,
  getVehicles,
  searchVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from '../controllers/vehicle.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import {
  validateCreateVehicle,
  validateUpdateVehicle,
  validateRestockVehicle,
} from '../middleware/validate';

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

/**
 * @openapi
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle details
 *       404:
 *         description: Vehicle not found
 *   put:
 *     summary: Update vehicle details
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVehicleRequest'
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       400:
 *         description: Invalid payload
 *       404:
 *         description: Vehicle not found
 *   delete:
 *     summary: Delete vehicle (Admin only)
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', authenticateJwt, getVehicleById);
router.put('/:id', authenticateJwt, validateUpdateVehicle, updateVehicle);
router.delete('/:id', authenticateJwt, requireAdmin, deleteVehicle);

/**
 * @openapi
 * /api/vehicles/{id}/purchase:
 *   post:
 *     summary: Purchase vehicle (decrements stock by 1)
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle purchased successfully
 *       400:
 *         description: Out of stock
 *       404:
 *         description: Vehicle not found
 */
router.post('/:id/purchase', authenticateJwt, purchaseVehicle);

/**
 * @openapi
 * /api/vehicles/{id}/restock:
 *   post:
 *     summary: Restock vehicle (Admin only)
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Vehicle restocked successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Vehicle not found
 */
router.post('/:id/restock', authenticateJwt, requireAdmin, validateRestockVehicle, restockVehicle);

export default router;

