import dotenv from 'dotenv';
dotenv.config();

const env = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/f1news',
  DATABASE_URL: process.env.DATABASE_URL || '',
  API_KEY: process.env.API_KEY || 'default-api-key',
};

export default env;