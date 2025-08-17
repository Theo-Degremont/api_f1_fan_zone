import { FastifyInstance } from 'fastify';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  createRaceResult,
  getRaceResultsByRaceId,
  getRaceResultsByDriverId,
  getFinalRaceRanking,
  getDNFDrivers,
  updateRaceResult,
  deleteRaceResult,
  getRaceStats
} from '../controllers/raceResult.controller';

export default async function raceResultRoutes(fastify: FastifyInstance) {
  // Routes CRUD basiques
  fastify.post('/race-results', createRaceResult);
  fastify.put('/race-results/:id', updateRaceResult);
  fastify.delete('/race-results/:id', deleteRaceResult);
  
  // Routes sécurisées avec JWT - nécessitent un access token
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken);
    
    // Routes spécialisées
    fastify.get('/races/:raceId/results', getRaceResultsByRaceId);
    fastify.get('/races/:raceId/ranking', getFinalRaceRanking);
    fastify.get('/races/:raceId/dnf', getDNFDrivers);
    fastify.get('/races/:raceId/stats', getRaceStats);
    fastify.get('/drivers/:driverId/results', getRaceResultsByDriverId);
  });
}
