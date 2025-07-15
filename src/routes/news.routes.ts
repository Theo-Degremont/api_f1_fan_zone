import { FastifyInstance } from 'fastify';
import * as newsController from '../controllers/news.controller';

export default async function newsRoutes(fastify: FastifyInstance) {
  fastify.get('/news', newsController.getAllNews);
  fastify.get('/news/:id', newsController.getNewsById);
  fastify.post('/news', newsController.createNews);
  fastify.put('/news/:id', newsController.updateNews);
}