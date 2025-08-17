import { Router } from "express";
import {
  createBusinessDealer,
  getAllBusinessDealers,
  getBusinessDealerById,
  updateBusinessDealer,
  deleteBusinessDealer
} from "../controllers/businessDealers.controller";

const router = Router();

// Create business dealer (onboarding)
router.post('/', createBusinessDealer);

// Get all business dealers with pagination
router.get('/', getAllBusinessDealers);

// Get business dealer by ID
router.get('/:id', getBusinessDealerById);

// Update business dealer
router.put('/:id', updateBusinessDealer);

// Delete business dealer
router.delete('/:id', deleteBusinessDealer);

export default router;