import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
  favorite_team_id?: number;
  favorite_driver_id?: number;
}) => {
  return prisma.user.create({
    data,
  });
};

export const getAllUsers = () => prisma.user.findMany();

export const getUserById = (id: number) =>
  prisma.user.findUnique({ where: { id } });

export const updateUser = (id: number, data: Partial<Omit<Parameters<typeof createUser>[0], 'password'>>) =>
  prisma.user.update({
    where: { id },
    data: {
      ...data,
      modified_at: new Date(),
    },
  });

export const deleteUser = (id: number) =>
  prisma.user.delete({ where: { id } });

export const checkEmailAvailability = async (email: string) => {
  const existingUser = await prisma.user.findFirst({
    where: { email }
  });
  return { available: !existingUser };
};