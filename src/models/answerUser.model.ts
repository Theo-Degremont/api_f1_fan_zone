import { Schema, model, Document } from 'mongoose';

export interface IAnswerUser extends Document {
  id_user: string;
  id_question: string;
  answer: number;
  created_at: Date;
}

const AnswerUserSchema = new Schema<IAnswerUser>({
  id_user: { type: String, required: true },
  id_question: { type: String, required: true },
  answer: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

export default model<IAnswerUser>('AnswerUser', AnswerUserSchema);
