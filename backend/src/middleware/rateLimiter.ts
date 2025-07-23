import rateLimit from 'express-rate-limit';

export const createRateLimiter = (windowMs: number, max: number, message?: string) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message: message || 'Too many requests from this IP, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

export const apiLimiter = createRateLimiter(
    15 * 60 * 1000,
    500,
    'Too many API requests from this IP, please try again later.'
);

export const authLimiter = createRateLimiter(
    15 * 60 * 1000,
    100,
    'Too many authentication attempts from this IP, please try again later.'
);
