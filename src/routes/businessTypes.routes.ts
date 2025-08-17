import { Router } from "express";
import {
  createBusinessType,
  updateBusinessType,
  deleteBusinessType,
  getBusinessType,
  getAllBusinessTypes
} from "../controllers/businessTypes.controller";

const router = Router();

// Create a new business type
router.post('/', createBusinessType);

// Get all business types with pagination
router.get('/', getAllBusinessTypes);

// Get a specific business type by ID
router.get('/:id', getBusinessType);

// Update a business type
router.put('/:id', updateBusinessType);

// Delete a business type
router.delete('/:id', deleteBusinessType);

export default router;