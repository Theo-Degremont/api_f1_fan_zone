import { FastifyRequest, FastifyReply } from 'fastify';
import * as authService from '../services/auth.service';

export const register = async (
  req: FastifyRequest<{
    Body: { username: string; email: string; password: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const user = await authService.register(req.body);
    // Générer les tokens après l'inscription
    const tokens = await authService.login(req.body.email, req.body.password);
    reply.code(201).send(tokens);
  } catch (err) {
    reply.code(400).send({ message: 'Registration failed' });
  }
};

export const login = async (
  req: FastifyRequest<{
    Body: { email: string; password: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const tokens = await authService.login(req.body.email, req.body.password);
    reply.send(tokens);
  } catch (err) {
    reply.code(401).send({ message: 'Invalid email or password' });
  }
};

export const refreshToken = async (
  req: FastifyRequest<{
    Body: { refreshToken: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const tokens = authService.refreshAccessToken(req.body.refreshToken);
    reply.send(tokens);
  } catch (err) {
    reply.code(403).send({ message: 'Invalid refresh token' });
  }
};
