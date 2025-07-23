import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginInput, RegisterInput } from '../schemas/auth.schema';

export class AuthController {
    private authService: AuthService;

    constructor(authService?: AuthService) {
        this.authService = authService || new AuthService();
    }

    register = async (req: Request<{}, {}, RegisterInput>, res: Response): Promise<void> => {
        try {
            const result = await this.authService.register(req.body);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Registration failed'
            });
        }
    };

    login = async (req: Request<{}, {}, LoginInput>, res: Response): Promise<void> => {
        try {
            const result = await this.authService.login(req.body);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: error.message || 'Login failed'
            });
        }
    };

    validateToken = async (req: Request, res: Response): Promise<void> => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No token provided'
            });
            return;
        }

        try {
            const payload = await this.authService.validateToken(token);
            res.status(200).json({
                success: true,
                data: { valid: true, payload }
            });
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    };
}
