import { FastifyRequest, FastifyReply } from 'fastify';
import * as newsService from '../services/news.service';

export const getAllNews = async (_req: FastifyRequest, reply: FastifyReply) => {
  const news = await newsService.getAllNews();
  reply.send(news);
};

export const getNewsById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const news = await newsService.getNewsById(req.params.id);
  if (!news) return reply.status(404).send({ message: 'News not found' });
  reply.send(news);
};

export const createNews = async (
  req: FastifyRequest<{ Body: any }>,
  reply: FastifyReply
) => {
  const created = await newsService.createNews(req.body as Partial<import('../models/news.model').INews>);
  reply.code(201).send(created);
};

export const updateNews = async (
  req: FastifyRequest<{ Params: { id: string }; Body: any }>,
  reply: FastifyReply
) => {
  const updated = await newsService.updateNews(req.params.id, req.body as Partial<import('../models/news.model').INews>);
  if (!updated) return reply.status(404).send({ message: 'News not found' });
  reply.send(updated);
};


