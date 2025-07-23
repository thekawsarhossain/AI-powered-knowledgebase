import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsConfig } from './config/cors';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

import authRoutes from './modules/auth/routes/auth.routes';
import articleRoutes from './modules/articles/routes/article.routes';
import aiRoutes from './modules/ai/routes/ai.routes';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddleware(): void {
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                },
            },
        }));

        this.app.use(cors(corsConfig));

        this.app.use('/api/', apiLimiter);
        this.app.use('/api/auth', authLimiter);

        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        if (process.env.NODE_ENV === 'development') {
            this.app.use((req, res, next) => {
                logger.info(`${req.method} ${req.path}`, {
                    query: req.query,
                    body: Object.keys(req.body).length > 0 ? req.body : undefined
                });
                next();
            });
        }
    }

    private initializeRoutes(): void {
        this.app.get('/api/health', (req, res) => {
            res.status(200).json({
                success: true,
                message: 'Server is healthy',
                timestamp: new Date().toISOString(),
                version: process.env.npm_package_version || '1.0.0'
            });
        });

        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/articles', articleRoutes);
        this.app.use('/api/ai', aiRoutes);
    }

    private initializeErrorHandling(): void {
        this.app.use(notFoundHandler);
        this.app.use(errorHandler);
    }
}

export default new App().app;
