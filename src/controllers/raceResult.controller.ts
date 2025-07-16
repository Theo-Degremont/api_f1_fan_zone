import { FastifyReply, FastifyRequest } from 'fastify';
import * as RaceResultService from '../services/raceResult.service';

export const createRaceResult = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const data = req.body as RaceResultService.CreateRaceResultData;
    const raceResult = await RaceResultService.createRaceResult(data);
    res.code(201).send(raceResult);
  } catch (error) {
    res.code(400).send({ 
      error: 'Erreur lors de la création du résultat', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const getAllRaceResults = async (_req: FastifyRequest, res: FastifyReply) => {
  try {
    const raceResults = await RaceResultService.getAllRaceResults();
    res.send(raceResults);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des résultats', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const getRaceResultById = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const raceResult = await RaceResultService.getRaceResultById(Number(id));
    if (!raceResult) {
      return res.code(404).send({ message: 'Résultat de course non trouvé' });
    }
    res.send(raceResult);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération du résultat', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const getRaceResultsByRaceId = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { raceId } = req.params as { raceId: string };
    const raceResults = await RaceResultService.getRaceResultsByRaceId(Number(raceId));
    res.send(raceResults);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des résultats de la course', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const getRaceResultsByDriverId = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { driverId } = req.params as { driverId: string };
    const raceResults = await RaceResultService.getRaceResultsByDriverId(Number(driverId));
    res.send(raceResults);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des résultats du pilote', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const getFinalRaceRanking = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { raceId } = req.params as { raceId: string };
    const ranking = await RaceResultService.getFinalRaceRanking(Number(raceId));
    res.send(ranking);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération du classement final', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const getDNFDrivers = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { raceId } = req.params as { raceId: string };
    const dnfDrivers = await RaceResultService.getDNFDrivers(Number(raceId));
    res.send(dnfDrivers);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des pilotes hors course', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const updateRaceResult = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const data = req.body as Partial<RaceResultService.CreateRaceResultData>;
    const raceResult = await RaceResultService.updateRaceResult(Number(id), data);
    res.send(raceResult);
  } catch (error) {
    res.code(400).send({ 
      error: 'Erreur lors de la mise à jour du résultat', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const deleteRaceResult = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    await RaceResultService.deleteRaceResult(Number(id));
    res.code(204).send();
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la suppression du résultat', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

export const getRaceStats = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { raceId } = req.params as { raceId: string };
    const stats = await RaceResultService.getRaceStats(Number(raceId));
    res.send(stats);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des statistiques', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};
