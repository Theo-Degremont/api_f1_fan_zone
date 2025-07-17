import { FastifyInstance } from 'fastify';
import { validateApiKey } from '../middlewares/apiKey.middleware';
import {
  getLogsByDate,
  getLogsByUser,
  getLogsByEmail,
  getLogsByAction,
  getDayStats,
  getRecentLogs
} from '../controllers/authLog.controller';

export default async function authLogRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', validateApiKey);
  
  fastify.get('/auth-logs/date/:date', getLogsByDate);
  fastify.get('/auth-logs/stats/:date', getDayStats);
  fastify.get('/auth-logs/user/:userId', getLogsByUser);
  fastify.get('/auth-logs/email/:email', getLogsByEmail);
  fastify.get('/auth-logs/action/:action', getLogsByAction);
  fastify.get('/auth-logs/recent', getRecentLogs);
}
