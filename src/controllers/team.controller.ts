import { FastifyRequest, FastifyReply } from 'fastify';
import * as teamService from '../services/team.service';

export const createTeam = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const team = await teamService.createTeam(request.body as any);
    reply.code(201).send(team);
  } catch (err: any) {
    // Handle unique constraint violation
    if (err.code === 'P2002') {
      return reply.code(409).send({ 
        error: 'Team key already exists',
        field: err.meta?.target?.[0] || 'key'
      });
    }
    reply.code(400).send({ error: err.message });
  }
};

export const getAllTeams = async (_request: FastifyRequest, reply: FastifyReply) => {
  const teams = await teamService.getAllTeams();
  reply.send(teams);
};

export const getTeamById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const id = parseInt(request.params.id);
  const team = await teamService.getTeamById(id);
  if (!team) return reply.code(404).send({ error: 'Team not found' });
  reply.send(team);
};

export const updateTeam = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = parseInt(request.params.id);
    const updated = await teamService.updateTeam(id, request.body as any);
    reply.send(updated);
  } catch (err: any) {
    if (err.code === 'P2002') {
      return reply.code(409).send({ 
        error: 'Team key already exists',
        field: err.meta?.target?.[0] || 'key'
      });
    }
    reply.code(400).send({ error: err.message });
  }
};

export const deleteTeam = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = parseInt(request.params.id);
    await teamService.deleteTeam(id);
    reply.code(204).send();
  } catch (err: any) {
    reply.code(400).send({ error: err.message });
  }
};