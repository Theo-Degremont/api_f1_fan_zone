import { FastifyInstance } from 'fastify';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  createGameScore,
  getAllGameScores,
  getGameScoreById,
  getUserGameScores,
  getUserBestScore,
  getGlobalLeaderboard,
  getUserStats,
} from '../controllers/game_score_controller';

export default async function gameScoreRoutes(fastify: FastifyInstance) {
  // Toutes les routes sont sécurisées avec JWT
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken);
    fastify.post('/game-scores', createGameScore);
    fastify.get('/game-scores', getAllGameScores);
    fastify.get('/game-scores/:id', getGameScoreById);
    fastify.get('/game-scores/user/:userId', getUserGameScores);
    fastify.get('/game-scores/user/:userId/best', getUserBestScore);
    fastify.get('/game-scores/leaderboard', getGlobalLeaderboard);
    fastify.get('/game-scores/user/:userId/stats', getUserStats);
  });
}