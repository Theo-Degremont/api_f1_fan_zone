import { FastifyInstance } from 'fastify';
import { authenticateToken } from '../middlewares/auth.middleware';
import * as dailyQuestionsController from '../controllers/daily_questions.controller';

export default async function dailyQuestionsRoutes(fastify: FastifyInstance) {

    fastify.put('/daily-questions/:id', dailyQuestionsController.updateDailyQuestion);
    fastify.post('/daily-questions', dailyQuestionsController.createDailyQuestion);
    fastify.get('/daily-questions', dailyQuestionsController.getAllDailyQuestions);

  // Toutes les routes daily-questions nécessitent une authentification JWT
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken);
    fastify.get('/daily-questions/today', dailyQuestionsController.getTodayQuestion);
  });
}