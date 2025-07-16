import { FastifyInstance } from 'fastify';
import * as dailyQuestionsController from '../controllers/daily_questions.controller';

export default async function dailyQuestionsRoutes(fastify: FastifyInstance) {
  fastify.get('/daily-questions', dailyQuestionsController.getAllDailyQuestions);
  fastify.get('/daily-questions/:id', dailyQuestionsController.getDailyQuestionById);
  fastify.post('/daily-questions', dailyQuestionsController.createDailyQuestion);
  fastify.put('/daily-questions/:id', dailyQuestionsController.updateDailyQuestion);
}