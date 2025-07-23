import { prisma } from '../../../config/database';
import { User, UserWithPassword } from '../types/auth.types';

export interface IUserRepository {
    findByEmail(email: string): Promise<UserWithPassword | null>;
    findById(id: string): Promise<User | null>;
    create(email: string, hashedPassword: string): Promise<User>;
    existsByEmail(email: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<UserWithPassword | null> {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    async findById(id: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    async create(email: string, hashedPassword: string): Promise<User> {
        return await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    async existsByEmail(email: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true }
        });
        return !!user;
    }
}
