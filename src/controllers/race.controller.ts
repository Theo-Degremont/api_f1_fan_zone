import { FastifyReply, FastifyRequest } from 'fastify';
import * as RaceService from '../services/race.service';

export const createRace = async (req: FastifyRequest, res: FastifyReply) => {
  const data = req.body as any;
  const race = await RaceService.createRace(data);
  res.code(201).send(race);
};

export const getAllRaces = async (_req: FastifyRequest, res: FastifyReply) => {
  const races = await RaceService.getAllRaces();
  res.send(races);
};

export const getRaceById = async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };
  const race = await RaceService.getRaceById(Number(id));
  if (!race) return res.code(404).send({ message: 'Race not found' });
  res.send(race);
};

export const updateRace = async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };
  const race = await RaceService.updateRace(Number(id), req.body as any);
  res.send(race);
};

export const deleteRace = async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };
  await RaceService.deleteRace(Number(id));
  res.code(204).send();
};

export const getNextRace = async (_req: FastifyRequest, res: FastifyReply) => {
  const nextRace = await RaceService.getNextRace();
  if (!nextRace) {
    return res.code(404).send({ message: 'No upcoming race found' });
  }
  res.send(nextRace);
};

export const getRacesByYear = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { year } = req.params as { year: string };
    const yearNumber = parseInt(year, 10);
    
    // Validation de l'année
    if (isNaN(yearNumber) || yearNumber < 1950 || yearNumber > 2100) {
      return res.code(400).send({ 
        message: 'Invalid year. Please provide a valid year between 1950 and 2100.' 
      });
    }
    
    const races = await RaceService.getRacesByYear(yearNumber);
    
    res.send({
      year: yearNumber,
      count: races.length,
      races: races
    });
  } catch (error) {
    res.code(500).send({ message: 'Error retrieving races by year' });
  }
};
