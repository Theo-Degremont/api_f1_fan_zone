import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createDriver = async (data: Prisma.DriverCreateInput) => {
  return prisma.driver.create({ data });
};

export const getAllDrivers = async () => {
  return prisma.driver.findMany();
};

export const getDriverById = async (id: number) => {
  return prisma.driver.findUnique({ where: { id } });
};

export const updateDriver = async (id: number, data: Prisma.DriverUpdateInput) => {
  return prisma.driver.update({
    where: { id },
    data,
  });
};

export const deleteDriver = async (id: number) => {
  return prisma.driver.delete({
    where: { id },
  });
};

// Fonctions spécifiques pour gérer les équipes
export const assignDriverToTeam = async (driverId: number, teamId: number) => {
  // Utiliser une requête SQL brute pour éviter les problèmes de types
  return prisma.$queryRaw`
    UPDATE "Driver" 
    SET 
      "previous_teams" = 
        CASE 
          WHEN "current_team_id" IS NOT NULL 
          THEN array_append("previous_teams", "current_team_id")
          ELSE "previous_teams"
        END,
      "current_team_id" = ${teamId}
    WHERE "id" = ${driverId}
    RETURNING *
  `;
};

export const removeDriverFromTeam = async (driverId: number) => {
  return prisma.$queryRaw`
    UPDATE "Driver" 
    SET 
      "previous_teams" = 
        CASE 
          WHEN "current_team_id" IS NOT NULL 
          THEN array_append("previous_teams", "current_team_id")
          ELSE "previous_teams"
        END,
      "current_team_id" = NULL
    WHERE "id" = ${driverId}
    RETURNING *
  `;
};

export const getDriverWithTeams = async (driverId: number) => {
  return prisma.$queryRaw`
    SELECT 
      d.*,
      ct.name as current_team_name,
      ct.color as current_team_color,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', t.id,
              'name', t.name,
              'color', t.color
            )
          )
          FROM "Team" t
          WHERE t.id = ANY(d.previous_teams)
        ),
        '[]'::json
      ) as previous_teams_details
    FROM "Driver" d
    LEFT JOIN "Team" ct ON d.current_team_id = ct.id
    WHERE d.id = ${driverId}
  `;
};

export const getDriverTeamHistory = async (driverId: number) => {
  const result = await prisma.$queryRaw`
    SELECT 
      d.*,
      ct.name as current_team_name,
      ct.color as current_team_color,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', t.id,
              'name', t.name,
              'color', t.color
            )
          )
          FROM "Team" t
          WHERE t.id = ANY(d.previous_teams)
        ),
        '[]'::json
      ) as previous_teams_details
    FROM "Driver" d
    LEFT JOIN "Team" ct ON d.current_team_id = ct.id
    WHERE d.id = ${driverId}
  `;
  
  return Array.isArray(result) ? result[0] : null;
};
