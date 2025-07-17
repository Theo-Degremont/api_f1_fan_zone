# 🗳️ API Daily Questions - Guide Postman

## **Système de Questions Quotidiennes**

### **Fonctionnalités :**
- ✅ Répondre à une question du jour
- ✅ Obtenir le nombre total de votes sur une question
- ✅ Obtenir le nombre de votes par réponse
- ✅ Obtenir son vote du jour
- ✅ Voir toutes ses réponses précédentes
- ✅ Obtenir les statistiques complètes d'une question

---

## **🔐 Sécurité**

**Toutes les routes nécessitent :**
- **API Key** : `X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production`
- **JWT Token** : `Authorization: Bearer YOUR_ACCESS_TOKEN`

---

## **📝 Routes disponibles**

| Route | Méthode | Description |
|-------|---------|-------------|
| `/daily-questions/answer` | POST | Répondre à une question |
| `/daily-questions/my-vote` | GET | Mon vote du jour |
| `/daily-questions/my-answers` | GET | Toutes mes réponses |
| `/daily-questions/:id/total-votes` | GET | Nombre total de votes |
| `/daily-questions/:id/votes-by-answer` | GET | Votes par réponse |
| `/daily-questions/:id/stats` | GET | Statistiques complètes |

---

## **🎯 Exemples Postman**

### **1. Répondre à une question du jour**

**POST** `http://localhost:3000/api/daily-questions/answer`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body :**
```json
{
  "id_question": "60f7b3b3b3b3b3b3b3b3b3b3",
  "answer": 2
}
```

**Réponse attendue :**
```json
{
  "message": "Réponse enregistrée avec succès",
  "answer": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "id_user": 1,
    "id_question": "60f7b3b3b3b3b3b3b3b3b3b3",
    "answer": 2,
    "created_at": "2025-07-17T10:30:00.000Z"
  }
}
```

### **2. Obtenir mon vote du jour**

**GET** `http://localhost:3000/api/daily-questions/my-vote`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Réponse attendue (déjà voté) :**
```json
{
  "hasVoted": true,
  "question": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "questions": "Qui va remporter le championnat 2025 ?",
    "answer1": "Max Verstappen",
    "answer2": "Lewis Hamilton",
    "answer3": "Charles Leclerc",
    "answer4": "Lando Norris",
    "date": "2025-07-17T00:00:00.000Z",
    "is_active": true
  },
  "userAnswer": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "answer": 2,
    "created_at": "2025-07-17T10:30:00.000Z"
  },
  "message": "Vous avez déjà voté aujourd'hui"
}
```

**Réponse attendue (pas encore voté) :**
```json
{
  "hasVoted": false,
  "question": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "questions": "Qui va remporter le championnat 2025 ?",
    "answer1": "Max Verstappen",
    "answer2": "Lewis Hamilton",
    "answer3": "Charles Leclerc",
    "answer4": "Lando Norris",
    "date": "2025-07-17T00:00:00.000Z",
    "is_active": true
  },
  "userAnswer": null,
  "message": "Vous n'avez pas encore voté aujourd'hui"
}
```

### **3. Obtenir le nombre total de votes sur une question**

**GET** `http://localhost:3000/api/daily-questions/60f7b3b3b3b3b3b3b3b3b3b3/total-votes`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Réponse attendue :**
```json
{
  "questionId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "totalVotes": 1547
}
```

### **4. Obtenir le nombre de votes par réponse**

**GET** `http://localhost:3000/api/daily-questions/60f7b3b3b3b3b3b3b3b3b3b3/votes-by-answer`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Réponse attendue :**
```json
{
  "questionId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "votes": {
    "answer1": 612,
    "answer2": 489,
    "answer3": 301,
    "answer4": 145
  },
  "totalVotes": 1547
}
```

### **5. Obtenir les statistiques complètes d'une question**

**GET** `http://localhost:3000/api/daily-questions/60f7b3b3b3b3b3b3b3b3b3b3/stats`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Réponse attendue :**
```json
{
  "question": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "questions": "Qui va remporter le championnat 2025 ?",
    "answer1": "Max Verstappen",
    "answer2": "Lewis Hamilton",
    "answer3": "Charles Leclerc",
    "answer4": "Lando Norris",
    "date": "2025-07-17T00:00:00.000Z",
    "is_active": true
  },
  "votes": {
    "answer1": 612,
    "answer2": 489,
    "answer3": 301,
    "answer4": 145
  },
  "percentages": {
    "answer1": 40,
    "answer2": 32,
    "answer3": 19,
    "answer4": 9
  },
  "totalVotes": 1547
}
```

### **6. Obtenir toutes mes réponses**

**GET** `http://localhost:3000/api/daily-questions/my-answers`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Réponse attendue :**
```json
{
  "userId": 1,
  "totalAnswers": 15,
  "answers": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "id_user": 1,
      "id_question": "60f7b3b3b3b3b3b3b3b3b3b3",
      "answer": 2,
      "created_at": "2025-07-17T10:30:00.000Z"
    }
  ]
}
```

---

## **🎮 Workflow d'utilisation**

### **1. Prérequis**
1. **Se connecter** et obtenir un access token
2. **Créer une question** (via les routes daily-questions)

### **2. Utilisation quotidienne**
1. **Vérifier si j'ai voté** : `GET /daily-questions/my-vote`
2. **Répondre si pas encore fait** : `POST /daily-questions/answer`
3. **Voir les résultats** : `GET /daily-questions/:id/stats`

### **3. Analyse des résultats**
1. **Stats complètes** : `GET /daily-questions/:id/stats`
2. **Mes réponses historiques** : `GET /daily-questions/my-answers`

---

## **⚠️ Règles importantes**

### **Réponses valides :**
- **1** = Réponse 1 (answer1)
- **2** = Réponse 2 (answer2)
- **3** = Réponse 3 (answer3)
- **4** = Réponse 4 (answer4)

### **Contraintes :**
- ✅ Un utilisateur ne peut voter qu'une seule fois par question
- ✅ Les réponses doivent être entre 1 et 4
- ✅ Toutes les routes nécessitent API Key + JWT

### **Erreurs communes :**

**1. Réponse invalide :**
```json
{
  "error": "Erreur lors de l'enregistrement de la réponse",
  "message": "Réponse invalide. Doit être 1, 2, 3 ou 4"
}
```

**2. Déjà voté :**
```json
{
  "error": "Erreur lors de l'enregistrement de la réponse",
  "message": "Vous avez déjà répondu à cette question"
}
```

**3. Question introuvable :**
```json
{
  "error": "Erreur lors de l'enregistrement de la réponse",
  "message": "Question non trouvée"
}
```

---

## **📊 Collection Postman recommandée**

```
📁 Daily Questions API
├── 📁 Authentication
│   ├── Register User
│   └── Login User
├── 📁 Voting
│   ├── Answer Question
│   └── My Daily Vote
├── 📁 Statistics
│   ├── Total Votes
│   ├── Votes by Answer
│   └── Complete Stats
└── 📁 User Data
    └── My Answers History
```

**Votre système de questions quotidiennes est maintenant prêt !** 🗳️✨
