# 📊 API Authentication Logs - Guide Postman

## **Système de Logging d'Authentification**

### **Fonctionnalités :**
- ✅ **Logs automatiques** : Connexions, inscriptions, refresh tokens
- ✅ **Informations détaillées** : IP, User-Agent, Device, Browser, OS
- ✅ **Statistiques** : Compteurs par jour et par action
- ✅ **Recherche flexible** : Par date, utilisateur, email, action
- ✅ **Détection des échecs** : Tentatives de connexion échouées

---

## **🔐 Sécurité**

**Toutes les routes nécessitent uniquement :**
- **API Key** : `X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production`

> **Note :** Le token JWT (Bearer) n'est pas requis pour accéder aux logs d'authentification.

---

## **📋 Structure des Logs**

### **Modèle AuthLog :**
```typescript
{
  _id: "ObjectId",
  action: "LOGIN" | "REGISTER" | "REFRESH_TOKEN" | "LOGOUT",
  user_id: number,
  email: string,
  ip_address: string,
  user_agent: string,
  success: boolean,
  error_message?: string,
  session_id?: string,
  timestamp: Date,
  metadata: {
    device_type: "mobile" | "desktop",
    browser: "Chrome" | "Firefox" | "Safari" | "Edge",
    os: "Windows" | "macOS" | "Linux" | "Android" | "iOS",
    location?: string,
    previous_login?: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## **🚀 Routes disponibles**

| Route | Méthode | Description |
|-------|---------|-------------|
| `/auth-logs/date/:date` | GET | **Logs d'une date spécifique** |
| `/auth-logs/stats/:date` | GET | Statistiques d'une journée |
| `/auth-logs/user/:userId` | GET | Logs d'un utilisateur |
| `/auth-logs/email/:email` | GET | Logs d'un email |
| `/auth-logs/action/:action` | GET | Logs par action |
| `/auth-logs/recent` | GET | Logs récents (24h) |

---

## **📝 Exemples Postman**

### **1. Obtenir tous les logs d'une date spécifique**

**GET** `http://localhost:3000/api/auth-logs/date/2025-07-17`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
```

**Réponse attendue :**
```json
{
  "date": "2025-07-17",
  "total_logs": 45,
  "statistics": {
    "date": "2025-07-17",
    "total_events": 45,
    "successful_logins": 38,
    "failed_logins": 3,
    "registrations": 2,
    "failed_registrations": 0,
    "refresh_tokens": 15,
    "failed_refresh_tokens": 1,
    "logouts": 8
  },
  "logs": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "action": "LOGIN",
      "user_id": 123,
      "email": "user@example.com",
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "success": true,
      "timestamp": "2025-07-17T10:30:15.000Z",
      "metadata": {
        "device_type": "desktop",
        "browser": "Chrome",
        "os": "macOS"
      }
    }
  ]
}
```

### **2. Obtenir les statistiques d'une journée**

**GET** `http://localhost:3000/api/auth-logs/stats/2025-07-17`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
```

**Réponse attendue :**
```json
{
  "date": "2025-07-17",
  "total_events": 45,
  "successful_logins": 38,
  "failed_logins": 3,
  "registrations": 2,
  "failed_registrations": 0,
  "refresh_tokens": 15,
  "failed_refresh_tokens": 1,
  "logouts": 8
}
```

### **3. Obtenir les logs d'un utilisateur spécifique**

**GET** `http://localhost:3000/api/auth-logs/user/123?limit=20`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
```

**Réponse attendue :**
```json
{
  "user_id": 123,
  "total_logs": 15,
  "logs": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "action": "LOGIN",
      "user_id": 123,
      "email": "user@example.com",
      "success": true,
      "timestamp": "2025-07-17T10:30:15.000Z",
      "ip_address": "192.168.1.100",
      "metadata": {
        "device_type": "desktop",
        "browser": "Chrome",
        "os": "macOS"
      }
    }
  ]
}
```

### **4. Obtenir les logs par email**

**GET** `http://localhost:3000/api/auth-logs/email/user@example.com`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
```

### **5. Obtenir les logs par action**

**GET** `http://localhost:3000/api/auth-logs/action/LOGIN?date=2025-07-17&limit=50`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
```

**Réponse attendue :**
```json
{
  "action": "LOGIN",
  "date": "2025-07-17",
  "total_logs": 41,
  "logs": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "action": "LOGIN",
      "success": true,
      "email": "user1@example.com",
      "timestamp": "2025-07-17T10:30:15.000Z"
    },
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "action": "LOGIN",
      "success": false,
      "email": "hacker@evil.com",
      "error_message": "Invalid credentials",
      "timestamp": "2025-07-17T09:15:42.000Z"
    }
  ]
}
```

### **6. Obtenir les logs récents (24h)**

**GET** `http://localhost:3000/api/auth-logs/recent?limit=100`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
```

---

## **🎯 Actions automatiquement loggées**

### **1. Inscription (REGISTER) :**
- ✅ **Succès** : Nouveau compte créé
- ❌ **Échec** : Email déjà utilisé, données invalides

### **2. Connexion (LOGIN) :**
- ✅ **Succès** : Authentification réussie
- ❌ **Échec** : Email/mot de passe incorrect

### **3. Refresh Token (REFRESH_TOKEN) :**
- ✅ **Succès** : Token renouvelé
- ❌ **Échec** : Token expiré ou invalide

### **4. Déconnexion (LOGOUT) :**
- ✅ **Succès** : Session terminée

---

## **📊 Cas d'usage pratiques**

### **1. Analyse de sécurité :**
```
GET /auth-logs/action/LOGIN?date=2025-07-17
→ Identifier les tentatives de connexion échouées
```

### **2. Monitoring utilisateur :**
```
GET /auth-logs/user/123
→ Historique complet d'un utilisateur
```

### **3. Analyse quotidienne :**
```
GET /auth-logs/stats/2025-07-17
→ Résumé des activités du jour
```

### **4. Détection d'anomalies :**
```
GET /auth-logs/email/suspect@example.com
→ Activité d'un email spécifique
```

---

## **⚠️ Paramètres de requête**

### **Paramètres supportés :**

| Paramètre | Description | Exemple |
|-----------|-------------|---------|
| `limit` | Limite le nombre de résultats | `?limit=50` |
| `date` | Filtre par date (pour action) | `?date=2025-07-17` |

### **Formats de date :**
- **Format requis** : `YYYY-MM-DD`
- **Exemple valide** : `2025-07-17`
- **Exemple invalide** : `17/07/2025`

---

## **🔍 Informations détectées automatiquement**

### **Détection IP :**
- Headers `X-Forwarded-For`
- Headers `X-Real-IP`
- Socket `remoteAddress`

### **Détection Device/Browser :**
- **Mobile** : Android, iPhone, iPad
- **Desktop** : Autres appareils
- **Browsers** : Chrome, Firefox, Safari, Edge
- **OS** : Windows, macOS, Linux, Android, iOS

---

## **📈 Collection Postman recommandée**

```
📁 Auth Logs API
├── 📁 Daily Analysis
│   ├── Get Logs by Date
│   └── Get Daily Stats
├── 📁 User Tracking
│   ├── Get User Logs
│   └── Get Email Logs
├── 📁 Security Analysis
│   ├── Failed Logins
│   ├── Recent Activity
│   └── Action Analysis
└── 📁 Monitoring
    ├── Recent Logs
    └── Registration Tracking
```

---

## **🎮 Workflow de monitoring**

### **1. Monitoring quotidien :**
1. **Statistiques du jour** : `GET /auth-logs/stats/2025-07-17`
2. **Connexions échouées** : `GET /auth-logs/action/LOGIN?date=2025-07-17`
3. **Nouvelles inscriptions** : `GET /auth-logs/action/REGISTER?date=2025-07-17`

### **2. Investigation utilisateur :**
1. **Historique complet** : `GET /auth-logs/user/123`
2. **Activité par email** : `GET /auth-logs/email/user@example.com`

### **3. Analyse de sécurité :**
1. **Activité récente** : `GET /auth-logs/recent`
2. **Tentatives échouées** : Filter les logs avec `success: false`

**Votre système de logging d'authentification est maintenant opérationnel !** 📊🔐

Les logs sont automatiquement créés à chaque action d'authentification et vous pouvez maintenant surveiller toute l'activité de votre API !
