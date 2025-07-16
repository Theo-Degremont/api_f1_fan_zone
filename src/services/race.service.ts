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
}>) => {
  return await prisma.race.update({
    where: { id },
    data,
  });
};

export const deleteRace = async (id: number) => {
  return await prisma.race.delete({ where: { id } });
};
