import { FastifyReply, FastifyRequest } from 'fastify';
import * as AnswerUserService from '../services/answerUser.service';

interface AuthenticatedUser {
  id: number;
  email: string;
}

export const answerDailyQuestion = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const user = (req as any).user as AuthenticatedUser;
    if (!user) {
      return res.code(401).send({ error: 'Utilisateur non authentifié' });
    }

    const { id_question, answer } = req.body as { id_question: number; answer: number };
    
    if (!id_question || !answer) {
      return res.code(400).send({ 
        error: 'Données manquantes', 
        message: 'id_question et answer sont requis' 
      });
    }

    const userAnswer = await AnswerUserService.createAnswer({
      id_user: user.id,
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

    const result = await AnswerUserService.getTotalVotesForQuestion(Number(questionId));
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

    const result = await AnswerUserService.getVotesByAnswer(Number(questionId));
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
    const user = (req as any).user as AuthenticatedUser;
    if (!user) {
      return res.code(401).send({ error: 'Utilisateur non authentifié' });
    }

    const result = await AnswerUserService.getUserDailyVote(user.id);
    res.send(result);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération du vote du jour', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const getUserAnswers = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const user = (req as any).user as AuthenticatedUser;
    if (!user) {
      return res.code(401).send({ error: 'Utilisateur non authentifié' });
    }

    const answers = await AnswerUserService.getUserAnswers(user.id);
    res.send({
      userId: user.id,
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

    const stats = await AnswerUserService.getQuestionStats(Number(questionId));
    res.send(stats);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des statistiques', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};
