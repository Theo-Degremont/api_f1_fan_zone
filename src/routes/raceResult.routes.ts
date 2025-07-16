import { FastifyInstance } from 'fastify';
import { validateApiKey } from '../middlewares/apiKey.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  createRaceResult,
  getAllRaceResults,
  getRaceResultById,
  getRaceResultsByRaceId,
  getRaceResultsByDriverId,
  getFinalRaceRanking,
  getDNFDrivers,
  updateRaceResult,
  deleteRaceResult,
  getRaceStats
} from '../controllers/raceResult.controller';

export default async function raceResultRoutes(fastify: FastifyInstance) {
  // Apply API key validation to all routes
  fastify.addHook('preHandler', validateApiKey);
  
  // Routes CRUD basiques
  fastify.post('/race-results', createRaceResult);
  fastify.put('/race-results/:id', updateRaceResult);
  fastify.delete('/race-results/:id', deleteRaceResult);
  
  // Routes sécurisées avec JWT - nécessitent un access token
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken);
    
    // Routes de lecture
    fastify.get('/race-results', getAllRaceResults);
    fastify.get('/race-results/:id', getRaceResultById);
    
    // Routes spécialisées
    fastify.get('/races/:raceId/results', getRaceResultsByRaceId);
    fastify.get('/races/:raceId/ranking', getFinalRaceRanking);
    fastify.get('/races/:raceId/dnf', getDNFDrivers);
    fastify.get('/races/:raceId/stats', getRaceStats);
    fastify.get('/drivers/:driverId/results', getRaceResultsByDriverId);
  });
}
