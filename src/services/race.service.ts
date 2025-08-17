import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const createRace = async (data: {
  race_name: string;
  track_name: string;
  country?: string;
  city: string;
  started_at: Date;
  nb_laps: number;
  nb_curve?: number;
  duration?: number;
  image_url?: string;
  season: number;
}) => {
  return await prisma.race.create({ data });
};

export const getAllRaces = async () => {
  return await prisma.race.findMany({ include: { race_results: true } });
};

export const getRaceById = async (id: number) => {
  return await prisma.race.findUnique({
    where: { id },
    include: { race_results: true },
  });
};

export const updateRace = async (id: number, data: Partial<{
  race_name: string;
  track_name: string;
  country?: string;
  city: string;
  started_at: Date;
  nb_laps: number;
  nb_curve?: number;
  duration?: number;
  season: number;
}>) => {
  return await prisma.race.update({
    where: { id },
    data,
  });
};

export const deleteRace = async (id: number) => {
  return await prisma.race.delete({ where: { id } });
};

export const getNextRace = async () => {
  const now = new Date();
  return await prisma.race.findFirst({
    where: {
      started_at: {
        gte: now
      }
    },
    orderBy: {
      started_at: 'asc'
    },
    include: { race_results: true }
  });
};

export const getRacesByYear = async (year: number) => {
  const startOfYear = new Date(year, 0, 1); // 1er janvier de l'année
  const endOfYear = new Date(year + 1, 0, 1); // 1er janvier de l'année suivante

  return await prisma.race.findMany({
    where: {
      started_at: {
        gte: startOfYear,
        lt: endOfYear
      }
    },
    orderBy: {
      started_at: 'asc'
    },
    include: { race_results: true }
  });
};
