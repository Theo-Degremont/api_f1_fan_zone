import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createGameScore = async (data: Prisma.GameScoreCreateInput) => {
  return prisma.gameScore.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });
};

export const getAllGameScores = async () => {
  return prisma.gameScore.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    },
    orderBy: [
      { score_ms: 'asc' }, // Meilleurs scores en premier (plus petit = meilleur)
      { created_at: 'desc' }
    ]
  });
};

export const getGameScoreById = async (id: number) => {
  return prisma.gameScore.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });
};

export const getUserGameScores = async (userId: number) => {
  return prisma.gameScore.findMany({
    where: { user_id: userId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    },
    orderBy: [
      { score_ms: 'asc' }, // Meilleurs scores en premier
      { created_at: 'desc' }
    ]
  });
};

export const getUserBestScore = async (userId: number) => {
  const bestScore = await prisma.gameScore.findFirst({
    where: { user_id: userId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    },
    orderBy: { score_ms: 'asc' } // Le plus petit score = le meilleur
  });

  if (!bestScore) {
    return null;
  }

  // Calculer le rang de ce score parmi tous les utilisateurs
  const betterScoresCount = await prisma.gameScore.count({
    where: {
      score_ms: {
        lt: bestScore.score_ms
      }
    }
  });

  return {
    ...bestScore,
    rank: betterScoresCount + 1,
    scoreInSeconds: bestScore.score_ms / 1000 // Conversion en secondes pour affichage
  };
};

export const getGlobalLeaderboard = async (limit: number = 10) => {
  // Récupérer le meilleur score de chaque utilisateur
  const bestScores = await prisma.gameScore.groupBy({
    by: ['user_id'],
    _min: {
      score_ms: true
    },
    orderBy: {
      _min: {
        score_ms: 'asc'
      }
    },
    take: limit
  });

  // Récupérer les détails complets pour chaque meilleur score
  const leaderboard = await Promise.all(
    bestScores.map(async (score, index) => {
      if (score._min.score_ms === null) {
        return null;
      }
      const fullScore = await prisma.gameScore.findFirst({
        where: {
          user_id: score.user_id,
          score_ms: score._min.score_ms as number
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });

      return fullScore
        ? {
            ...fullScore,
            rank: index + 1,
            scoreInSeconds: fullScore.score_ms / 1000
          }
        : null;
    })
  );

  return leaderboard;
};

export const getUserStats = async (userId: number) => {
  const userScores = await prisma.gameScore.findMany({
    where: { user_id: userId },
    orderBy: { score_ms: 'asc' }
  });

  if (userScores.length === 0) {
    return null;
  }

  const bestScore = userScores[0];
  const worstScore = userScores[userScores.length - 1];
  const totalScores = userScores.length;
  const averageScore = Math.round(
    userScores.reduce((sum, score) => sum + score.score_ms, 0) / totalScores
  );

  // Calculer le rang global du meilleur score
  const betterScoresCount = await prisma.gameScore.count({
    where: {
      score_ms: {
        lt: bestScore.score_ms
      }
    }
  });

  return {
    userId,
    totalGames: totalScores,
    bestScore: {
      ...bestScore,
      scoreInSeconds: bestScore.score_ms / 1000,
      globalRank: betterScoresCount + 1
    },
    worstScore: {
      ...worstScore,
      scoreInSeconds: worstScore.score_ms / 1000
    },
    averageScore: {
      score_ms: averageScore,
      scoreInSeconds: averageScore / 1000
    }
  };
};