import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

class DatabaseConnection {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance =
        globalThis.__prisma ||
        new PrismaClient({
          log:
            process.env.NODE_ENV === 'development'
              ? ['query', 'error', 'warn']
              : ['error'],
        });

      if (process.env.NODE_ENV !== 'production') {
        globalThis.__prisma = DatabaseConnection.instance;
      }
    }

    return DatabaseConnection.instance;
  }

  public static async disconnect(): Promise<void> {
    if (DatabaseConnection.instance) {
      await DatabaseConnection.instance.$disconnect();
    }
  }
}

export const prisma = DatabaseConnection.getInstance();
