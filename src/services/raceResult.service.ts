import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types pour les statuts de course
export type RaceStatus = 'FINISHED' | 'DNF' | 'DSQ' | 'DNS';

export interface CreateRaceResultData {
  race_id: number;
  driver_id: number;
  position: number; // 0 = hors course
  points: number;
  fastest_lap?: Date;
}

// Créer un résultat de course
export const createRaceResult = async (data: CreateRaceResultData) => {
  const createData: any = {
    race_id: data.race_id,
    driver_id: data.driver_id,
    position: data.position,
    points: data.points
  };
  
  if (data.fastest_lap) {
    createData.fastest_lap = data.fastest_lap;
  }
  
  return await prisma.raceResult.create({
    data: createData,
    include: {
      driver: true,
      race: true
    }
  });
};

// Obtenir les résultats d'une course spécifique (classement final)
export const getRaceResultsByRaceId = async (raceId: number) => {
  return await prisma.raceResult.findMany({
    where: { race_id: raceId },
    include: {
      driver: true,
      race: true
    },
    orderBy: [
      { position: 'asc' }
    ]
  });
};

// Obtenir les résultats d'un pilote
export const getRaceResultsByDriverId = async (driverId: number) => {
  return await prisma.raceResult.findMany({
    where: { driver_id: driverId },
    include: {
      driver: true,
      race: true
    },
    orderBy: [
      { race: { started_at: 'desc' } }
    ]
  });
};

// Obtenir le classement final d'une course (seulement les pilotes classés)
export const getFinalRaceRanking = async (raceId: number) => {
  return await prisma.raceResult.findMany({
    where: { 
      race_id: raceId,
      position: { gt: 0 }
    },
    include: {
      driver: true,
      race: true
    },
    orderBy: [
      { position: 'asc' }
    ]
  });
};

// Obtenir les pilotes hors course
export const getDNFDrivers = async (raceId: number) => {
  return await prisma.raceResult.findMany({
    where: { 
      race_id: raceId,
      position: 0
    },
    include: {
      driver: true,
      race: true
    },
    orderBy: [
      { driver: { name: 'asc' } }
    ]
  });
};

// Mettre à jour un résultat
export const updateRaceResult = async (id: number, data: Partial<CreateRaceResultData>) => {
  return await prisma.raceResult.update({
    where: { id },
    data,
    include: {
      driver: true,
      race: true
    }
  });
};

// Supprimer un résultat
export const deleteRaceResult = async (id: number) => {
  return await prisma.raceResult.delete({
    where: { id }
  });
};

// Statistiques d'une course
export const getRaceStats = async (raceId: number) => {
  const totalDrivers = await prisma.raceResult.count({
    where: { race_id: raceId }
  });

  const finishedDrivers = await prisma.raceResult.count({
    where: { 
      race_id: raceId,
      position: { gt: 0 }
    }
  });

  const dnfDrivers = await prisma.raceResult.count({
    where: { 
      race_id: raceId,
      position: 0
    }
  });

  return {
    totalDrivers,
    finishedDrivers,
    dnfDrivers
  };
};
