import { Router } from "express";
import {
  createShipment,
  calculateShipmentCost,
  getAllShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
  getDistanceAndDuration,
} from "../controllers/shipment.controller";

const router = Router();

// Create a new shipment with cost calculation
router.post('/', createShipment);

// Calculate shipment cost without creating shipment
router.post('/calculate-cost', calculateShipmentCost);

// Get all shipments with pagination
router.get('/', getAllShipments);

// Get shipment by ID
router.get('/:id', getShipmentById);

// Update shipment
router.put('/:id', updateShipment);

// Delete shipment
router.delete('/:id', deleteShipment);

// Get distance and duration between two locations
router.get('/distance-duration', getDistanceAndDuration);

export default router;