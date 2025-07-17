import { FastifyReply, FastifyRequest } from 'fastify';
import * as AuthLogService from '../services/authLog.service';

// Obtenir tous les logs d'une date spécifique
export const getLogsByDate = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { date } = req.params as { date: string };
    
    if (!date) {
      return res.code(400).send({ 
        error: 'Date manquante', 
        message: 'Veuillez fournir une date au format YYYY-MM-DD' 
      });
    }
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.code(400).send({ 
        error: 'Format de date invalide', 
        message: 'Utilisez le format YYYY-MM-DD' 
      });
    }
    
    const logs = await AuthLogService.getLogsByDate(date);
    const stats = await AuthLogService.getDayStats(date);
    
    res.send({
      date,
      total_logs: logs.length,
      statistics: stats,
      logs
    });
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des logs', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

// Obtenir les logs par utilisateur
export const getLogsByUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { userId } = req.params as { userId: string };
    const { limit } = req.query as { limit?: string };
    
    if (!userId) {
      return res.code(400).send({ 
        error: 'ID utilisateur manquant' 
      });
    }
    
    const logs = await AuthLogService.getLogsByUser(
      Number(userId), 
      limit ? Number(limit) : 50
    );
    
    res.send({
      user_id: Number(userId),
      total_logs: logs.length,
      logs
    });
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des logs utilisateur', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

// Obtenir les logs par email
export const getLogsByEmail = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { email } = req.params as { email: string };
    const { limit } = req.query as { limit?: string };
    
    if (!email) {
      return res.code(400).send({ 
        error: 'Email manquant' 
      });
    }
    
    const logs = await AuthLogService.getLogsByEmail(
      email, 
      limit ? Number(limit) : 50
    );
    
    res.send({
      email,
      total_logs: logs.length,
      logs
    });
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des logs par email', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

// Obtenir les logs par action
export const getLogsByAction = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { action } = req.params as { action: string };
    const { date, limit } = req.query as { date?: string; limit?: string };
    
    if (!action) {
      return res.code(400).send({ 
        error: 'Action manquante' 
      });
    }
    
    const validActions = ['LOGIN', 'REGISTER', 'REFRESH_TOKEN', 'LOGOUT'];
    if (!validActions.includes(action.toUpperCase())) {
      return res.code(400).send({ 
        error: 'Action invalide', 
        message: 'Actions valides: LOGIN, REGISTER, REFRESH_TOKEN, LOGOUT' 
      });
    }
    
    const logs = await AuthLogService.getLogsByAction(
      action.toUpperCase() as AuthLogService.LogAction,
      date,
      limit ? Number(limit) : 100
    );
    
    res.send({
      action: action.toUpperCase(),
      date: date || 'all',
      total_logs: logs.length,
      logs
    });
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des logs par action', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

// Obtenir les statistiques d'une journée
export const getDayStats = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { date } = req.params as { date: string };
    
    if (!date) {
      return res.code(400).send({ 
        error: 'Date manquante', 
        message: 'Veuillez fournir une date au format YYYY-MM-DD' 
      });
    }
    
    // Validation du format de date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.code(400).send({ 
        error: 'Format de date invalide', 
        message: 'Utilisez le format YYYY-MM-DD' 
      });
    }
    
    const stats = await AuthLogService.getDayStats(date);
    
    res.send(stats);
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des statistiques', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

// Obtenir les logs récents (dernières 24h)
export const getRecentLogs = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { limit } = req.query as { limit?: string };
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const logs = await AuthLogService.getLogsByDate(
      yesterday.toISOString().split('T')[0]
    );
    
    const recentLogs = logs.slice(0, limit ? Number(limit) : 100);
    
    res.send({
      period: 'last_24h',
      total_logs: recentLogs.length,
      logs: recentLogs
    });
  } catch (error) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des logs récents', 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};
