import News from '../models/news.model';
import { INews } from '../models/news.model';

export const getAllNews = () => News.find().sort({ created_at: -1 });

export const getNewsById = (id: string) => News.findById(id);

export const createNews = (data: Partial<INews>) => News.create(data);

export const updateNews = (id: string, data: Partial<INews>) =>
  News.findByIdAndUpdate(id, { ...data, updated_at: new Date() }, { new: true });