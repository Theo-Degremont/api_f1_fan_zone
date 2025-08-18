import AnswerUser, { IAnswerUser } from '../models/answerUser.model';
import DailyQuestion from '../models/daily_questions.model';

export interface CreateAnswerData {
  id_user: string;
  id_question: string;
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

export const getTotalVotesForQuestion = async (questionId: string) => {
  const totalVotes = await AnswerUser.countDocuments({ id_question: questionId });
  return { questionId, totalVotes };
};

export const getVotesByAnswer = async (questionId: string) => {
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

export const getUserDailyVote = async (userId: string) => {
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
    id_question: (todayQuestion._id as any).toString()
  });

  return {
    hasVoted: !!userAnswer,
    question: todayQuestion,
    userAnswer: userAnswer,
    message: userAnswer ? 'Vous avez déjà voté aujourd\'hui' : 'Vous n\'avez pas encore voté aujourd\'hui'
  };
};

export const getUserAnswers = async (userId: string) => {
  return await AnswerUser.find({ id_user: userId })
    .sort({ created_at: -1 });
};

export const getQuestionStats = async (questionId: string) => {
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

export const getUserDailyVoteWithStats = async (userId: string) => {
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
      stats: null,
      message: 'Aucune question active aujourd\'hui'
    };
  }

  const userAnswer = await AnswerUser.findOne({
    id_user: userId,
    id_question: (todayQuestion._id as any).toString()
  });

  // Récupérer les statistiques
  const questionId = (todayQuestion._id as any).toString();
  const votes = await AnswerUser.aggregate([
    { $match: { id_question: questionId } },
    { $group: { _id: '$answer', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const voteStats = {
    answer1: 0,
    answer2: 0,
    answer3: 0,
    answer4: 0
  };

  let totalVotes = 0;

  votes.forEach(vote => {
    const answerKey = `answer${vote._id}` as keyof typeof voteStats;
    voteStats[answerKey] = vote.count;
    totalVotes += vote.count;
  });

  // Calculer les pourcentages
  const percentages = {
    answer1: totalVotes > 0 ? Math.round((voteStats.answer1 / totalVotes) * 100) : 0,
    answer2: totalVotes > 0 ? Math.round((voteStats.answer2 / totalVotes) * 100) : 0,
    answer3: totalVotes > 0 ? Math.round((voteStats.answer3 / totalVotes) * 100) : 0,
    answer4: totalVotes > 0 ? Math.round((voteStats.answer4 / totalVotes) * 100) : 0
  };

  return {
    hasVoted: !!userAnswer,
    question: todayQuestion,
    userAnswer: userAnswer,
    stats: {
      votes: voteStats,
      percentages,
      totalVotes,
      date: today.toISOString().split('T')[0]
    },
    message: userAnswer ? 'Vous avez déjà voté aujourd\'hui' : 'Vous n\'avez pas encore voté aujourd\'hui'
  };
};

export const getTodayQuestionStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Trouver la question du jour
  const todayQuestion = await DailyQuestion.findOne({
    date: {
      $gte: today,
      $lt: tomorrow
    },
    is_active: true
  });

  if (!todayQuestion) {
    throw new Error('Aucune question active pour aujourd\'hui');
  }

  // Récupérer les votes pour cette question
  const questionId = (todayQuestion._id as any).toString();
  const votes = await AnswerUser.aggregate([
    { $match: { id_question: questionId } },
    { $group: { _id: '$answer', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const voteStats = {
    answer1: 0,
    answer2: 0,
    answer3: 0,
    answer4: 0
  };

  let totalVotes = 0;

  votes.forEach(vote => {
    const answerKey = `answer${vote._id}` as keyof typeof voteStats;
    voteStats[answerKey] = vote.count;
    totalVotes += vote.count;
  });

  // Calculer les pourcentages
  const percentages = {
    answer1: totalVotes > 0 ? Math.round((voteStats.answer1 / totalVotes) * 100) : 0,
    answer2: totalVotes > 0 ? Math.round((voteStats.answer2 / totalVotes) * 100) : 0,
    answer3: totalVotes > 0 ? Math.round((voteStats.answer3 / totalVotes) * 100) : 0,
    answer4: totalVotes > 0 ? Math.round((voteStats.answer4 / totalVotes) * 100) : 0
  };

  return {
    question: {
      id: todayQuestion._id,
      questions: todayQuestion.questions,
      answer1: todayQuestion.answer1,
      answer2: todayQuestion.answer2,
      answer3: todayQuestion.answer3,
      answer4: todayQuestion.answer4,
      date: todayQuestion.date
    },
    votes: voteStats,
    percentages,
    totalVotes,
    date: today.toISOString().split('T')[0]
  };
};
