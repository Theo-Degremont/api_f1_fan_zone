import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createClassement = async (data: Prisma.ClassementTeamCreateInput) => {
  return prisma.classementTeam.create({ 
    data,
    include: {
      team: {
        select: {
          id: true,
          name: true,
          color: true,
          nb_championship: true
        }
      }
    }
  });
};

export const getAllClassements = async () => {
  return prisma.classementTeam.findMany({
    include: {
      team: {
        select: {
          id: true,
          name: true,
          color: true,
          nb_championship: true,
          nb_victory: true
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
  return prisma.classementTeam.findUnique({ 
    where: { id },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          color: true,
          nb_championship: true,
          nb_victory: true
        }
      }
    }
  });
};

export const getClassementBySeason = async (season: number) => {
  return prisma.classementTeam.findMany({
    where: { season },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          color: true,
          nb_championship: true,
          nb_victory: true
        }
      }
    },
    orderBy: { position: 'asc' }
  });
};

export const getAvailableSeasons = async () => {
  const seasons = await prisma.classementTeam.findMany({
    select: { season: true },
    distinct: ['season'],
    orderBy: { season: 'desc' }
  });
  
  return seasons.map((s: { season: number }) => s.season);
};

export const updateClassement = async (id: number, data: Prisma.ClassementTeamUpdateInput) => {
  return prisma.classementTeam.update({ 
    where: { id }, 
    data,
    include: {
      team: {
        select: {
          id: true,
          name: true,
          color: true,
          nb_championship: true
        }
      }
    }
  });
};

export const deleteClassement = async (id: number) => {
  return prisma.classementTeam.delete({ where: { id } });
};

export const getSeasonStats = async (season: number) => {
  const classements = await getClassementBySeason(season);
  
  if (classements.length === 0) {
    return null;
  }

  const totalPoints = classements.reduce((sum: number, c: any) => sum + c.points, 0);
  const avgPoints = Math.round(totalPoints / classements.length);
  const champion = classements[0];

  return {
    season,
    totalTeams: classements.length,
    totalPoints,
    avgPoints,
    champion: champion ? {
      position: champion.position,
      points: champion.points,
      team: champion.team
    } : null
  };
};

export const getTeamPosition = async (teamId: number, season: number) => {
  return prisma.classementTeam.findUnique({
    where: {
      season_id_team: {
        season: season,
        id_team: teamId
      }
    },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          color: true,
          nb_championship: true
        }
      }
    }
  });
};