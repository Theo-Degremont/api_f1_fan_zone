import { FastifyRequest, FastifyReply } from 'fastify';
import env from '../config/env';

export const validateApiKey = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) {
      reply.code(401).send({ 
        error: 'API Key required',
        message: 'Please provide a valid API key in the X-API-Key header' 
      });
      return;
    }

    if (apiKey !== env.API_KEY) {
      reply.code(403).send({ 
        error: 'Invalid API Key',
        message: 'The provided API key is invalid' 
      });
      return;
    }
    
  } catch (err) {
    reply.code(500).send({ 
      error: 'Internal server error',
      message: 'Error validating API key' 
    });
    return;
  }
};
