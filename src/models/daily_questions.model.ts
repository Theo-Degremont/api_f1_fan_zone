import { Schema, model, Document } from 'mongoose';

export interface IDailyQuestion extends Document {
  questions: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  date: Date;
  created_at: Date;
  is_active: boolean;
}

const DailyQuestionSchema = new Schema<IDailyQuestion>({
  questions: { type: String, required: true },
  answer1: { type: String, required: true },
  answer2: { type: String, required: true },
  answer3: { type: String, required: true },
  answer4: { type: String, required: true },
  date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true }
});

export default model<IDailyQuestion>('DailyQuestion', DailyQuestionSchema);
