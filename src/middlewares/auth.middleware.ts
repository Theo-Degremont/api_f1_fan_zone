import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export interface AuthenticatedRequest extends FastifyRequest {
  authenticatedUser: {
    userId: number;
  };
}

export const authenticateToken = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      reply.code(401).send({ message: 'Access token required' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    (request as AuthenticatedRequest).authenticatedUser = { userId: decoded.userId };
  } catch (err) {
    reply.code(403).send({ message: 'Invalid or expired token' });
    return;
  }
};
