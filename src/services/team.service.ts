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
  
  return prisma.team.create({ data });
};

export const getAllTeams = async () => {
  return prisma.team.findMany();
};

export const getTeamById = async (id: number) => {
  return prisma.team.findUnique({ where: { id } });
};

export const updateTeam = async (id: number, data: Prisma.TeamUpdateInput) => {
  // Validation de la couleur si elle est fournie
  if (data.color && typeof data.color === 'string' && !validateHexColor(data.color)) {
    throw new Error('Color must be in hexadecimal format (#RRGGBB)');
  }
  
  return prisma.team.update({
    where: { id },
    data,
  });
};

export const deleteTeam = async (id: number) => {
  return prisma.team.delete({ where: { id } });
};

// Fonctions pour récupérer les pilotes d'une équipe
export const getTeamCurrentDrivers = async (teamId: number) => {
  return prisma.$queryRaw`
    SELECT 
      d.*,
      t.name as team_name,
      t.color as team_color
    FROM "Driver" d
    JOIN "Team" t ON d.current_team_id = t.id
    WHERE t.id = ${teamId}
    ORDER BY d.name ASC
  `;
};

export const getTeamAllDrivers = async (teamId: number) => {
  return prisma.$queryRaw`
    SELECT DISTINCT
      d.*,
      CASE 
        WHEN d.current_team_id = ${teamId} THEN 'current'
        ELSE 'previous'
      END as driver_status
    FROM "Driver" d
    WHERE d.current_team_id = ${teamId}
       OR ${teamId} = ANY(d.previous_teams)
    ORDER BY 
      CASE WHEN d.current_team_id = ${teamId} THEN 0 ELSE 1 END,
      d.name ASC
  `;
};

export const getTeamWithDrivers = async (teamId: number) => {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });
  
  if (!team) {
    throw new Error('Team not found');
  }

  const currentDrivers = await getTeamCurrentDrivers(teamId);
  const allDrivers = await getTeamAllDrivers(teamId);

  return {
    team,
    current_drivers: currentDrivers,
    all_drivers: allDrivers,
  };
};