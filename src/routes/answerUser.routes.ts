import { FastifyInstance } from 'fastify';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  answerDailyQuestion,
  getTotalVotesForQuestion,
  getVotesByAnswer,
  getUserDailyVote,
  getUserDailyVoteWithStats,
  getUserAnswers,
  getQuestionStats,
  getTodayQuestionStats
} from '../controllers/answerUser.controller';

export default async function answerUserRoutes(fastify: FastifyInstance) {
  
  // Toutes les routes protégées (avec authentification JWT)
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken);

    fastify.post('/daily-questions/answer', answerDailyQuestion);
    fastify.get('/daily-questions/my-answer', getUserDailyVoteWithStats);
    fastify.get('/daily-questions/answersDaily', getUserAnswers);
    fastify.get('/daily-questions/today/stats', getTodayQuestionStats);
    fastify.get('/daily-questions/:questionId/total-votes', getTotalVotesForQuestion);
    fastify.get('/daily-questions/:questionId/votes-by-answer', getVotesByAnswer);
    fastify.get('/daily-questions/:questionId/stats', getQuestionStats);
  });
}
