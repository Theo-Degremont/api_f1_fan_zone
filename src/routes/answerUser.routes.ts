import { FastifyInstance } from 'fastify';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  answerDailyQuestion,
  getTotalVotesForQuestion,
  getVotesByAnswer,
  getUserDailyVote,
  getUserAnswers,
  getQuestionStats
} from '../controllers/answerUser.controller';

export default async function answerUserRoutes(fastify: FastifyInstance) {
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken);
    
    fastify.post('/daily-questions/answer', answerDailyQuestion);
    
    fastify.get('/daily-questions/my-vote', getUserDailyVote);
    
    fastify.get('/daily-questions/my-answers', getUserAnswers);
    
    fastify.get('/daily-questions/:questionId/total-votes', getTotalVotesForQuestion);
    
    fastify.get('/daily-questions/:questionId/votes-by-answer', getVotesByAnswer);
    
    fastify.get('/daily-questions/:questionId/stats', getQuestionStats);
  });
}
