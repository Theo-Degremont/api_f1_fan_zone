import { IDailyQuestion } from "../models/daily_questions.model";
import DailyQuestions from "../models/daily_questions.model";

export const getAllDailyQuestions = () => DailyQuestions.find().sort({ created_at: -1 });

export const getTodayQuestion = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return DailyQuestions.findOne({
    date: {
      $gte: today,
      $lt: tomorrow
    },
    is_active: true
  });
};

export const getDailyQuestionById = (id: string) => DailyQuestions.findById(id);

export const createDailyQuestion = (data: Partial<IDailyQuestion>) => DailyQuestions.create(data);

export const updateDailyQuestion = (id: string, data: Partial<IDailyQuestion>) =>
  DailyQuestions.findByIdAndUpdate(id, { ...data, updated_at: new Date() }, { new: true });