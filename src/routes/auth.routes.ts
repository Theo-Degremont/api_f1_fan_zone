import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth.controller';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/register', authController.register);
  fastify.post('/auth/login', authController.login);
  fastify.post('/auth/refresh', authController.refreshToken);
}