import dotenv from 'dotenv';
dotenv.config();

const env = {
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/f1news',
  DATABASE_URL: process.env.DATABASE_URL || '',
};

export default env;