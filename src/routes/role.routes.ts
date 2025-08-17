import { Router } from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole
} from "../controllers/role.controller";

const router = Router();

// Create a new role
router.post('/', createRole);

// Get all roles
router.get('/', getAllRoles);

// Get role by ID
router.get('/:id', getRoleById);

// Update role
router.put('/:id', updateRole);

// Delete role
router.delete('/:id', deleteRole);

export default router;