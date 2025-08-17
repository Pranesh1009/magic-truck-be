import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.util';
import { PrismaClient } from '@prisma/client';
import { handlePrismaError } from '../utils/prisma-error';
import logger from '../utils/logger';

const prisma = new PrismaClient();

// Create a new role
export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    // Validate required fields
    if (!name || !description) {
      logger.warn('Missing required fields for role creation', { name, description });
      return sendError(res, 'Name and description are required', 400);
    }

    // Check if role with same name already exists
    const existingRole = await prisma.role.findFirst({
      where: { name }
    });

    if (existingRole) {
      logger.warn('Role with this name already exists', { name });
      return sendError(res, 'Role with this name already exists', 400);
    }

    // Create role
    const role = await prisma.role.create({
      data: {
        name,
        description
      }
    });

    logger.info('Role created successfully', { roleId: role.id, name: role.name });

    return sendSuccess(res, {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    }, 'Role created successfully', 201);

  } catch (error) {
    const prismaError = handlePrismaError(error);
    return sendError(res, prismaError.message, prismaError.statusCode);
  }
};

// Get all roles
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        Users: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    logger.info('Roles retrieved successfully', { count: roles.length });

    return sendSuccess(res, roles, 'Roles retrieved successfully', 200);

  } catch (error) {
    const prismaError = handlePrismaError(error);
    return sendError(res, prismaError.message, prismaError.statusCode);
  }
};

// Get role by ID
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        Users: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!role) {
      logger.warn('Role not found', { roleId: id });
      return sendError(res, 'Role not found', 404);
    }

    logger.info('Role retrieved successfully', { roleId: id });

    return sendSuccess(res, role, 'Role retrieved successfully', 200);

  } catch (error) {
    const prismaError = handlePrismaError(error);
    return sendError(res, prismaError.message, prismaError.statusCode);
  }
};

// Update role
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Validate required fields
    if (!name || !description) {
      logger.warn('Missing required fields for role update', { name, description });
      return sendError(res, 'Name and description are required', 400);
    }

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id }
    });

    if (!existingRole) {
      logger.warn('Role not found for update', { roleId: id });
      return sendError(res, 'Role not found', 404);
    }

    // Check if another role with the same name exists (excluding current role)
    const duplicateRole = await prisma.role.findFirst({
      where: {
        name,
        id: { not: id }
      }
    });

    if (duplicateRole) {
      logger.warn('Role with this name already exists', { name });
      return sendError(res, 'Role with this name already exists', 400);
    }

    // Update role
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        description
      }
    });

    logger.info('Role updated successfully', { roleId: id, name: updatedRole.name });

    return sendSuccess(res, {
      id: updatedRole.id,
      name: updatedRole.name,
      description: updatedRole.description,
      createdAt: updatedRole.createdAt,
      updatedAt: updatedRole.updatedAt
    }, 'Role updated successfully', 200);

  } catch (error) {
    const prismaError = handlePrismaError(error);
    return sendError(res, prismaError.message, prismaError.statusCode);
  }
};

// Delete role
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
      include: {
        Users: {
          select: {
            id: true
          }
        }
      }
    });

    if (!existingRole) {
      logger.warn('Role not found for deletion', { roleId: id });
      return sendError(res, 'Role not found', 404);
    }

    // Check if role is assigned to any users
    if (existingRole.Users.length > 0) {
      logger.warn('Cannot delete role that is assigned to users', {
        roleId: id,
        userCount: existingRole.Users.length
      });
      return sendError(res, 'Cannot delete role that is assigned to users. Please reassign users first.', 400);
    }

    // Delete role
    await prisma.role.delete({
      where: { id }
    });

    logger.info('Role deleted successfully', { roleId: id, name: existingRole.name });

    return sendSuccess(res, null, 'Role deleted successfully', 200);

  } catch (error) {
    const prismaError = handlePrismaError(error);
    return sendError(res, prismaError.message, prismaError.statusCode);
  }
};
