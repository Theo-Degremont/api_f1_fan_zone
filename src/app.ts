import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import mongoose from 'mongoose';
import env from './config/env';
import { PrismaClient } from '@prisma/client';

// Routes
import newsRoutes from './routes/news.routes';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

const prisma = new PrismaClient();
const app = Fastify({ logger: true });

// Register plugins
app.register(fastifyCors);
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

// Register routes
app.register(newsRoutes);
app.register(userRoutes, { prefix: '/api' });
app.register(authRoutes, { prefix: '/api' });

// Connect to MongoDB
const connectMongo = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    app.log.info('✅ Connected to MongoDB');
  } catch (err) {
    app.log.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

// Connect to PostgreSQL (Prisma)
const connectPostgres = async () => {
  try {
    await prisma.$connect();
    app.log.info('✅ Connected to PostgreSQL');
  } catch (err) {
    app.log.error('❌ PostgreSQL connection error:', err);
    process.exit(1);
  }
};

export const startApp = async () => {
  await connectMongo();
  await connectPostgres();
  return app;
};