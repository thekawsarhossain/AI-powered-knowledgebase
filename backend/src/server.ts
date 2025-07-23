import app from './app';
import { config } from './config/environment';
import { prisma } from './config/database';
import { logger } from './utils/logger';

class Server {
  private server?: any;

  async start(): Promise<void> {
    try {
      await this.connectDatabase();

      this.server = app.listen(config.port, () => {
        logger.info(`🚀 Server running on port ${config.port}`);
        logger.info(`📱 Environment: ${config.nodeEnv}`);
        logger.info(`🌐 CORS Origin: ${config.corsOrigin}`);
        logger.info(`⚡ Server ready to accept connections`);
      });

      this.server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          logger.error(`Port ${config.port} is already in use`);
        } else {
          logger.error('Server error:', error);
        }
        process.exit(1);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async connectDatabase(): Promise<void> {
    try {
      await prisma.$connect();
      logger.info('✅ Database connected successfully');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    logger.info('🛑 Shutting down server...');

    if (this.server) {
      this.server.close(() => {
        logger.info('✅ Server closed');
      });
    }

    await prisma.$disconnect();
    logger.info('✅ Database disconnected');
  }
}

const server = new Server();

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await server.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await server.stop();
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

server.start();
