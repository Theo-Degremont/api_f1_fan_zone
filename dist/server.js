"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = __importDefault(require("./config/env"));
const startServer = async () => {
    const app = await (0, app_1.startApp)();
    try {
        await app.listen({ port: env_1.default.PORT, host: '0.0.0.0' });
        console.log(`🚀 Server running at http://localhost:${env_1.default.PORT}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
startServer();
