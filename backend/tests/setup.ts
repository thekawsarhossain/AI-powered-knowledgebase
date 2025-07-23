import { prisma } from '../src/config/database';

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});

global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};
