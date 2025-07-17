import { Schema, model, Document } from 'mongoose';

export interface IAuthLog extends Document {
  action: 'LOGIN' | 'REGISTER' | 'REFRESH_TOKEN' | 'LOGOUT';
  user_id?: number;
  email: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  error_message?: string;
  session_id?: string;
  timestamp: Date;
  metadata?: {
    device_type?: string;
    browser?: string;
    os?: string;
    location?: string;
    previous_login?: Date;
  };
}

const AuthLogSchema = new Schema<IAuthLog>({
  action: { 
    type: String, 
    required: true, 
    enum: ['LOGIN', 'REGISTER', 'REFRESH_TOKEN', 'LOGOUT']
  },
  user_id: { 
    type: Number, 
    required: false 
  },
  email: { 
    type: String, 
    required: true 
  },
  ip_address: { 
    type: String, 
    required: false 
  },
  user_agent: { 
    type: String, 
    required: false 
  },
  success: { 
    type: Boolean, 
    required: true, 
    default: true 
  },
  error_message: { 
    type: String, 
    required: false 
  },
  session_id: { 
    type: String, 
    required: false 
  },
  timestamp: { 
    type: Date, 
    default: Date.now, 
    required: true 
  },
  metadata: {
    device_type: String,
    browser: String,
    os: String,
    location: String,
    previous_login: Date
  }
}, {
  timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

// Index pour améliorer les performances des requêtes
AuthLogSchema.index({ timestamp: -1 });
AuthLogSchema.index({ email: 1 });
AuthLogSchema.index({ action: 1 });
AuthLogSchema.index({ user_id: 1 });

export default model<IAuthLog>('AuthLog', AuthLogSchema);
