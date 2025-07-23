import dotenv from 'dotenv';

dotenv.config();

interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  openaiApiKey: string;
  corsOrigin: string;
  databaseUrl: string;
}

class Environment {
  private static config: EnvironmentConfig;

  public static getConfig(): EnvironmentConfig {
    if (!Environment.config) {
      Environment.config = {
        port: parseInt(process.env.PORT || '8000'),
        nodeEnv: process.env.NODE_ENV || 'development',
        jwtSecret: Environment.getRequiredEnv('JWT_SECRET'),
        openaiApiKey: Environment.getRequiredEnv('OPENAI_API_KEY'),
        corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        databaseUrl: Environment.getRequiredEnv('DATABASE_URL'),
      };
    }

    return Environment.config;
  }

  private static getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Required environment variable ${key} is not set`);
    }
    return value;
  }

  public static isDevelopment(): boolean {
    return Environment.getConfig().nodeEnv === 'development';
  }

  public static isProduction(): boolean {
    return Environment.getConfig().nodeEnv === 'production';
  }
}

export const config = Environment.getConfig();
