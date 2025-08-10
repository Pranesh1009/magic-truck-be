import { Request, Response } from 'express';
import { sendSuccess, sendError} from '../utils/response.util';
import { PrismaClient } from '@prisma/client';
import { handlePrismaError, PrismaError } from './../utils/prisma-error';
import { encrypt, compare } from '../utils/encryption';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async ( req: Request, res: Response ) => {
    try{

        const { name, emailId, aadharNumber, password, phoneNumber } = req.body;

        // Check if emailId, aadharNumber, phoneNumber already exists
        const existingUser = await prisma.customer.findFirst({
            where: {
                OR: [
                    { emailId },
                    { aadharNumber },
                    { phoneNumber }
                ]
            }
        });
        if(existingUser){
            let conflictField = '';

            if(existingUser.emailId == emailId) conflictField = 'Email ID';
            else if(existingUser.aadharNumber == aadharNumber) conflictField = 'Aadhar Number';
            else if(existingUser.phoneNumber == phoneNumber) conflictField = 'Phone Number';
            
            logger.warn('Registered User Already Exist', { conflictField });
            return sendError( res, 'Registered User Already Exist', 400);
        }

        // Hash password
        const hashedPassword = await encrypt(password);

        // Create Customer
        const customer = await prisma.customer.create({
            data: {
                name,
                emailId,
                aadharNumber,
                password : hashedPassword,
                phoneNumber
            }
        });

        // Generate token
        let token = '';
        try{
            token = await tokenGenerate( customer.emailId, customer.id );
        } catch( error ) {
            // Rollback: delete user
            await prisma.customer.delete({ where: { id: customer.id } });
            logger.error(' Failed to generate token', { error });
            return sendError( res, 'Failed to generate token', 500);
        }
        
        //Logs mechnaism
        logger.info('Customer registered successfully', { userId: customer.id });

        // Return Response with success
        return sendSuccess( res, {
            id: customer.id,
            name: customer.name,
            emailId: customer.emailId,
            aadharNumber: customer.aadharNumber,
            phoneNumber: customer.phoneNumber,
            token: token
        }, 'Customer Registered successfully', 201);

    } catch( error ) {

        // Return Response with Error
        const PrismaError = handlePrismaError(error);
        return sendError( res, PrismaError.message, PrismaError.statusCode);
    }
}

export const login = async ( req : Request, res: Response ) => {

    const { emailId, password } = req.body;

    // Checks the existing user
    const customer = await prisma.customer.findUnique({ where: { emailId } });
    if( !customer ){
        logger.error('Invalid Credentials', { emailId });
        return sendError(res, 'Invalid Credentials', 401);
    }

    // Validate password
    const isValidPassword = await compare(password, customer.password);
    if (!isValidPassword) {
      logger.warn('Login attempt with invalid password', { emailId });
      return sendError(res, 'Invalid credentials', 401);
    }

    // Generate token
    let token = '';
    try{
        token = await tokenGenerate( customer.emailId, customer.id );
    } catch ( error ){
        logger.error(' Failed to generate token', { error });
        return sendError( res, 'Failed to generate token', 500);
    }

    //Logs mechnaism
    logger.info('Logged In successfully', { userId: customer.id });

    // Return Response with success
    return sendSuccess( res, {
        id: customer.id,
        name: customer.name,
        emailId: customer.emailId,
        aadharNumber: customer.aadharNumber,
        phoneNumber: customer.phoneNumber,
        token: token
    }, 'Logged In successfully', 201);
}

const tokenGenerate = async ( emailId: string, id: string) => {

    // Gets JWT Token and expiresIn from .env file
    const jwtSecret = process.env.JWT_SECRET;
    if(!jwtSecret){
        throw new Error('JWT_SECRET is not defined');
    }
    const expiresIn = process.env.expireIn || '24h';

    // Jwt sign
    const token = jwt.sign(
        { id: id, email: emailId },
        jwtSecret,
        { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
    )

    return token;
}