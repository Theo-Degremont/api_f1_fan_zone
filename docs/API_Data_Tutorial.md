# 🏎️ Tutoriel - Ajout de données dans l'API F1 Fan Zone

## 📋 Table des matières
1. [Configuration de base](#configuration-de-base)
2. [Ajout d'équipes (Teams)](#ajout-déquipes-teams)
3. [Ajout de pilotes (Drivers)](#ajout-de-pilotes-drivers)
4. [Ajout de courses (Races)](#ajout-de-courses-races)
5. [Ajout de résultats (RaceResults)](#ajout-de-résultats-raceresults)
6. [Ajout de classements](#ajout-de-classements)
7. [Scripts d'automatisation](#scripts-dautomatisation)

---

## Configuration de base

### 🔑 Authentification
Toutes les requêtes nécessitent une clé API dans le header :
```bash
X-API-Key: your-api-key-here
```

### 🔐 Routes sécurisées
Certaines routes nécessitent un token JWT en plus de la clé API :
```bash
Authorization: Bearer your-jwt-token-here
```

### 🌐 URL de base
```
http://localhost:3000
```

---

## Ajout d'équipes (Teams)

### ✅ Route publique (clé API uniquement)
```bash
POST /teams
```

### 📝 Structure des données
```json
{
  "key": "mercedes",
  "name": "Mercedes-AMG Petronas F1 Team",
  "date_start": "2010-01-01T00:00:00Z",
  "date_end": null,
  "nb_victory": 125,
  "nb_podiums": 290,
  "nb_pole": 135,
  "color": "#00D2BE",
  "nb_championship": 8,
  "nb_race": 280
}
```

### 🚀 Exemple avec curl
```bash
curl -X POST http://localhost:3000/teams \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "key": "mercedes",
    "name": "Mercedes-AMG Petronas F1 Team",
    "date_start": "2010-01-01T00:00:00Z",
    "date_end": null,
    "nb_victory": 125,
    "nb_podiums": 290,
    "nb_pole": 135,
    "color": "#00D2BE",
    "nb_championship": 8,
    "nb_race": 280
  }'
```

### 📊 Exemples d'équipes 2024
```json
// Red Bull Racing
{
  "key": "red-bull",
  "name": "Oracle Red Bull Racing",
  "date_start": "2005-01-01T00:00:00Z",
  "date_end": null,
  "nb_victory": 115,
  "color": "#0600EF",
  "nb_championship": 6,
  "nb_race": 380
}

// Ferrari
{
  "key": "ferrari",
  "name": "Scuderia Ferrari",
  "date_start": "1950-01-01T00:00:00Z",
  "date_end": null,
  "nb_victory": 245,
  "color": "#DC143C",
  "nb_championship": 16,
  "nb_race": 1050
}

// McLaren
{
  "key": "mclaren",
  "name": "McLaren Formula 1 Team",
  "date_start": "1966-01-01T00:00:00Z",
  "date_end": null,
  "nb_victory": 185,
  "color": "#FF8700",
  "nb_championship": 8,
  "nb_race": 900
}
```

---

## Ajout de pilotes (Drivers)

### ✅ Route publique (clé API uniquement)
```bash
POST /drivers
```

### 📝 Structure des données
```json
{
  "key": "hamilton-lewis",
  "name": "Lewis",
  "surname": "Hamilton",
  "number": 44,
  "nb_championship": 7,
  "nb_pole": 104,
  "nb_podiums": 198,
  "nb_race": 350,
  "nb_victory": 103,
  "current_team_id": 1
}
```

### 🚀 Exemple avec curl
```bash
curl -X POST http://localhost:3000/drivers \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "key": "hamilton-lewis",
    "name": "Lewis",
    "surname": "Hamilton",
    "number": 44,
    "nb_championship": 7,
    "nb_pole": 104,
    "nb_podiums": 198,
    "nb_race": 350,
    "nb_victory": 103,
    "current_team_id": 1
  }'
```

### 📊 Exemples de pilotes 2024
```json
// Max Verstappen
{
  "key": "verstappen-max",
  "name": "Max",
  "surname": "Verstappen",
  "number": 1,
  "nb_championship": 3,
  "nb_pole": 34,
  "nb_race": 180,
  "nb_victory": 56,
  "current_team_id": 2
}

// Charles Leclerc
{
  "key": "leclerc-charles",
  "name": "Charles",
  "surname": "Leclerc",
  "number": 16,
  "nb_championship": 0,
  "nb_pole": 25,
  "nb_race": 130,
  "nb_victory": 5,
  "current_team_id": 3
}

// Lando Norris
{
  "key": "norris-lando",
  "name": "Lando",
  "surname": "Norris",
  "number": 4,
  "nb_championship": 0,
  "nb_pole": 7,
  "nb_race": 120,
  "nb_victory": 4,
  "current_team_id": 4
}
```

---

## Ajout de courses (Races)

### ✅ Route publique (clé API uniquement)
```bash
POST /races
```

### 📝 Structure des données
```json
{
  "race_name": "Monaco Grand Prix",
  "track_name": "Circuit de Monaco",
  "country": "Monaco",
  "city": "Monte Carlo",
  "started_at": "2024-05-26T15:00:00Z",
  "nb_laps": 78,
  "nb_curve": 19,
  "duration": 6180000
}
```

### 🚀 Exemple avec curl
```bash
curl -X POST http://localhost:3000/races \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "race_name": "Monaco Grand Prix",
    "track_name": "Circuit de Monaco",
    "country": "Monaco",
    "city": "Monte Carlo",
    "started_at": "2024-05-26T15:00:00Z",
    "nb_laps": 78,
    "nb_curve": 19,
    "duration": 6180000
  }'
```

### 📊 Exemples de courses 2024
```json
// Bahrain GP
{
  "race_name": "Bahrain Grand Prix",
  "track_name": "Bahrain International Circuit",
  "country": "Bahrain",
  "city": "Sakhir",
  "started_at": "2024-03-02T15:00:00Z",
  "nb_laps": 57,
  "nb_curve": 15,
  "duration": 5400000
}

// Saudi Arabian GP
{
  "race_name": "Saudi Arabian Grand Prix",
  "track_name": "Jeddah Corniche Circuit",
  "country": "Saudi Arabia",
  "city": "Jeddah",
  "started_at": "2024-03-09T18:00:00Z",
  "nb_laps": 50,
  "nb_curve": 27,
  "duration": 5100000
}

// Australian GP
{
  "race_name": "Australian Grand Prix",
  "track_name": "Albert Park Circuit",
  "country": "Australia",
  "city": "Melbourne",
  "started_at": "2024-03-24T05:00:00Z",
  "nb_laps": 58,
  "nb_curve": 16,
  "duration": 5280000
}
```

---

## Ajout de résultats (RaceResults)

### ✅ Route publique (clé API uniquement)
```bash
POST /race-results
```

### 📝 Structure des données
```json
{
  "race_id": 1,
  "driver_id": 1,
  "position": 1,
  "points": 25,
  "fastest_lap": "2024-05-26T15:45:32Z",
  "lap_time": 74528,
  "total_time": 5825000,
  "status": "FINISHED"
}
```

### 🚀 Exemple avec curl
```bash
curl -X POST http://localhost:3000/race-results \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "race_id": 1,
    "driver_id": 1,
    "position": 1,
    "points": 25,
    "fastest_lap": "2024-05-26T15:45:32Z",
    "lap_time": 74528,
    "total_time": 5825000,
    "status": "FINISHED"
  }'
```

### 📊 Exemple de podium Monaco 2024
```json
// 1er place - Charles Leclerc
{
  "race_id": 1,
  "driver_id": 3,
  "position": 1,
  "points": 25,
  "fastest_lap": "2024-05-26T15:45:32Z",
  "lap_time": 74528,
  "total_time": 5825000,
  "status": "FINISHED"
}

// 2ème place - Oscar Piastri
{
  "race_id": 1,
  "driver_id": 5,
  "position": 2,
  "points": 18,
  "fastest_lap": "2024-05-26T15:47:15Z",
  "lap_time": 74892,
  "total_time": 5830000,
  "status": "FINISHED"
}

// 3ème place - Carlos Sainz
{
  "race_id": 1,
  "driver_id": 6,
  "position": 3,
  "points": 15,
  "fastest_lap": "2024-05-26T15:46:45Z",
  "lap_time": 75124,
  "total_time": 5835000,
  "status": "FINISHED"
}

// DNF - George Russell
{
  "race_id": 1,
  "driver_id": 7,
  "position": 0,
  "points": 0,
  "fastest_lap": null,
  "lap_time": null,
  "total_time": null,
  "status": "DNF"
}
```

### 📋 Status possibles
- `FINISHED` : Course terminée
- `DNF` : Did Not Finish (abandon)
- `DSQ` : Disqualified (disqualifié)
- `DNS` : Did Not Start (n'a pas pris le départ)

---

## Ajout de classements

### 🏆 Classement des pilotes

#### Route sécurisée (JWT requis)
```bash
POST /classement-drivers
```

```json
{
  "season": 2024,
  "id_driver": 1,
  "position": 1,
  "points": 575
}
```

#### Exemple complet saison 2024
```bash
curl -X POST http://localhost:3000/classement-drivers \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "season": 2024,
    "id_driver": 1,
    "position": 1,
    "points": 575
  }'
```

### 🏁 Classement des équipes

#### Route sécurisée (JWT requis)
```bash
POST /classement-teams
```

```json
{
  "season": 2024,
  "id_team": 1,
  "position": 1,
  "points": 765
}
```

---

## Scripts d'automatisation

### 🔧 Script pour ajouter une saison complète

Créons un script qui ajoute des données pour une saison complète :

```javascript
// scripts/add-season-data.js
const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const API_KEY = 'your-api-key-here';
const JWT_TOKEN = 'your-jwt-token-here';

const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY
};

const authHeaders = {
  ...headers,
  'Authorization': `Bearer ${JWT_TOKEN}`
};

async function addTeams() {
  const teams = [
    {
      key: "mercedes",
      name: "Mercedes-AMG Petronas F1 Team",
      date_start: "2010-01-01T00:00:00Z",
      nb_victory: 125,
      color: "#00D2BE",
      nb_championship: 8,
      nb_race: 280
    },
    {
      key: "red-bull",
      name: "Oracle Red Bull Racing",
      date_start: "2005-01-01T00:00:00Z",
      nb_victory: 115,
      color: "#0600EF",
      nb_championship: 6,
      nb_race: 380
    }
    // ... autres équipes
  ];

  for (const team of teams) {
    try {
      const response = await axios.post(`${API_BASE}/teams`, team, { headers });
      console.log(`✅ Équipe ajoutée: ${team.name}`);
    } catch (error) {
      console.error(`❌ Erreur équipe ${team.name}:`, error.response?.data);
    }
  }
}

async function addDrivers() {
  const drivers = [
    {
      key: "hamilton-lewis",
      name: "Lewis",
      surname: "Hamilton",
      number: 44,
      nb_championship: 7,
      nb_pole: 104,
      nb_race: 350,
      nb_victory: 103,
      current_team_id: 1
    }
    // ... autres pilotes
  ];

  for (const driver of drivers) {
    try {
      const response = await axios.post(`${API_BASE}/drivers`, driver, { headers });
      console.log(`✅ Pilote ajouté: ${driver.name} ${driver.surname}`);
    } catch (error) {
      console.error(`❌ Erreur pilote ${driver.name}:`, error.response?.data);
    }
  }
}

async function main() {
  console.log('🚀 Début de l\'ajout des données...');
  
  await addTeams();
  await addDrivers();
  // await addRaces();
  // await addRaceResults();
  
  console.log('✅ Données ajoutées avec succès !');
}

main().catch(console.error);
```

### 🏃‍♂️ Utilisation du script
```bash
cd /path/to/your/project
npm install axios
node scripts/add-season-data.js
```

---

## 📡 Routes de consultation

### Équipes
- `GET /teams` - Liste toutes les équipes (public)
- `GET /teams/:id` - Équipe par ID (JWT requis)
- `GET /teams/key/:key` - Équipe par clé (JWT requis)

### Pilotes
- `GET /drivers` - Liste tous les pilotes (public)
- `GET /drivers/:id` - Pilote par ID (JWT requis)
- `GET /drivers/key/:key` - Pilote par clé (JWT requis)

### Courses
- `GET /races` - Liste toutes les courses (public)
- `GET /races/:id` - Course par ID (JWT requis)

### Résultats
- `GET /race-results` - Tous les résultats (public)
- `GET /race-results/:id` - Résultat par ID (JWT requis)
- `GET /race-results/race/:raceId` - Résultats d'une course (JWT requis)

### Classements
- `GET /classement-drivers` - Classement pilotes (JWT requis)
- `GET /classement-teams` - Classement équipes (JWT requis)

---

## 💡 Conseils et bonnes pratiques

### 🔑 Clés uniques
- Utilisez des clés descriptives : `hamilton-lewis`, `mercedes`, etc.
- Format recommandé : `nom-prenom` ou `nom-equipe`
- Les clés sont uniques et ne peuvent pas être dupliquées

### ⏱️ Gestion des dates
- Format ISO 8601 : `2024-05-26T15:00:00Z`
- Utilisez UTC pour éviter les problèmes de fuseaux horaires

### 🎨 Couleurs des équipes
- Format hexadécimal : `#FF0000`
- Toujours 7 caractères (# + 6 caractères hex)

### 🔢 Numéros de pilotes
- Doivent être uniques
- Généralement entre 1 et 99
- Le numéro 1 est réservé au champion du monde

### 📊 Points de course
- 1er : 25 points
- 2ème : 18 points
- 3ème : 15 points
- 4ème : 12 points
- 5ème : 10 points
- 6ème : 8 points
- 7ème : 6 points
- 8ème : 4 points
- 9ème : 2 points
- 10ème : 1 point
- DNF/DSQ/DNS : 0 point

---

## 🚨 Gestion des erreurs

### Erreurs courantes

#### 409 - Clé déjà existante
```json
{
  "error": "Driver key already exists",
  "field": "key"
}
```

#### 400 - Données invalides
```json
{
  "error": "Color must be in hexadecimal format (#RRGGBB)"
}
```

#### 401 - Non autorisé
```json
{
  "error": "No API key provided"
}
```

#### 404 - Non trouvé
```json
{
  "error": "Team not found"
}
```

---

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs du serveur
2. Consultez la documentation des erreurs
3. Testez avec Postman ou curl

Bon développement ! 🏎️💨
