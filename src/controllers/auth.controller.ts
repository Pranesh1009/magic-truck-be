import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.util';
import { PrismaClient } from '@prisma/client';
import { handlePrismaError, PrismaError } from './../utils/prisma-error';
import { encrypt, compare } from '../utils/encryption';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    try {

        const { name, email, password, phoneNumber, roleId } = req.body;

        // Check if email and phoneNumber already exists
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

            if (existingUser.email == email) conflictField = 'Email';
            else if (existingUser.phoneNumber == phoneNumber) conflictField = 'Phone Number';

            logger.warn('Registered User Already Exist', { conflictField });
            return sendError(res, 'Registered User Already Exist', 400);
        }

        // Hash password
        const hashedPassword = await encrypt(password);

        // Create User
        const user = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phoneNumber,
                roleId
            }
        });

        // Generate token
        let token = '';
        try {
            token = await tokenGenerate(user.email, user.id);
        } catch (error) {
            // Rollback: delete user
            await prisma.users.delete({ where: { id: user.id } });
            logger.error(' Failed to generate token', { error });
            return sendError(res, 'Failed to generate token', 500);
        }

        //Logs mechnaism
        logger.info('User registered successfully', { userId: user.id });

        // Return Response with success
        return sendSuccess(res, {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            roleId: user.roleId,
            token: token
        }, 'User Registered successfully', 201);

    } catch (error) {

        // Return Response with Error
        const PrismaError = handlePrismaError(error);
        return sendError(res, PrismaError.message, PrismaError.statusCode);
    }
}

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    // Checks the existing user
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
        logger.error('Invalid Credentials', { email });
        return sendError(res, 'Invalid Credentials', 401);
    }

    // Validate password
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
        logger.warn('Login attempt with invalid password', { email });
        return sendError(res, 'Invalid credentials', 401);
    }

    // Generate token
    let token = '';
    try {
        token = await tokenGenerate(user.email, user.id);
    } catch (error) {
        logger.error(' Failed to generate token', { error });
        return sendError(res, 'Failed to generate token', 500);
    }

    //Logs mechnaism
    logger.info('Logged In successfully', { userId: user.id });

    // Return Response with success
    return sendSuccess(res, {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        roleId: user.roleId,
        token: token
    }, 'Logged In successfully', 201);
}

const tokenGenerate = async (email: string, id: string) => {

    // Gets JWT Token and expiresIn from .env file
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
    }
    const expiresIn = process.env.expireIn || '24h';

    // Jwt sign
    const token = jwt.sign(
        { id: id, email: email },
        jwtSecret,
        { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
    )

    return token;
}