import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.util';
import { PrismaClient } from '@prisma/client';
import { handlePrismaError, PrismaError } from './../utils/prisma-error';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export const createBusinessType = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    // Check if business type with the same name already exists
    const existingBusinessType = await prisma.businessTypes.findFirst({
      where: { name }
    });

    if (existingBusinessType) {
      logger.warn('Business type already exists', { name });
      return sendError(res, 'Business type with this name already exists', 400);
    }

    // Create business type
    const businessType = await prisma.businessTypes.create({
      data: {
        name,
        description
      }
    });

    // Log mechanism
    logger.info('Business type created successfully', { businessTypeId: businessType.id });

    // Return response with success
    return sendSuccess(res, {
      id: businessType.id,
      name: businessType.name,
      description: businessType.description,
      createdAt: businessType.createdAt,
      updatedAt: businessType.updatedAt
    }, 'Business type created successfully', 201);

  } catch (error) {
    // Return response with error
    const PrismaError = handlePrismaError(error);
    return sendError(res, PrismaError.message, PrismaError.statusCode);
  }
};

export const updateBusinessType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if business type exists
    const existingBusinessType = await prisma.businessTypes.findUnique({
      where: { id }
    });

    if (!existingBusinessType) {
      logger.warn('Business type not found', { id });
      return sendError(res, 'Business type not found', 404);
    }

    // Check if name is being updated and if it conflicts with another business type
    if (name && name !== existingBusinessType.name) {
      const nameConflict = await prisma.businessTypes.findFirst({
        where: {
          name,
          id: { not: id }
        }
      });

      if (nameConflict) {
        logger.warn('Business type name already exists', { name });
        return sendError(res, 'Business type with this name already exists', 400);
      }
    }

    // Update business type
    const updatedBusinessType = await prisma.businessTypes.update({
      where: { id },
      data: {
        name: name || existingBusinessType.name,
        description: description || existingBusinessType.description
      }
    });

    // Log mechanism
    logger.info('Business type updated successfully', { businessTypeId: id });

    // Return response with success
    return sendSuccess(res, {
      id: updatedBusinessType.id,
      name: updatedBusinessType.name,
      description: updatedBusinessType.description,
      createdAt: updatedBusinessType.createdAt,
      updatedAt: updatedBusinessType.updatedAt
    }, 'Business type updated successfully', 200);

  } catch (error) {
    // Return response with error
    const PrismaError = handlePrismaError(error);
    return sendError(res, PrismaError.message, PrismaError.statusCode);
  }
};

export const deleteBusinessType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if business type exists
    const existingBusinessType = await prisma.businessTypes.findUnique({
      where: { id }
    });

    if (!existingBusinessType) {
      logger.warn('Business type not found', { id });
      return sendError(res, 'Business type not found', 404);
    }

    // Delete business type
    await prisma.businessTypes.delete({
      where: { id }
    });

    // Log mechanism
    logger.info('Business type deleted successfully', { businessTypeId: id });

    // Return response with success
    return sendSuccess(res, null, 'Business type deleted successfully', 200);

  } catch (error) {
    // Return response with error
    const PrismaError = handlePrismaError(error);
    return sendError(res, PrismaError.message, PrismaError.statusCode);
  }
};

export const getBusinessType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get business type
    const businessType = await prisma.businessTypes.findUnique({
      where: { id }
    });

    if (!businessType) {
      logger.warn('Business type not found', { id });
      return sendError(res, 'Business type not found', 404);
    }

    // Return response with success
    return sendSuccess(res, {
      id: businessType.id,
      name: businessType.name,
      description: businessType.description,
      createdAt: businessType.createdAt,
      updatedAt: businessType.updatedAt
    }, 'Business type retrieved successfully', 200);

  } catch (error) {
    // Return response with error
    const PrismaError = handlePrismaError(error);
    return sendError(res, PrismaError.message, PrismaError.statusCode);
  }
};

export const getAllBusinessTypes = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    // Get total count
    const total = await prisma.businessTypes.count();

    // Get business types with pagination
    const businessTypes = await prisma.businessTypes.findMany({
      skip,
      take: limitNumber,
      orderBy: { createdAt: 'desc' }
    });

    // Calculate metadata
    const totalPages = Math.ceil(total / limitNumber);

    // Log mechanism
    logger.info('Business types retrieved successfully', {
      total,
      page: pageNumber,
      limit: limitNumber
    });

    // Return response with success
    return sendSuccess(res,
      businessTypes.map(bt => ({
        id: bt.id,
        name: bt.name,
        description: bt.description,
        createdAt: bt.createdAt,
        updatedAt: bt.updatedAt
      })),
      'Business types retrieved successfully',
      200,
      {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages
      }
    );

  } catch (error) {
    // Return response with error
    const PrismaError = handlePrismaError(error);
    return sendError(res, PrismaError.message, PrismaError.statusCode);
  }
};
