"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApp = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("./config/env"));
const client_1 = require("@prisma/client");
// Routes
const news_routes_1 = __importDefault(require("./routes/news.routes"));
// Tu pourras importer d'autres routes ici
const prisma = new client_1.PrismaClient();
const app = (0, fastify_1.default)({ logger: true });
// Register plugins
app.register(cors_1.default);
app.register(jwt_1.default, {
    secret: env_1.default.JWT_SECRET,
});
// Register routes
app.register(news_routes_1.default);
// Connect to MongoDB
const connectMongo = async () => {
    try {
        await mongoose_1.default.connect(env_1.default.MONGO_URI);
        app.log.info('✅ Connected to MongoDB');
    }
    catch (err) {
        app.log.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};
// Connect to PostgreSQL (Prisma)
const connectPostgres = async () => {
    try {
        await prisma.$connect();
        app.log.info('✅ Connected to PostgreSQL');
    }
    catch (err) {
        app.log.error('❌ PostgreSQL connection error:', err);
        process.exit(1);
    }
};
const startApp = async () => {
    await connectMongo();
    await connectPostgres();
    return app;
};
exports.startApp = startApp;
