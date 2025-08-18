import { FastifyRequest, FastifyReply } from 'fastify';
import * as dailyQuestionsService from '../services/daily_questions.service';

export const getAllDailyQuestions = async (_req: FastifyRequest, reply: FastifyReply) => {
  const dailyQuestions = await dailyQuestionsService.getAllDailyQuestions();
  reply.send(dailyQuestions);
};

export const getTodayQuestion = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const todayQuestion = await dailyQuestionsService.getTodayQuestion();
    if (!todayQuestion) {
      return reply.status(404).send({ 
        message: 'Aucune question disponible pour aujourd\'hui' 
      });
    }
    reply.send(todayQuestion);
  } catch (error: any) {
    reply.status(500).send({ 
      error: 'Erreur lors de la récupération de la question du jour', 
      message: error.message 
    });
  }
};

export const getDailyQuestionById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const dailyQuestion = await dailyQuestionsService.getDailyQuestionById(req.params.id);
  if (!dailyQuestion) return reply.status(404).send({ message: 'Daily Question not found' });
  reply.send(dailyQuestion);
};

export const createDailyQuestion = async (
  req: FastifyRequest<{ Body: any }>,
  reply: FastifyReply
) => {
  const created = await dailyQuestionsService.createDailyQuestion(req.body as Partial<import('../models/daily_questions.model').IDailyQuestion>);
  reply.code(201).send(created);
};

export const updateDailyQuestion = async (
  req: FastifyRequest<{ Params: { id: string }; Body: any }>,
  reply: FastifyReply
) => {
  const updated = await dailyQuestionsService.updateDailyQuestion(req.params.id, req.body as Partial<import('../models/daily_questions.model').IDailyQuestion>);
  if (!updated) return reply.status(404).send({ message: 'Daily Question not found' });
  reply.send(updated);
};


