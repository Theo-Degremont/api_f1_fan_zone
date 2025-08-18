import { FastifyReply, FastifyRequest } from 'fastify';
import * as AnswerUserService from '../services/answerUser.service';

interface AuthenticatedUser {
  id: number;
  email: string;
}

export const answerDailyQuestion = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const user = (req as any).authenticatedUser as { userId: number };
    if (!user) {
      return res.code(401).send({ error: 'Utilisateur non authentifié' });
    }

    const { id_question, answer } = req.body as { id_question: string; answer: number };
    
    if (!id_question || !answer) {
      return res.code(400).send({ 
        error: 'Données manquantes', 
        message: 'id_question et answer sont requis' 
      });
    }

    const userAnswer = await AnswerUserService.createAnswer({
      id_user: user.userId.toString(),
      id_question,
      answer
    });

    res.code(201).send({
      message: 'Réponse enregistrée avec succès',
      answer: userAnswer
    });
  } catch (error) {
    res.code(400).send({ 
      error: 'Erreur lors de l\'enregistrement de la réponse', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const getTotalVotesForQuestion = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { questionId } = req.params as { questionId: string };
    
    if (!questionId) {
      return res.code(400).send({ 
        error: 'ID de question manquant' 
      });
    }

    const result = await AnswerUserService.getTotalVotesForQuestion(questionId);
    res.send(result);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération du nombre de votes', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const getVotesByAnswer = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { questionId } = req.params as { questionId: string };
    
    if (!questionId) {
      return res.code(400).send({ 
        error: 'ID de question manquant' 
      });
    }

    const result = await AnswerUserService.getVotesByAnswer(questionId);
    res.send(result);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des votes par réponse', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const getUserDailyVote = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const user = (req as any).authenticatedUser as { userId: number };
    if (!user) {
      return res.code(401).send({ error: 'Utilisateur non authentifié' });
    }

    const result = await AnswerUserService.getUserDailyVote(user.userId.toString());
    res.send(result);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération du vote du jour', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

// Route my-answer avec statistiques intégrées
export const getUserDailyVoteWithStats = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const user = (req as any).authenticatedUser as { userId: number };
    if (!user) {
      return res.code(401).send({ error: 'Utilisateur non authentifié' });
    }

    const result = await AnswerUserService.getUserDailyVoteWithStats(user.userId.toString());
    res.send(result);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération du vote du jour avec statistiques', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const getUserAnswers = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const user = (req as any).authenticatedUser as { userId: number };
    if (!user) {
      return res.code(401).send({ error: 'Utilisateur non authentifié' });
    }

    const answers = await AnswerUserService.getUserAnswers(user.userId.toString());
    res.send({
      userId: user.userId,
      totalAnswers: answers.length,
      answers
    });
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des réponses utilisateur', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const getQuestionStats = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { questionId } = req.params as { questionId: string };
    
    if (!questionId) {
      return res.code(400).send({ 
        error: 'ID de question manquant' 
      });
    }

    const stats = await AnswerUserService.getQuestionStats(questionId);
    res.send(stats);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des statistiques', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const getTodayQuestionStats = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const stats = await AnswerUserService.getTodayQuestionStats();
    res.send({
      message: 'Statistiques de la question du jour récupérées avec succès',
      data: stats
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Aucune question active pour aujourd\'hui') {
      return res.code(404).send({ 
        error: 'Aucune question disponible', 
        message: 'Aucune question active pour aujourd\'hui' 
      });
    }
    
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des statistiques du jour', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};
