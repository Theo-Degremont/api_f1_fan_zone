import { Schema, model, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  content: string;
  image_url?: string;
  link?: string;
  author?: string;
  published_at?: Date;
  created_at: Date;
  updated_at?: Date | null;
  is_active: boolean;
}

const NewsSchema = new Schema<INews>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image_url: { type: String, default: null },
  link: { type: String, default: null },
  author: { type: String, default: null },
  published_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  is_active: { type: Boolean, default: true }
});

export default model<INews>('News', NewsSchema);