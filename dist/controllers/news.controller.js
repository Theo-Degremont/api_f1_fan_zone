"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNews = exports.createNews = exports.getNewsById = exports.getAllNews = void 0;
const newsService = __importStar(require("../services/news.service"));
const getAllNews = async (_req, reply) => {
    const news = await newsService.getAllNews();
    reply.send(news);
};
exports.getAllNews = getAllNews;
const getNewsById = async (req, reply) => {
    const news = await newsService.getNewsById(req.params.id);
    if (!news)
        return reply.status(404).send({ message: 'News not found' });
    reply.send(news);
};
exports.getNewsById = getNewsById;
const createNews = async (req, reply) => {
    const created = await newsService.createNews(req.body);
    reply.code(201).send(created);
};
exports.createNews = createNews;
const updateNews = async (req, reply) => {
    const updated = await newsService.updateNews(req.params.id, req.body);
    if (!updated)
        return reply.status(404).send({ message: 'News not found' });
    reply.send(updated);
};
exports.updateNews = updateNews;
