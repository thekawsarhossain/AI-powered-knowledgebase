import { CorsOptions } from 'cors';
import { config } from './environment';

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const allowedOrigins = config.corsOrigin.split(',').map(o => o.trim());

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
};
