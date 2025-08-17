import { FastifyInstance } from 'fastify';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  createClassement,
  getClassementBySeason,
  getSeasonStats,
  getTeamPosition,
  updateClassement,
  deleteClassement,
} from '../controllers/classementTeam.controller';

export default async function classementTeamRoutes(fastify: FastifyInstance) {
  // Routes CRUD sans JWT - API Key seulement
  fastify.post('/classements-teams', createClassement);
  fastify.put('/classements-teams/:id', updateClassement);
  fastify.delete('/classements-teams/:id', deleteClassement);
  
  // Routes GET sécurisées avec JWT - nécessitent un access token
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken);
    fastify.get('/classements-teams/season/:season', getClassementBySeason);
    fastify.get('/classements-teams/season/:season/stats', getSeasonStats);
    fastify.get('/classements-teams/team/:teamId/season/:season', getTeamPosition);
  
  });
}