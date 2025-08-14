import { FastifyRequest, FastifyReply } from 'fastify';
import * as userService from '../services/user.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const createUser = async (req: FastifyRequest<{ Body: {
  username: string;
  email: string;
  password: string;
  favorite_team_id?: number;
  favorite_driver_id?: number;
} }>, reply: FastifyReply) => {
  const user = await userService.createUser(req.body);
  reply.code(201).send(user);
};

export const getUsers = async (_req: FastifyRequest, reply: FastifyReply) => {
  const users = await userService.getAllUsers();
  reply.send(users);
};

export const getMyProfile = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const authRequest = req as AuthenticatedRequest;
    const user = await userService.getUserById(authRequest.authenticatedUser.userId);
    if (!user) return reply.status(404).send({ message: 'User not found' });
    reply.send(user);
  } catch (err) {
    reply.code(500).send({ message: 'Error retrieving user profile' });
  }
};

export const updateMyProfile = async (
  req: FastifyRequest<{
    Body: Partial<Omit<{
      username: string;
      email: string;
      password: string;
      favorite_team_id?: number;
      favorite_driver_id?: number;
    }, 'password'>>;
  }>,
  reply: FastifyReply
) => {
  try {
    const authRequest = req as AuthenticatedRequest;
    const updated = await userService.updateUser(authRequest.authenticatedUser.userId, req.body);
    reply.send(updated);
  } catch (err) {
    reply.code(500).send({ message: 'Error updating user profile' });
  }
};

export const deleteMyProfile = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const authRequest = req as AuthenticatedRequest;
    await userService.deleteUser(authRequest.authenticatedUser.userId);
    reply.status(204).send();
  } catch (err) {
    reply.code(500).send({ message: 'Error deleting user profile' });
  }
};

export const checkEmailAvailability = async (
  req: FastifyRequest<{ Querystring: { email: string } }>,
  reply: FastifyReply
) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return reply.code(400).send({ message: 'Email parameter is required' });
    }

    const result = await userService.checkEmailAvailability(email);
    reply.send(result);
  } catch (err) {
    reply.code(500).send({ message: 'Error checking email availability' });
  }
};
