import { FastifyReply, FastifyRequest } from 'fastify';
import * as GameScoreService from '../services/gameScore.service';

interface CreateGameScoreRequest {
  Body: {
    score_ms: number;
  };
}

interface UserIdParams {
  userId: string;
}

export const createGameScore = async (req: any, res: FastifyReply) => {
  try {
    const { score_ms } = req.body;
    const userId = req.authenticatedUser.userId; // Récupéré depuis le token JWT

    if (!score_ms) {
      return res.code(400).send({
        error: 'Données manquantes',
        message: 'score_ms est requis'
      });
    }

    if (typeof score_ms !== 'number' || score_ms <= 0) {
      return res.code(400).send({
        error: 'Score invalide',
        message: 'Le score doit être un nombre positif en millisecondes'
      });
    }

    const gameScore = await GameScoreService.createGameScore({
      user: { connect: { id: userId } },
      score_ms
    });

    res.code(201).send({
      message: 'Score enregistré avec succès',
      gameScore: {
        ...gameScore,
        scoreInSeconds: gameScore.score_ms / 1000
      }
    });
  } catch (error: any) {
    if (error.code === 'P2003') {
      res.code(400).send({
        error: 'Utilisateur invalide',
        message: 'L\'utilisateur spécifié n\'existe pas'
      });
    } else {
      res.code(500).send({
        error: 'Erreur lors de la création du score',
        message: error.message
      });
    }
  }
};

export const getAllGameScores = async (_req: FastifyRequest, res: FastifyReply) => {
  try {
    const gameScores = await GameScoreService.getAllGameScores();
    res.send({
      total: gameScores.length,
      gameScores: gameScores.map(score => ({
        ...score,
        scoreInSeconds: score.score_ms / 1000
      }))
    });
  } catch (error: any) {
    res.code(500).send({
      error: 'Erreur lors de la récupération des scores',
      message: error.message
    });
  }
};

export const getGameScoreById = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const gameScore = await GameScoreService.getGameScoreById(Number(id));

    if (!gameScore) {
      return res.code(404).send({
        error: 'Score introuvable',
        message: `Aucun score trouvé avec l'ID ${id}`
      });
    }

    res.send({
      ...gameScore,
      scoreInSeconds: gameScore.score_ms / 1000
    });
  } catch (error: any) {
    res.code(500).send({
      error: 'Erreur lors de la récupération du score',
      message: error.message
    });
  }
};

export const getUserGameScores = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { userId } = req.params as UserIdParams;
    const userIdNumber = Number(userId);

    if (isNaN(userIdNumber)) {
      return res.code(400).send({
        error: 'ID utilisateur invalide',
        message: 'L\'ID utilisateur doit être un nombre'
      });
    }

    const gameScores = await GameScoreService.getUserGameScores(userIdNumber);

    if (gameScores.length === 0) {
      return res.code(404).send({
        error: 'Aucun score trouvé',
        message: `Aucun score trouvé pour l'utilisateur ${userId}`
      });
    }

    res.send({
      userId: userIdNumber,
      totalScores: gameScores.length,
      gameScores: gameScores.map(score => ({
        ...score,
        scoreInSeconds: score.score_ms / 1000
      }))
    });
  } catch (error: any) {
    res.code(500).send({
      error: 'Erreur lors de la récupération des scores utilisateur',
      message: error.message
    });
  }
};

export const getUserBestScore = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { userId } = req.params as UserIdParams;
    const userIdNumber = Number(userId);

    if (isNaN(userIdNumber)) {
      return res.code(400).send({
        error: 'ID utilisateur invalide',
        message: 'L\'ID utilisateur doit être un nombre'
      });
    }

    const bestScore = await GameScoreService.getUserBestScore(userIdNumber);

    if (!bestScore) {
      return res.code(404).send({
        error: 'Aucun score trouvé',
        message: `Aucun score trouvé pour l'utilisateur ${userId}`
      });
    }

    res.send({
      message: 'Meilleur score de l\'utilisateur',
      bestScore
    });
  } catch (error: any) {
    res.code(500).send({
      error: 'Erreur lors de la récupération du meilleur score',
      message: error.message
    });
  }
};

// Nouvelle fonction pour récupérer le meilleur score de l'utilisateur connecté
export const getMyBestScore = async (req: any, res: FastifyReply) => {
  try {
    const userId = req.authenticatedUser.userId; // Récupéré depuis le token JWT

    const bestScore = await GameScoreService.getUserBestScore(userId);

    if (!bestScore) {
      return res.send({
        message: 'Aucun score trouvé',
        bestScore: null
      });
    }

    res.send({
      message: 'Votre meilleur score',
      bestScore: {
        ...bestScore,
        scoreInSeconds: bestScore.score_ms / 1000
      }
    });
  } catch (error: any) {
    res.code(500).send({
      error: 'Erreur lors de la récupération du score',
      message: error.message
    });
  }
};

export const getGlobalLeaderboard = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { limit } = req.query as { limit?: string };
    const limitNumber = limit ? Number(limit) : 10;

    if (isNaN(limitNumber) || limitNumber <= 0 || limitNumber > 100) {
      return res.code(400).send({
        error: 'Limite invalide',
        message: 'La limite doit être un nombre entre 1 et 100'
      });
    }

    const leaderboard = await GameScoreService.getGlobalLeaderboard(limitNumber);

    res.send({
      message: 'Classement global des meilleurs scores',
      limit: limitNumber,
      leaderboard
    });
  } catch (error: any) {
    res.code(500).send({
      error: 'Erreur lors de la récupération du classement',
      message: error.message
    });
  }
};

export const getUserStats = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { userId } = req.params as UserIdParams;
    const userIdNumber = Number(userId);

    if (isNaN(userIdNumber)) {
      return res.code(400).send({
        error: 'ID utilisateur invalide',
        message: 'L\'ID utilisateur doit être un nombre'
      });
    }

    const stats = await GameScoreService.getUserStats(userIdNumber);

    if (!stats) {
      return res.code(404).send({
        error: 'Aucune statistique trouvée',
        message: `Aucune statistique trouvée pour l'utilisateur ${userId}`
      });
    }

    res.send({
      message: 'Statistiques de l\'utilisateur',
      stats
    });
  } catch (error: any) {
    res.code(500).send({
      error: 'Erreur lors de la récupération des statistiques',
      message: error.message
    });
  }
};