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
          team_history: {
            where: { 
              season_start: { lte: season },
              OR: [
                { season_end: null },
                { season_end: { gte: season } }
              ]
            },
            select: {
              team: {
                select: {
                  id: true,
                  name: true,
                  color: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: { position: 'asc' }
  });
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
      driver: {
        id: champion.driver.id,
        name: champion.driver.name,
        surname: champion.driver.surname,
        number: champion.driver.number,
        team: champion.driver.team_history[0]?.team || null
      }
    } : null
  };
};