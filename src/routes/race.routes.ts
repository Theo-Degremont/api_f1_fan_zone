import { FastifyInstance } from 'fastify';
import { authenticateToken } from '../middlewares/auth.middleware';
import * as RaceController from '../controllers/race.controller';

export default async function raceRoutes(fastify: FastifyInstance) {
  // Routes CRUD basiques
  fastify.post('/races', RaceController.createRace);
  fastify.put('/races/:id', RaceController.updateRace);
  fastify.delete('/races/:id', RaceController.deleteRace);
  
  // Routes publiques
  fastify.get('/races/next', RaceController.getNextRace);
  
  
  // Routes sécurisées avec JWT - nécessitent un access token
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken);
    fastify.get('/races', RaceController.getAllRaces);
    fastify.get('/races/:id', RaceController.getRaceById);
    fastify.get('/races/year/:year', RaceController.getRacesByYear);
  });
}
