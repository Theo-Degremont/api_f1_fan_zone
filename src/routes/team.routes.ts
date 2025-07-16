// src/routes/team.routes.ts
import { FastifyInstance } from 'fastify';
import * as teamController from '../controllers/team.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

export default async function teamRoutes(fastify: FastifyInstance) {
  // Routes publiques - nécessitent seulement la clé API
  fastify.get('/teams', teamController.getAllTeams);
  fastify.post('/teams', teamController.createTeam);
  fastify.put('/teams/:id', teamController.updateTeam as any);
  fastify.delete('/teams/:id', teamController.deleteTeam as any);
  
  // Route sécurisée - nécessite un access token
  fastify.get('/teams/:id', { preHandler: authenticateToken }, teamController.getTeamById as any);
}
