import AnswerUser, { IAnswerUser } from '../models/answerUser.model';
import DailyQuestion from '../models/daily_questions.model';


export interface CreateAnswerData {
  id_user: number;
  id_question: number;
  answer: number;
}


export const createAnswer = async (data: CreateAnswerData): Promise<IAnswerUser> => {
  const question = await DailyQuestion.findById(data.id_question);
  if (!question) {
    throw new Error('Question non trouvée');
  }

  if (data.answer < 1 || data.answer > 4) {
    throw new Error('Réponse invalide. Doit être 1, 2, 3 ou 4');
  }

  const existingAnswer = await AnswerUser.findOne({
    id_user: data.id_user,
    id_question: data.id_question
  });

  if (existingAnswer) {
    throw new Error('Vous avez déjà répondu à cette question');
  }

  const answer = new AnswerUser(data);
  return await answer.save();
};

export const getTotalVotesForQuestion = async (questionId: number) => {
  const totalVotes = await AnswerUser.countDocuments({ id_question: questionId });
  return { questionId, totalVotes };
};

export const getVotesByAnswer = async (questionId: number) => {
  const votes = await AnswerUser.aggregate([
    { $match: { id_question: questionId } },
    { $group: { _id: '$answer', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const result = {
    questionId,
    votes: {
      answer1: 0,
      answer2: 0,
      answer3: 0,
      answer4: 0
    },
    totalVotes: 0
  };

  votes.forEach(vote => {
    const answerKey = `answer${vote._id}` as keyof typeof result.votes;
    result.votes[answerKey] = vote.count;
    result.totalVotes += vote.count;
  });

  return result;
};

export const getUserDailyVote = async (userId: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayQuestion = await DailyQuestion.findOne({
    date: {
      $gte: today,
      $lt: tomorrow
    },
    is_active: true
  });

  if (!todayQuestion) {
    return {
      hasVoted: false,
      question: null,
      userAnswer: null,
      message: 'Aucune question active aujourd\'hui'
    };
  }

  const userAnswer = await AnswerUser.findOne({
    id_user: userId,
    id_question: todayQuestion._id
  });

  return {
    hasVoted: !!userAnswer,
    question: todayQuestion,
    userAnswer: userAnswer,
    message: userAnswer ? 'Vous avez déjà voté aujourd\'hui' : 'Vous n\'avez pas encore voté aujourd\'hui'
  };
};

export const getUserAnswers = async (userId: number) => {
  return await AnswerUser.find({ id_user: userId })
    .sort({ created_at: -1 })
    .populate('id_question');
};

export const getQuestionStats = async (questionId: number) => {
  const question = await DailyQuestion.findById(questionId);
  if (!question) {
    throw new Error('Question non trouvée');
  }

  const votesByAnswer = await getVotesByAnswer(questionId);
  
  const percentages = {
    answer1: votesByAnswer.totalVotes > 0 ? Math.round((votesByAnswer.votes.answer1 / votesByAnswer.totalVotes) * 100) : 0,
    answer2: votesByAnswer.totalVotes > 0 ? Math.round((votesByAnswer.votes.answer2 / votesByAnswer.totalVotes) * 100) : 0,
    answer3: votesByAnswer.totalVotes > 0 ? Math.round((votesByAnswer.votes.answer3 / votesByAnswer.totalVotes) * 100) : 0,
    answer4: votesByAnswer.totalVotes > 0 ? Math.round((votesByAnswer.votes.answer4 / votesByAnswer.totalVotes) * 100) : 0
  };

  return {
    question,
    votes: votesByAnswer.votes,
    percentages,
    totalVotes: votesByAnswer.totalVotes
  };
};
