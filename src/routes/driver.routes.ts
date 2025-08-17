import { FastifyInstance } from 'fastify';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  assignDriverToTeam,
  removeDriverFromTeam,
} from '../controllers/driver.controller';

export default async function driverRoutes(fastify: FastifyInstance) {
  // Routes CRUD basiques
  fastify.post('/drivers', createDriver);
  fastify.get('/drivers', getAllDrivers);
  fastify.put('/drivers/:id', updateDriver);
  fastify.delete('/drivers/:id', deleteDriver);
  
  // Route sécurisée avec JWT - nécessite un access token
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken);
    fastify.get('/drivers/:id', getDriverById);
  });
  
  // Routes spécifiques pour la gestion des équipes
  fastify.post('/drivers/:id/assign-team', assignDriverToTeam);
  fastify.post('/drivers/:id/remove-team', removeDriverFromTeam);
}
