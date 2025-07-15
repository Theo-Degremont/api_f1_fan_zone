"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNews = exports.createNews = exports.getNewsById = exports.getAllNews = void 0;
const news_model_1 = __importDefault(require("../models/news.model"));
const getAllNews = () => news_model_1.default.find().sort({ created_at: -1 });
exports.getAllNews = getAllNews;
const getNewsById = (id) => news_model_1.default.findById(id);
exports.getNewsById = getNewsById;
const createNews = (data) => news_model_1.default.create(data);
exports.createNews = createNews;
const updateNews = (id, data) => news_model_1.default.findByIdAndUpdate(id, { ...data, updated_at: new Date() }, { new: true });
exports.updateNews = updateNews;
