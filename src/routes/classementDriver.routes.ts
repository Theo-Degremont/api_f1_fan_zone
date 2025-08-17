import { FastifyInstance } from 'fastify';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  createClassement,
  getClassementBySeason,
  getSeasonStats,
  updateClassement,
  deleteClassement,
} from '../controllers/classementDriver.controller';

export default async function classementDriverRoutes(fastify: FastifyInstance) {
  // Routes CRUD sans JWT - API Key seulement
  fastify.post('/classements-drivers', createClassement);
  fastify.put('/classements-drivers/:id', updateClassement);
  fastify.delete('/classements-drivers/:id', deleteClassement);
  
  // Routes GET sécurisées avec JWT - nécessitent un access token
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken);
    fastify.get('/classements-drivers/season/:season', getClassementBySeason);
    fastify.get('/classements-drivers/season/:season/stats', getSeasonStats);
  });
}