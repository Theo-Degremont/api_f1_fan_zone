import { FastifyRequest, FastifyReply } from 'fastify';
import * as authService from '../services/auth.service';
import * as authLogService from '../services/authLog.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (
  req: FastifyRequest<{
    Body: { username: string; email: string; password: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const user = await authService.register(req.body);
    
    // Log de l'inscription réussie
    await authLogService.logSuccessfulRegister(req.body.email, user.id, req);
    
    // Générer les tokens après l'inscription
    const tokens = await authService.login(req.body.email, req.body.password);
    
    // Log de la connexion automatique après inscription
    await authLogService.logSuccessfulLogin(req.body.email, user.id, req);
    
    reply.code(201).send(tokens);
  } catch (err) {
    // Log de l'inscription échouée
    await authLogService.logFailedRegister(
      req.body.email, 
      err instanceof Error ? err.message : 'Registration failed',
      req
    );
    
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
    
    // Récupérer l'ID utilisateur pour le log
    const user = await prisma.user.findFirst({ where: { email: req.body.email } });
    
    if (user) {
      // Log de la connexion réussie
      await authLogService.logSuccessfulLogin(req.body.email, user.id, req);
    }
    
    reply.send(tokens);
  } catch (err) {
    // Log de la connexion échouée
    await authLogService.logFailedLogin(
      req.body.email,
      err instanceof Error ? err.message : 'Invalid credentials',
      req
    );
    
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
    
    // Décoder le token pour obtenir l'ID utilisateur
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(req.body.refreshToken) as { userId: number };
    
    if (decoded && decoded.userId) {
      // Récupérer l'email de l'utilisateur
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      
      if (user) {
        // Log du refresh token réussi
        await authLogService.logSuccessfulRefreshToken(user.email, user.id, req);
      }
    }
    
    reply.send(tokens);
  } catch (err) {
    // Pour les échecs de refresh token, on ne peut pas toujours récupérer l'email
    // donc on utilise 'unknown' ou on essaie de décoder le token
    let email = 'unknown';
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.decode(req.body.refreshToken) as { userId: number };
      if (decoded && decoded.userId) {
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (user) email = user.email;
      }
    } catch (decodeErr) {
      // Ignore decode error
    }
    
    // Log du refresh token échoué
    await authLogService.logFailedRefreshToken(
      email,
      err instanceof Error ? err.message : 'Invalid refresh token',
      req
    );
    
    reply.code(403).send({ message: 'Invalid refresh token' });
  }
};
