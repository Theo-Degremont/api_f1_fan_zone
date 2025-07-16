import { FastifyRequest, FastifyReply } from 'fastify';
import * as userService from '../services/user.service';

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

export const getUserById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const user = await userService.getUserById(Number(req.params.id));
  if (!user) return reply.status(404).send({ message: 'User not found' });
  reply.send(user);
};

export const updateUser = async (
  req: FastifyRequest<{
    Params: { id: string };
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
  const updated = await userService.updateUser(
    Number(req.params.id),
    req.body
  );
  reply.send(updated);
};

export const deleteUser = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  await userService.deleteUser(Number(req.params.id));
  reply.status(204).send();
};
