import AuthLog, { IAuthLog } from '../models/authLog.model';
import { FastifyRequest } from 'fastify';

// Types pour les actions de log
export type LogAction = 'LOGIN' | 'REGISTER' | 'REFRESH_TOKEN' | 'LOGOUT';

// Interface pour créer un log
export interface CreateLogData {
  action: LogAction;
  user_id?: number;
  email: string;
  success: boolean;
  error_message?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: {
    device_type?: string;
    browser?: string;
    os?: string;
    location?: string;
    previous_login?: Date;
  };
}

// Extraire les informations de la requête
export const extractRequestInfo = (req: FastifyRequest) => {
  const ip = req.ip || 
             req.headers['x-forwarded-for'] as string || 
             req.headers['x-real-ip'] as string || 
             req.socket.remoteAddress || 
             'unknown';
             
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  // Parser basique du user agent
  const parseUserAgent = (ua: string) => {
    const device_type = /Mobile|Android|iPhone|iPad/.test(ua) ? 'mobile' : 'desktop';
    let browser = 'unknown';
    let os = 'unknown';
    
    // Détection du navigateur
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    
    // Détection de l'OS
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS')) os = 'iOS';
    
    return { device_type, browser, os };
  };
  
  const metadata = parseUserAgent(userAgent);
  
  return {
    ip_address: Array.isArray(ip) ? ip[0] : ip,
    user_agent: userAgent,
    metadata
  };
};

// Créer un log d'authentification
export const createAuthLog = async (data: CreateLogData, req?: FastifyRequest): Promise<IAuthLog> => {
  let logData = { ...data };
  
  // Si une requête est fournie, extraire les informations
  if (req) {
    const requestInfo = extractRequestInfo(req);
    logData = {
      ...logData,
      ip_address: requestInfo.ip_address,
      user_agent: requestInfo.user_agent,
      metadata: {
        ...logData.metadata,
        ...requestInfo.metadata
      }
    };
  }
  
  const authLog = new AuthLog(logData);
  return await authLog.save();
};

// Log pour une connexion réussie
export const logSuccessfulLogin = async (email: string, user_id: number, req?: FastifyRequest, session_id?: string) => {
  return await createAuthLog({
    action: 'LOGIN',
    user_id,
    email,
    success: true,
    session_id
  }, req);
};

// Log pour une connexion échouée
export const logFailedLogin = async (email: string, error_message: string, req?: FastifyRequest) => {
  return await createAuthLog({
    action: 'LOGIN',
    email,
    success: false,
    error_message
  }, req);
};

// Log pour une inscription réussie
export const logSuccessfulRegister = async (email: string, user_id: number, req?: FastifyRequest) => {
  return await createAuthLog({
    action: 'REGISTER',
    user_id,
    email,
    success: true
  }, req);
};

// Log pour une inscription échouée
export const logFailedRegister = async (email: string, error_message: string, req?: FastifyRequest) => {
  return await createAuthLog({
    action: 'REGISTER',
    email,
    success: false,
    error_message
  }, req);
};

// Log pour un refresh token réussi
export const logSuccessfulRefreshToken = async (email: string, user_id: number, req?: FastifyRequest, session_id?: string) => {
  return await createAuthLog({
    action: 'REFRESH_TOKEN',
    user_id,
    email,
    success: true,
    session_id
  }, req);
};

// Log pour un refresh token échoué
export const logFailedRefreshToken = async (email: string, error_message: string, req?: FastifyRequest) => {
  return await createAuthLog({
    action: 'REFRESH_TOKEN',
    email,
    success: false,
    error_message
  }, req);
};

// Log pour une déconnexion
export const logLogout = async (email: string, user_id: number, req?: FastifyRequest, session_id?: string) => {
  return await createAuthLog({
    action: 'LOGOUT',
    user_id,
    email,
    success: true,
    session_id
  }, req);
};

// Obtenir tous les logs d'une date spécifique
export const getLogsByDate = async (date: string) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  return await AuthLog.find({
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ timestamp: -1 });
};

// Obtenir les logs par utilisateur
export const getLogsByUser = async (user_id: number, limit: number = 50) => {
  return await AuthLog.find({ user_id })
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Obtenir les logs par email
export const getLogsByEmail = async (email: string, limit: number = 50) => {
  return await AuthLog.find({ email })
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Obtenir les logs par action
export const getLogsByAction = async (action: LogAction, date?: string, limit: number = 100) => {
  let query: any = { action };
  
  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    query.timestamp = {
      $gte: startDate,
      $lte: endDate
    };
  }
  
  return await AuthLog.find(query)
    .sort({ timestamp: -1 })
    .limit(limit);
};

export const getDayStats = async (date: string) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  const stats = await AuthLog.aggregate([
    {
      $match: {
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          action: '$action',
          success: '$success'
        },
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    date,
    total_events: 0,
    successful_logins: 0,
    failed_logins: 0,
    registrations: 0,
    failed_registrations: 0,
    refresh_tokens: 0,
    failed_refresh_tokens: 0,
    logouts: 0
  };
  
  stats.forEach(stat => {
    const { action, success } = stat._id;
    const count = stat.count;
    result.total_events += count;
    
    switch (action) {
      case 'LOGIN':
        if (success) result.successful_logins += count;
        else result.failed_logins += count;
        break;
      case 'REGISTER':
        if (success) result.registrations += count;
        else result.failed_registrations += count;
        break;
      case 'REFRESH_TOKEN':
        if (success) result.refresh_tokens += count;
        else result.failed_refresh_tokens += count;
        break;
      case 'LOGOUT':
        result.logouts += count;
        break;
    }
  });
  
  return result;
};
