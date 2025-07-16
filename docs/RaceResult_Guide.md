# 🏁 API RaceResult - Guide Postman

## **Modèle RaceResult amélioré**

### **Structure du modèle :**
```prisma
model RaceResult {
  id           Int       @id @default(autoincrement())
  race_id      Int       // ID de la course
  driver_id    Int       // ID du pilote
  position     Int       // 0 = hors course, 1 = 1er, 2 = 2ème, etc.
  points       Int       // Points obtenus
  fastest_lap  DateTime? // Heure du tour le plus rapide (optionnel)
  lap_time     Int?      // Temps du tour le plus rapide en millisecondes
  total_time   Int?      // Temps total de course en millisecondes
  status       String    // FINISHED, DNF, DSQ, DNS
  created_at   DateTime  // Date de création
  driver       Driver    // Relation avec le pilote
  race         Race      // Relation avec la course
}
```

### **Logique de position :**
- **Position 0** : Pilote hors course (DNF, DSQ, DNS)
- **Position 1-20** : Classement final (1er, 2ème, 3ème, etc.)

---

## **🔐 Sécurité des routes**

| Route | Clé API | Access Token | Description |
|-------|---------|--------------|-------------|
| `POST /race-results` | ✅ | ❌ | Créer un résultat |
| `PUT /race-results/:id` | ✅ | ❌ | Modifier un résultat |
| `DELETE /race-results/:id` | ✅ | ❌ | Supprimer un résultat |
| `GET /race-results` | ✅ | ✅ | Lire tous les résultats |
| `GET /race-results/:id` | ✅ | ✅ | Lire un résultat spécifique |
| `GET /races/:raceId/results` | ✅ | ✅ | Résultats d'une course |
| `GET /races/:raceId/ranking` | ✅ | ✅ | Classement final |
| `GET /races/:raceId/dnf` | ✅ | ✅ | Pilotes hors course |
| `GET /races/:raceId/stats` | ✅ | ✅ | Statistiques de course |
| `GET /drivers/:driverId/results` | ✅ | ✅ | Résultats d'un pilote |

---

## **📝 Exemples Postman**

### **1. Créer un résultat de course**

**POST** `http://localhost:3000/api/race-results`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
Content-Type: application/json
```

**Body (Pilote classé 1er) :**
```json
{
  "race_id": 1,
  "driver_id": 1,
  "position": 1,
  "points": 25,
  "fastest_lap": "2025-05-25T14:45:30.000Z"
}
```

**Body (Pilote classé 3ème) :**
```json
{
  "race_id": 1,
  "driver_id": 2,
  "position": 3,
  "points": 15
}
```

**Body (Pilote hors course) :**
```json
{
  "race_id": 1,
  "driver_id": 3,
  "position": 0,
  "points": 0
}
```

### **2. Obtenir le classement final d'une course**

**GET** `http://localhost:3000/api/races/1/ranking`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### **3. Obtenir les pilotes hors course**

**GET** `http://localhost:3000/api/races/1/dnf`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### **4. Obtenir les statistiques d'une course**

**GET** `http://localhost:3000/api/races/1/stats`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Réponse attendue :**
```json
{
  "totalDrivers": 20,
  "finishedDrivers": 18,
  "dnfDrivers": 2
}
```

### **5. Obtenir tous les résultats d'un pilote**

**GET** `http://localhost:3000/api/drivers/1/results`

**Headers :**
```
X-API-Key: f1-api-key-2025-secure-access-f1fanzone-production
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## **🏆 Exemple complet de course**

Voici comment créer un classement complet pour une course :

```json
// 1er - Lewis Hamilton (25 points)
{
  "race_id": 1,
  "driver_id": 1,
  "position": 1,
  "points": 25,
  "fastest_lap": "2025-05-25T14:45:30.000Z"
}

// 2ème - Max Verstappen (18 points)
{
  "race_id": 1,
  "driver_id": 2,
  "position": 2,
  "points": 18
}

// 3ème - Charles Leclerc (15 points)
{
  "race_id": 1,
  "driver_id": 3,
  "position": 3,
  "points": 15
}

// Hors course - Fernando Alonso (0 points)
{
  "race_id": 1,
  "driver_id": 4,
  "position": 0,
  "points": 0
}
```

---

## **📊 Système de points F1**

| Position | Points |
|----------|--------|
| 1er | 25 |
| 2ème | 18 |
| 3ème | 15 |
| 4ème | 12 |
| 5ème | 10 |
| 6ème | 8 |
| 7ème | 6 |
| 8ème | 4 |
| 9ème | 2 |
| 10ème | 1 |
| 11ème+ | 0 |
| DNF/DSQ/DNS | 0 |

---

## **⚠️ Erreurs communes**

1. **Pilote/Course inexistant** : Vérifiez que `race_id` et `driver_id` existent
2. **Doublon** : Un pilote ne peut avoir qu'un seul résultat par course
3. **Position invalide** : Utilisez 0 pour hors course, 1+ pour classé
4. **Access token manquant** : Routes de lecture nécessitent JWT

---

## **🔄 Workflow recommandé**

1. **Créer une course** (`POST /api/races`)
2. **Créer des pilotes** (`POST /api/drivers`)
3. **Créer les résultats** (`POST /api/race-results`)
4. **Consulter le classement** (`GET /api/races/:id/ranking`)
5. **Voir les statistiques** (`GET /api/races/:id/stats`)

Cette implémentation vous permet de reconstruire facilement le classement final de n'importe quelle course F1 ! 🏁
