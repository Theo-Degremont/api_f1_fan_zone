import { FastifyInstance } from 'fastify';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  createClassement,
  getAllClassements,
  getClassementById,
  getClassementBySeason,
  getAvailableSeasons,
  getSeasonStats,
  updateClassement,
  deleteClassement,
} from '../controllers/classementDriver.controller';

export default async function classementDriverRoutes(fastify: FastifyInstance) {
  // Routes CRUD sans JWT - API Key seulement
  fastify.post('/classements', createClassement);
  fastify.put('/classements/:id', updateClassement);
  fastify.delete('/classements/:id', deleteClassement);
  
  // Routes GET sécurisées avec JWT - nécessitent un access token
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken);
    fastify.get('/classements', getAllClassements);
    fastify.get('/classements/:id', getClassementById);
    fastify.get('/classements/season/:season', getClassementBySeason);
    fastify.get('/classements/seasons/available', getAvailableSeasons);
    fastify.get('/classements/season/:season/stats', getSeasonStats);
  });
}