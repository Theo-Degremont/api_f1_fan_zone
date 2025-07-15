"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env = {
    PORT: Number(process.env.PORT) || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/f1news',
    DATABASE_URL: process.env.DATABASE_URL || '',
};
exports.default = env;
