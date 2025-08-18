import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import mongoose from 'mongoose';
import env from './config/env';
import { PrismaClient } from '@prisma/client';
import { validateApiKey } from './middlewares/apiKey.middleware';

// Routes
import newsRoutes from './routes/news.routes';
import dailyQuestionsRoutes from './routes/daily_questions.routes';
import answerUserRoutes from './routes/answerUser.routes';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import authLogRoutes from './routes/authLog.routes';
import teamRoutes from './routes/team.routes';
import driverRoutes from './routes/driver.routes';
import raceRoutes from './routes/race.routes';
import raceResultRoutes from './routes/raceResult.routes';
import classementDriverRoutes from './routes/classementDriver.routes';
import classementTeamRoutes from './routes/classementTeam.routes';
import gameScoreRoutes from './routes/gameScore.routes';

const prisma = new PrismaClient();
const app = Fastify({ logger: true });

// Configuration Swagger
app.register(swagger, {
  openapi: {
    info: {
      title: 'F1 Fan Zone API',
      description: 'API complète pour l\'application F1 Fan Zone - Gestion des pilotes, équipes, courses et classements',
      version: '1.0.0',
      contact: {
        name: 'F1 Fan Zone Team',
        email: 'contact@f1fanzone.com'
      }
    },
    servers: [
      { url: 'http://localhost:3002', description: 'Serveur de développement' },
      { url: 'https://api.f1fanzone.com', description: 'Serveur de production' }
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'X-API-Key',
          in: 'header',
          description: 'Clé API requise pour tous les endpoints'
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT pour les endpoints sécurisés'
        }
      }
    },
    security: [
      { apiKey: [] }
    ]
  }
});

app.register(swaggerUi, {
  routePrefix: '/api/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  }
});

app.register(fastifyCors, {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://f1fanzone.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
});
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
app.register(dailyQuestionsRoutes, { prefix: '/api' });
app.register(answerUserRoutes, { prefix: '/api' });
app.register(userRoutes, { prefix: '/api' });
app.register(authRoutes, { prefix: '/api' });
app.register(authLogRoutes, { prefix: '/api' });
app.register(teamRoutes, { prefix: '/api' });
app.register(driverRoutes, { prefix: '/api' });
app.register(raceRoutes, { prefix: '/api' });
app.register(raceResultRoutes, { prefix: '/api' });
app.register(classementDriverRoutes, { prefix: '/api' });
app.register(classementTeamRoutes, { prefix: '/api' });
app.register(gameScoreRoutes, { prefix: '/api' });


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