import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
const JWT_EXPIRES_IN = 900;
const JWT_REFRESH_EXPIRES_IN = 604800;

export const register = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
  return user;
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const accessTokenOptions = { expiresIn: JWT_EXPIRES_IN };
  const refreshTokenOptions = { expiresIn: JWT_REFRESH_EXPIRES_IN };

  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, accessTokenOptions);
  const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, refreshTokenOptions);

  return { accessToken, refreshToken };
};

export const refreshAccessToken = (token: string) => {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: number };
    const accessToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ userId: payload.userId }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
};
