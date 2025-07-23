import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { AuthPayload } from '../modules/auth/types/auth.types';

export interface AuthenticatedRequest<P = {}, ResBody = {}, ReqBody = {}, Query = {}> extends Request<P, ResBody, ReqBody, Query> {
    user?: AuthPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Access token required'
        });
        return;
    }

    jwt.verify(token, config.jwtSecret, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        req.user = user as AuthPayload;
        next();
    });
};
