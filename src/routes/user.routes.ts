import { FastifyInstance } from 'fastify';
import * as userController from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users', userController.getUsers);
  fastify.post('/users', userController.createUser);

  fastify.get('/me', { preHandler: authenticateToken }, userController.getMyProfile);
  fastify.put('/me', { preHandler: authenticateToken }, userController.updateMyProfile as any);
  fastify.delete('/me', { preHandler: authenticateToken }, userController.deleteMyProfile);
}