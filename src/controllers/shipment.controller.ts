import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response.util';
import { GoogleMapsService, ShipmentCostRequest } from '../services/googleMaps.service';
import { z, ZodError } from 'zod';

const prisma = new PrismaClient();
const googleMapsService = new GoogleMapsService();

// Validation schemas
const createShipmentSchema = z.object({
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  pickupAddress: z.string().min(1, 'Pickup address is required'),
  dropAddress: z.string().min(1, 'Drop address is required'),
  commodity: z.string().min(1, 'Commodity is required'),
  weight: z.string().min(1, 'Weight is required'),
  specialInstructions: z.string().optional(),
  pickupContactName: z.string().min(1, 'Pickup contact name is required'),
  pickupContactNumber: z.string().min(1, 'Pickup contact number is required'),
  dropContactName: z.string().min(1, 'Drop contact name is required'),
  dropContactNumber: z.string().min(1, 'Drop contact number is required'),
  addOns: z.array(z.string()).optional(),
  pickupDate: z.string().optional(),
  dropDate: z.string().optional(),
  pickupTime: z.string().optional(),
  dropTime: z.string().optional(),
  truckOption: z.string().optional(),
});

const calculateCostSchema = z.object({
  pickupAddress: z.string().min(1, 'Pickup address is required'),
  dropAddress: z.string().min(1, 'Drop address is required'),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  weight: z.number().positive('Weight must be positive'),
  commodity: z.string().optional(),
  addOns: z.array(z.string()).optional(),
});

/**
 * Create a new shipment
 */
export const createShipment = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = createShipmentSchema.parse(req.body);

    // Calculate shipment cost
    const costRequest: ShipmentCostRequest = {
      pickupLocation: { address: validatedData.pickupAddress },
      dropLocation: { address: validatedData.dropAddress },
      vehicleType: validatedData.vehicleType,
      weight: parseFloat(validatedData.weight),
      commodity: validatedData.commodity,
      addOns: validatedData.addOns,
    };

    const costCalculation = await googleMapsService.calculateShipmentCost(costRequest);

    // Create shipment in database
    const shipment = await prisma.shipmentDetails.create({
      data: {
        vehicleType: validatedData.vehicleType,
        pickupAddress: validatedData.pickupAddress,
        dropAddress: validatedData.dropAddress,
        commodity: validatedData.commodity,
        weight: validatedData.weight,
        specialInstructions: validatedData.specialInstructions || '',
        pickupContactName: validatedData.pickupContactName,
        pickupContactNumber: validatedData.pickupContactNumber,
        dropContactName: validatedData.dropContactName,
        dropContactNumber: validatedData.dropContactNumber,
        addOns: validatedData.addOns || [],
        pickupDate: validatedData.pickupDate ? new Date(validatedData.pickupDate) : null,
        dropDate: validatedData.dropDate ? new Date(validatedData.dropDate) : null,
        pickupTime: validatedData.pickupTime || null,
        dropTime: validatedData.dropTime || null,
        truckOption: validatedData.truckOption || null,
        userId: req.user.id,
      },
    });

    return sendSuccess(res, {
      shipment,
      costCalculation,
    }, 'Shipment created successfully', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(res, `Validation error: ${error.issues[0]?.message || 'Invalid data'}`, 400);
    }

    console.error('Error creating shipment:', error);
    return sendError(res, 'Failed to create shipment', 500);
  }
};

/**
 * Calculate shipment cost without creating shipment
 */
export const calculateShipmentCost = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = calculateCostSchema.parse(req.body);

    const costRequest: ShipmentCostRequest = {
      pickupLocation: { address: validatedData.pickupAddress },
      dropLocation: { address: validatedData.dropAddress },
      vehicleType: validatedData.vehicleType,
      weight: validatedData.weight,
      commodity: validatedData.commodity,
      addOns: validatedData.addOns,
    };

    const costCalculation = await googleMapsService.calculateShipmentCost(costRequest);

    return sendSuccess(res, costCalculation, 'Cost calculation completed successfully');
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(res, `Validation error: ${error.issues[0]?.message || 'Invalid data'}`, 400);
    }

    console.error('Error calculating shipment cost:', error);
    return sendError(res, 'Failed to calculate shipment cost', 500);
  }
};

/**
 * Get all shipments
 */
export const getAllShipments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [shipments, total] = await Promise.all([
      prisma.shipmentDetails.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.shipmentDetails.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return sendSuccess(res, shipments, 'Shipments retrieved successfully', 200, {
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error('Error retrieving shipments:', error);
    return sendError(res, 'Failed to retrieve shipments', 500);
  }
};

/**
 * Get shipment by ID
 */
export const getShipmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const shipment = await prisma.shipmentDetails.findUnique({
      where: { id },
    });

    if (!shipment) {
      return sendError(res, 'Shipment not found', 404);
    }

    return sendSuccess(res, shipment, 'Shipment retrieved successfully');
  } catch (error) {
    console.error('Error retrieving shipment:', error);
    return sendError(res, 'Failed to retrieve shipment', 500);
  }
};

/**
 * Update shipment
 */
export const updateShipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = createShipmentSchema.partial().parse(req.body);

    // Check if shipment exists
    const existingShipment = await prisma.shipmentDetails.findUnique({
      where: { id },
    });

    if (!existingShipment) {
      return sendError(res, 'Shipment not found', 404);
    }

    // Update shipment
    const updatedShipment = await prisma.shipmentDetails.update({
      where: { id },
      data: validatedData,
    });

    return sendSuccess(res, updatedShipment, 'Shipment updated successfully');
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(res, `Validation error: ${error.issues[0]?.message || 'Invalid data'}`, 400);
    }

    console.error('Error updating shipment:', error);
    return sendError(res, 'Failed to update shipment', 500);
  }
};

/**
 * Delete shipment
 */
export const deleteShipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if shipment exists
    const existingShipment = await prisma.shipmentDetails.findUnique({
      where: { id },
    });

    if (!existingShipment) {
      return sendError(res, 'Shipment not found', 404);
    }

    // Delete shipment
    await prisma.shipmentDetails.delete({
      where: { id },
    });

    return sendSuccess(res, null, 'Shipment deleted successfully');
  } catch (error) {
    console.error('Error deleting shipment:', error);
    return sendError(res, 'Failed to delete shipment', 500);
  }
};

/**
 * Get distance and duration between two locations
 */
export const getDistanceAndDuration = async (req: Request, res: Response) => {
  try {
    const { pickupAddress, dropAddress } = req.query;

    if (!pickupAddress || !dropAddress) {
      return sendError(res, 'Pickup and drop addresses are required', 400);
    }

    const result = await googleMapsService.calculateDistanceAndDuration(
      { address: pickupAddress as string },
      { address: dropAddress as string }
    );

    return sendSuccess(res, result, 'Distance and duration calculated successfully');
  } catch (error) {
    console.error('Error calculating distance and duration:', error);
    return sendError(res, 'Failed to calculate distance and duration', 500);
  }
};
