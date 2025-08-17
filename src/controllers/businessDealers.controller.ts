import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.util';
import { PrismaClient } from '@prisma/client';
import { handlePrismaError } from '../utils/prisma-error';
import { encrypt } from '../utils/encryption';
import logger from '../utils/logger';

const prisma = new PrismaClient();

// Create business dealer with user account
export const createBusinessDealer = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      gst,
      gst_doc,
      other_doc = [],
      identity_doc = [],
      businessTypeId
    } = req.body;

    // Validate required fields
    if (!name || !email || !phoneNumber || !password || !gst || !businessTypeId) {
      logger.warn('Missing required fields for business dealer creation', {
        name, email, phoneNumber, gst, businessTypeId
      });
      return sendError(res, 'Name, email, phone number, password, GST, and business type are required', 400);
    }

    // Check if business type exists
    const businessType = await prisma.businessTypes.findUnique({
      where: { id: businessTypeId }
    });

    if (!businessType) {
      logger.warn('Business type not found', { businessTypeId });
      return sendError(res, 'Business type not found', 404);
    }

    // Check if dealer with same email or phone already exists
    const existingDealer = await prisma.businessDealers.findFirst({
      where: {
        OR: [
          { email },
          { phoneNumber }
        ]
      }
    });

    if (existingDealer) {
      let conflictField = '';
      if (existingDealer.email === email) conflictField = 'Email';
      else if (existingDealer.phoneNumber === phoneNumber) conflictField = 'Phone Number';

      logger.warn('Business dealer already exists', { conflictField });
      return sendError(res, `Business dealer with this ${conflictField.toLowerCase()} already exists`, 400);
    }

    // Check if user with same email or phone already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { phoneNumber }
        ]
      }
    });

    if (existingUser) {
      let conflictField = '';
      if (existingUser.email === email) conflictField = 'Email';
      else if (existingUser.phoneNumber === phoneNumber) conflictField = 'Phone Number';

      logger.warn('User already exists', { conflictField });
      return sendError(res, `User with this ${conflictField.toLowerCase()} already exists`, 400);
    }

    // Find or create dealer role
    let dealerRole = await prisma.role.findFirst({
      where: { name: 'dealer' }
    });

    if (!dealerRole) {
      dealerRole = await prisma.role.create({
        data: {
          name: 'dealer',
          description: 'Business dealer role with access to dealer-specific features'
        }
      });
      logger.info('Dealer role created', { roleId: dealerRole.id });
    }

    // Hash password
    const hashedPassword = await encrypt(password);

    // Create business dealer and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create business dealer
      const businessDealer = await tx.businessDealers.create({
        data: {
          name,
          email,
          phoneNumber,
          gst,
          gst_doc,
          other_doc,
          identity_doc,
          businessTypeId
        }
      });

      // Create user with dealer role
      const user = await tx.users.create({
        data: {
          name,
          email,
          phoneNumber,
          password: hashedPassword,
          roleId: dealerRole.id
        }
      });

      return { businessDealer, user };
    });

    logger.info('Business dealer onboarded successfully', {
      dealerId: result.businessDealer.id,
      userId: result.user.id
    });

    return sendSuccess(res, {
      businessDealer: {
        id: result.businessDealer.id,
        name: result.businessDealer.name,
        email: result.businessDealer.email,
        phoneNumber: result.businessDealer.phoneNumber,
        gst: result.businessDealer.gst,
        gst_doc: result.businessDealer.gst_doc,
        other_doc: result.businessDealer.other_doc,
        identity_doc: result.businessDealer.identity_doc,
        businessTypeId: result.businessDealer.businessTypeId,
        createdAt: result.businessDealer.createdAt,
        updatedAt: result.businessDealer.updatedAt
      },
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        phoneNumber: result.user.phoneNumber,
        roleId: result.user.roleId,
        createdAt: result.user.createdAt,
        updatedAt: result.user.updatedAt
      }
    }, 'Business dealer onboarded successfully', 201);

  } catch (error) {
    const prismaError = handlePrismaError(error);
    return sendError(res, prismaError.message, prismaError.statusCode);
  }
};

// Get all business dealers
export const getAllBusinessDealers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    // Get total count
    const total = await prisma.businessDealers.count();

    // Get business dealers with pagination and business type
    const businessDealers = await prisma.businessDealers.findMany({
      skip,
      take: limitNumber,
      include: {
        businessType: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate metadata
    const totalPages = Math.ceil(total / limitNumber);

    logger.info('Business dealers retrieved successfully', {
      total,
      page: pageNumber,
      limit: limitNumber
    });

    return sendSuccess(res,
      businessDealers.map(dealer => ({
        id: dealer.id,
        name: dealer.name,
        email: dealer.email,
        phoneNumber: dealer.phoneNumber,
        gst: dealer.gst,
        gst_doc: dealer.gst_doc,
        other_doc: dealer.other_doc,
        identity_doc: dealer.identity_doc,
        businessType: dealer.businessType,
        createdAt: dealer.createdAt,
        updatedAt: dealer.updatedAt
      })),
      'Business dealers retrieved successfully',
      200,
      {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages
      }
    );

  } catch (error) {
    const prismaError = handlePrismaError(error);
    return sendError(res, prismaError.message, prismaError.statusCode);
  }
};

// Get business dealer by ID
export const getBusinessDealerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const businessDealer = await prisma.businessDealers.findUnique({
      where: { id },
      include: {
        businessType: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    if (!businessDealer) {
      logger.warn('Business dealer not found', { dealerId: id });
      return sendError(res, 'Business dealer not found', 404);
    }

    logger.info('Business dealer retrieved successfully', { dealerId: id });

    return sendSuccess(res, {
      id: businessDealer.id,
      name: businessDealer.name,
      email: businessDealer.email,
      phoneNumber: businessDealer.phoneNumber,
      gst: businessDealer.gst,
      gst_doc: businessDealer.gst_doc,
      other_doc: businessDealer.other_doc,
      identity_doc: businessDealer.identity_doc,
      businessType: businessDealer.businessType,
      createdAt: businessDealer.createdAt,
      updatedAt: businessDealer.updatedAt
    }, 'Business dealer retrieved successfully', 200);

  } catch (error) {
    const prismaError = handlePrismaError(error);
    return sendError(res, prismaError.message, prismaError.statusCode);
  }
};

// Update business dealer
export const updateBusinessDealer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phoneNumber,
      gst,
      gst_doc,
      other_doc,
      identity_doc,
      businessTypeId
    } = req.body;

    // Check if business dealer exists
    const existingDealer = await prisma.businessDealers.findUnique({
      where: { id }
    });

    if (!existingDealer) {
      logger.warn('Business dealer not found for update', { dealerId: id });
      return sendError(res, 'Business dealer not found', 404);
    }

    // Check if business type exists (if being updated)
    if (businessTypeId) {
      const businessType = await prisma.businessTypes.findUnique({
        where: { id: businessTypeId }
      });

      if (!businessType) {
        logger.warn('Business type not found', { businessTypeId });
        return sendError(res, 'Business type not found', 404);
      }
    }

    // Check for conflicts with other dealers (if email or phone is being updated)
    if (email && email !== existingDealer.email) {
      const emailConflict = await prisma.businessDealers.findFirst({
        where: {
          email,
          id: { not: id }
        }
      });

      if (emailConflict) {
        logger.warn('Email already exists', { email });
        return sendError(res, 'Business dealer with this email already exists', 400);
      }
    }

    if (phoneNumber && phoneNumber !== existingDealer.phoneNumber) {
      const phoneConflict = await prisma.businessDealers.findFirst({
        where: {
          phoneNumber,
          id: { not: id }
        }
      });

      if (phoneConflict) {
        logger.warn('Phone number already exists', { phoneNumber });
        return sendError(res, 'Business dealer with this phone number already exists', 400);
      }
    }

    // Update business dealer
    const updatedDealer = await prisma.businessDealers.update({
      where: { id },
      data: {
        name: name || existingDealer.name,
        email: email || existingDealer.email,
        phoneNumber: phoneNumber || existingDealer.phoneNumber,
        gst: gst || existingDealer.gst,
        gst_doc: gst_doc || existingDealer.gst_doc,
        other_doc: other_doc || existingDealer.other_doc,
        identity_doc: identity_doc || existingDealer.identity_doc,
        businessTypeId: businessTypeId || existingDealer.businessTypeId
      },
      include: {
        businessType: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    logger.info('Business dealer updated successfully', { dealerId: id });

    return sendSuccess(res, {
      id: updatedDealer.id,
      name: updatedDealer.name,
      email: updatedDealer.email,
      phoneNumber: updatedDealer.phoneNumber,
      gst: updatedDealer.gst,
      gst_doc: updatedDealer.gst_doc,
      other_doc: updatedDealer.other_doc,
      identity_doc: updatedDealer.identity_doc,
      businessType: updatedDealer.businessType,
      createdAt: updatedDealer.createdAt,
      updatedAt: updatedDealer.updatedAt
    }, 'Business dealer updated successfully', 200);

  } catch (error) {
    const prismaError = handlePrismaError(error);
    return sendError(res, prismaError.message, prismaError.statusCode);
  }
};

// Delete business dealer
export const deleteBusinessDealer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if business dealer exists
    const existingDealer = await prisma.businessDealers.findUnique({
      where: { id }
    });

    if (!existingDealer) {
      logger.warn('Business dealer not found for deletion', { dealerId: id });
      return sendError(res, 'Business dealer not found', 404);
    }

    // Delete business dealer
    await prisma.businessDealers.delete({
      where: { id }
    });

    logger.info('Business dealer deleted successfully', { dealerId: id });

    return sendSuccess(res, null, 'Business dealer deleted successfully', 200);

  } catch (error) {
    const prismaError = handlePrismaError(error);
    return sendError(res, prismaError.message, prismaError.statusCode);
  }
};
