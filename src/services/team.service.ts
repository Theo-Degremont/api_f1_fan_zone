import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Validation pour les couleurs hexadécimales
const validateHexColor = (color: string): boolean => {
  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
  return hexColorRegex.test(color);
};

export const createTeam = async (data: Prisma.TeamCreateInput) => {
  // Validation de la couleur
  if (!validateHexColor(data.color)) {
    throw new Error('Color must be in hexadecimal format (#RRGGBB)');
  }
  
  return prisma.team.create({ 
    data,
    include: {
      current_drivers: {
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

export const getAllTeams = async () => {
  return prisma.team.findMany({
    include: {
      current_drivers: {
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

export const getTeamById = async (id: number) => {
  return prisma.team.findUnique({ 
    where: { id },
    include: {
      current_drivers: {
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

export const updateTeam = async (id: number, data: Prisma.TeamUpdateInput) => {
  // Validation de la couleur si elle est fournie
  if (data.color && typeof data.color === 'string' && !validateHexColor(data.color)) {
    throw new Error('Color must be in hexadecimal format (#RRGGBB)');
  }
  
  return prisma.team.update({
    where: { id },
    data,
    include: {
      current_drivers: {
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

export const deleteTeam = async (id: number) => {
  return prisma.team.delete({ where: { id } });
};

export const getTeamCurrentDrivers = async (teamId: number) => {
  return prisma.driver.findMany({
    where: { current_team_id: teamId },
    select: {
      id: true,
      name: true,
      surname: true,
      number: true,
      nb_championship: true,
      nb_victory: true,
      nb_pole: true,
      nb_race: true
    }
  });
};

export const getTeamWithDrivers = async (teamId: number) => {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      current_drivers: {
        select: {
          id: true,
          name: true,
          surname: true,
          number: true,
          nb_championship: true,
          nb_victory: true,
          nb_pole: true,
          nb_race: true
        }
      }
    }
  });
  
  if (!team) {
    throw new Error('Team not found');
  }

  return team;
};