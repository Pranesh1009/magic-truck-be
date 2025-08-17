import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import logger from './utils/logger';
import authRoutes from './routes/auth.routes';
import roleRoutes from './routes/role.routes';
import businessTypesRoutes from './routes/businessTypes.routes';
import businessDealersRoutes from './routes/businessDealers.routes';
import shipmentRoutes from './routes/shipment.routes'
import { authenticateToken } from './middlewares/auth.middleware';

// Dot environment gets the required variable from .env file
dotenv.config();

const prisma = new PrismaClient();

//Test Database Connection
prisma.$connect()
    .then(() => {
        logger.info('Database Connection established successfully');
    })
    .catch((error: Error) => {
        logger.error('Failed to connect to database', { error });
        process.exit(1);
    });

const app = express();

//Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Logs each incoming API METHOD, URL, IP-ADDRESS
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.url}`, {
        method: req.method,
        url: req.url,
        ip: req.ip
    });
    next();
});

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
    try {
        // Check database connection
        const result = await prisma.$queryRaw`SELECT 1`;
        logger.info('Health check success');
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                database: 'connected',
                server: 'running'
            }
        });
    } catch (error) {
        logger.error('Health check failed', { error });
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            services: {
                database: 'disconnected',
                server: 'running'
            },
            error: 'Database connection falied'
        });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/role', authenticateToken, roleRoutes);
app.use('/api/business-types', businessTypesRoutes);
app.use('/api/business-dealers', businessDealersRoutes);
app.use('/api/shipments', shipmentRoutes);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Unhandled error', { error: err.stack });
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received. Closing database connection...');
    await prisma.$disconnect();
    process.exit(0);
});