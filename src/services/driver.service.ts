import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createDriver = async (data: Prisma.DriverCreateInput) => {
  return prisma.driver.create({ 
    data,
    include: {
      current_team: {
        select: {
          id: true,
          name: true,
          color: true
        }
      }
    }
  });
};

export const getAllDrivers = async () => {
  return prisma.driver.findMany({
    include: {
      current_team: {
        select: {
          id: true,
          name: true,
          color: true
        }
      }
    }
  });
};

export const getDriverById = async (id: number) => {
  return prisma.driver.findUnique({ 
    where: { id },
    include: {
      current_team: {
        select: {
          id: true,
          name: true,
          color: true
        }
      }
    }
  });
};

export const updateDriver = async (id: number, data: Prisma.DriverUpdateInput) => {
  return prisma.driver.update({
    where: { id },
    data,
    include: {
      current_team: {
        select: {
          id: true,
          name: true,
          color: true
        }
      }
    }
  });
};

export const deleteDriver = async (id: number) => {
  return prisma.driver.delete({
    where: { id },
  });
};

export const assignDriverToTeam = async (driverId: number, teamId: number) => {
  return prisma.driver.update({
    where: { id: driverId },
    data: { current_team_id: teamId },
    include: {
      current_team: {
        select: {
          id: true,
          name: true,
          color: true
        }
      }
    }
  });
};

export const removeDriverFromTeam = async (driverId: number) => {
  return prisma.driver.update({
    where: { id: driverId },
    data: { current_team_id: null },
    include: {
      current_team: {
        select: {
          id: true,
          name: true,
          color: true
        }
      }
    }
  });
};

export const getDriversByTeam = async (teamId: number) => {
  return prisma.driver.findMany({
    where: { current_team_id: teamId },
    include: {
      current_team: {
        select: {
          id: true,
          name: true,
          color: true
        }
      }
    }
  });
};
