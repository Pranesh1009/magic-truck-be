import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { sendError } from '../utils/response.util';

const prisma = new PrismaClient();

// Extend the Request interface to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        roleId?: string;
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      logger.warn('Authentication failed: No token provided', {
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return sendError(res, 'Access token is required', 401);
    }

    // Verify the token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET is not defined in environment variables');
      return sendError(res, 'Server configuration error', 500);
    }

    const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;

    if (!decoded.id || !decoded.email) {
      logger.warn('Authentication failed: Invalid token payload', {
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return sendError(res, 'Invalid token', 401);
    }

    // Verify user still exists in database
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        roleId: true,
        isActive: true
      }
    });

    if (!user) {
      logger.warn('Authentication failed: User not found', {
        userId: decoded.id,
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return sendError(res, 'User not found', 401);
    }

    // Check if user is active (if isActive field exists)
    if (user.isActive === false) {
      logger.warn('Authentication failed: Inactive user', {
        userId: user.id,
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return sendError(res, 'Account is deactivated', 401);
    }

    // Add user information to request object
    req.user = {
      id: user.id,
      email: user.email,
      roleId: user.roleId || undefined
    };

    logger.info('Authentication successful', {
      userId: user.id,
      url: req.url,
      method: req.method,
      ip: req.ip
    });

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Authentication failed: Invalid token', {
        url: req.url,
        method: req.method,
        ip: req.ip,
        error: error.message
      });
      return sendError(res, 'Invalid token', 401);
    }

    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Authentication failed: Token expired', {
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return sendError(res, 'Token expired', 401);
    }

    logger.error('Authentication middleware error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      url: req.url,
      method: req.method,
      ip: req.ip
    });
    return sendError(res, 'Authentication failed', 500);
  }
};

// Optional middleware to check if user has specific role
export const requireRole = (requiredRoleId: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    if (req.user.roleId !== requiredRoleId) {
      logger.warn('Authorization failed: Insufficient role', {
        userId: req.user.id,
        userRoleId: req.user.roleId,
        requiredRoleId,
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return sendError(res, 'Insufficient permissions', 403);
    }

    logger.info('Role authorization successful', {
      userId: req.user.id,
      roleId: req.user.roleId,
      url: req.url,
      method: req.method,
      ip: req.ip
    });

    next();
  };
};

// Optional middleware to check if user has any of the specified roles
export const requireAnyRole = (allowedRoleIds: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    if (!req.user.roleId || !allowedRoleIds.includes(req.user.roleId)) {
      logger.warn('Authorization failed: Insufficient role', {
        userId: req.user.id,
        userRoleId: req.user.roleId,
        allowedRoleIds,
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return sendError(res, 'Insufficient permissions', 403);
    }

    logger.info('Role authorization successful', {
      userId: req.user.id,
      roleId: req.user.roleId,
      url: req.url,
      method: req.method,
      ip: req.ip
    });

    next();
  };
};
