import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import mongoose from 'mongoose';
import env from './config/env';
import { PrismaClient } from '@prisma/client';
import { validateApiKey } from './middlewares/apiKey.middleware';

// Routes
import newsRoutes from './routes/news.routes';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import teamRoutes from './routes/team.routes';
import driverRoutes from './routes/driver.routes';
import raceRoutes from './routes/race.routes';

const prisma = new PrismaClient();
const app = Fastify({ logger: true });

app.register(fastifyCors);
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.addHook('preHandler', validateApiKey);

app.get('/health', async (request, reply) => {
  reply.send({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'F1 Fan Zone API is running' 
  });
});

app.register(newsRoutes, { prefix: '/api' });
app.register(userRoutes, { prefix: '/api' });
app.register(authRoutes, { prefix: '/api' });
app.register(teamRoutes, { prefix: '/api' });
app.register(driverRoutes, { prefix: '/api' });
app.register(raceRoutes, { prefix: '/api' });


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