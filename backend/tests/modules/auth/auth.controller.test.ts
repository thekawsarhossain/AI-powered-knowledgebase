import request from 'supertest';
import app from '../../../src/app';
import { prisma } from '../../../src/config/database';

describe('Auth Controller', () => {
    beforeEach(async () => {
        await prisma.user.deleteMany({
            where: {
                email: {
                    in: [
                        'test@example.com',
                        'test-existing@example.com',
                        'test-invalid@example.com',
                        'test-login@example.com'
                    ]
                }
            }
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(userData.email);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.password).toBeUndefined();
        });

        it('should return 400 if user already exists', async () => {
            const userData = {
                email: 'test-existing@example.com',
                password: 'password123'
            };

            await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('already exists');
        });

        it('should return 400 for invalid email', async () => {
            const userData = {
                email: 'invalid-email',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return 400 for short password', async () => {
            const userData = {
                email: 'test-invalid@example.com',
                password: '123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test-login@example.com',
                    password: 'password123'
                });
        });

        it('should login successfully with valid credentials', async () => {
            const loginData = {
                email: 'test-login@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(loginData.email);
            expect(response.body.data.token).toBeDefined();
        });

        it('should return 401 for invalid email', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid email or password');
        });

        it('should return 401 for invalid password', async () => {
            const loginData = {
                email: 'test-login@example.com',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid email or password');
        });
    });
});
