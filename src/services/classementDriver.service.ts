import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createClassement = async (data: Prisma.ClassementDriverCreateInput) => {
  return prisma.classementDriver.create({ 
    data,
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          surname: true,
          number: true
        }
      }
    }
  });
};

export const getAllClassements = async () => {
  return prisma.classementDriver.findMany({
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          surname: true,
          number: true,
          current_team: {
            select: {
              id: true,
              name: true,
              color: true
            }
          }
        }
      }
    },
    orderBy: [
      { season: 'desc' },
      { position: 'asc' }
    ]
  });
};

export const getClassementById = async (id: number) => {
  return prisma.classementDriver.findUnique({ 
    where: { id },
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          surname: true,
          number: true,
          current_team: {
            select: {
              id: true,
              name: true,
              color: true
            }
          }
        }
      }
    }
  });
};

export const getClassementBySeason = async (season: number) => {
  return prisma.classementDriver.findMany({
    where: { season },
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          surname: true,
          number: true,
          current_team: {
            select: {
              id: true,
              name: true,
              color: true
            }
          }
        }
      }
    },
    orderBy: { position: 'asc' }
  });
};

export const getAvailableSeasons = async () => {
  const seasons = await prisma.classementDriver.findMany({
    select: { season: true },
    distinct: ['season'],
    orderBy: { season: 'desc' }
  });
  
  return seasons.map(s => s.season);
};

export const updateClassement = async (id: number, data: Prisma.ClassementDriverUpdateInput) => {
  return prisma.classementDriver.update({ 
    where: { id }, 
    data,
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          surname: true,
          number: true
        }
      }
    }
  });
};

export const deleteClassement = async (id: number) => {
  return prisma.classementDriver.delete({ where: { id } });
};

export const getSeasonStats = async (season: number) => {
  const classements = await getClassementBySeason(season);
  
  if (classements.length === 0) {
    return null;
  }

  const totalPoints = classements.reduce((sum, c) => sum + c.points, 0);
  const avgPoints = Math.round(totalPoints / classements.length);
  const champion = classements[0];

  return {
    season,
    totalDrivers: classements.length,
    totalPoints,
    avgPoints,
    champion: champion ? {
      position: champion.position,
      points: champion.points,
      driver: champion.driver
    } : null
  };
};