import { FastifyInstance } from 'fastify';
import * as userController from '../controllers/user.controller';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users', userController.getUsers);
  fastify.get('/users/:id', userController.getUserById);
  fastify.post('/users', userController.createUser);
  fastify.put('/users/:id', userController.updateUser);
  fastify.delete('/users/:id', userController.deleteUser);
}