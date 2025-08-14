import { FastifyRequest, FastifyReply } from 'fastify';
import * as driverService from '../services/driver.service';

export const createDriver = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const driver = await driverService.createDriver(req.body as any);
    reply.code(201).send(driver);
  } catch (error: any) {
    if (error.code === 'P2002') {
      reply.code(400).send({ 
        error: 'Données dupliquées', 
        message: 'Ce numéro de pilote ou cette clé existe déjà' 
      });
    } else {
      reply.code(400).send({ error: error.message });
    }
  }
};

export const getAllDrivers = async (_: FastifyRequest, reply: FastifyReply) => {
  try {
    const drivers = await driverService.getAllDrivers();
    reply.send(drivers);
  } catch (error) {
    reply.code(500).send({ error: (error as Error).message });
  }
};

export const getDriverById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = parseInt(req.params.id);
    const driver = await driverService.getDriverById(id);
    if (!driver) {
      reply.code(404).send({ error: 'Driver not found' });
    } else {
      reply.send(driver);
    }
  } catch (error) {
    reply.code(500).send({ error: (error as Error).message });
  }
};

export const updateDriver = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = parseInt(req.params.id);
    const driver = await driverService.updateDriver(id, req.body as any);
    reply.send(driver);
  } catch (error: any) {
    if (error.code === 'P2002') {
      reply.code(400).send({ 
        error: 'Données dupliquées', 
        message: 'Ce numéro de pilote ou cette clé existe déjà' 
      });
    } else {
      reply.code(400).send({ error: error.message });
    }
  }
};

export const deleteDriver = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = parseInt(req.params.id);
    await driverService.deleteDriver(id);
    reply.code(204).send();
  } catch (error) {
    reply.code(400).send({ error: (error as Error).message });
  }
};

export const assignDriverToTeam = async (req: FastifyRequest<{ 
  Params: { id: string };
  Body: { teamId: number };
}>, reply: FastifyReply) => {
  try {
    const driverId = parseInt(req.params.id);
    const { teamId } = req.body as { teamId: number };
    const result = await driverService.assignDriverToTeam(driverId, teamId);
    reply.send(result);
  } catch (error) {
    reply.code(400).send({ error: (error as Error).message });
  }
};

export const removeDriverFromTeam = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const driverId = parseInt(req.params.id);
    const result = await driverService.removeDriverFromTeam(driverId);
    reply.send(result);
  } catch (error) {
    reply.code(400).send({ error: (error as Error).message });
  }
};

export const getDriversByTeam = async (req: FastifyRequest<{ Params: { teamId: string } }>, reply: FastifyReply) => {
  try {
    const teamId = parseInt(req.params.teamId);
    const drivers = await driverService.getDriversByTeam(teamId);
    reply.send(drivers);
  } catch (error) {
    reply.code(500).send({ error: (error as Error).message });
  }
};