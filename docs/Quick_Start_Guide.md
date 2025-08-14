# 🚀 Guide rapide - Ajout de données F1 Fan Zone

## 📁 Fichiers disponibles

### 📖 Documentation
- **`docs/API_Data_Tutorial.md`** - Tutoriel complet avec exemples détaillés

### 🔧 Scripts d'automatisation  
- **`scripts/add-sample-data.js`** - Script Node.js pour ajouter des données de la saison 2024
- **`scripts/test-api.sh`** - Script bash pour tester rapidement l'API

### 📮 Collection Postman
- **`postman/F1_Fan_Zone_API.postman_collection.json`** - Collection complète pour Postman

---

## ⚡ Démarrage rapide

### 1. Démarrer l'API (méthode recommandée)
```bash
cd /path/to/api_f1_fan_zone
npm start
```

### 2. Test rapide avec le script bash
```bash
# Remplacer 'your-api-key' par votre vraie clé
./scripts/test-api.sh your-api-key
```

### 3. Ajouter des données complètes
```bash
# 1. Installer axios si pas déjà fait
npm install axios

# 2. Modifier les variables dans le script
# Éditer scripts/add-sample-data.js :
# - API_KEY = 'your-real-api-key'
# - JWT_TOKEN = 'your-jwt-token' (pour les classements)

# 3. Exécuter le script
node scripts/add-sample-data.js
```

### 4. Utiliser Postman
1. Importer `postman/F1_Fan_Zone_API.postman_collection.json`
2. Modifier les variables :
   - `baseUrl` : http://localhost:3000
   - `apiKey` : votre clé API
   - `jwtToken` : votre token JWT

---

## 🔑 Configuration requise

### Variables d'environnement
Créez un fichier `.env` avec :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/f1_fan_zone"
MONGODB_URI="mongodb://localhost:27017/f1_fan_zone"
JWT_SECRET="your-jwt-secret"
API_KEY="your-api-key"
PORT=3000
```

### Authentification
- **API Key** : Requis pour toutes les routes
- **JWT Token** : Requis pour les routes sécurisées (classements, accès par ID/clé)

---

## 📊 Données ajoutées par le script

### Équipes (5)
- Red Bull Racing
- Mercedes-AMG Petronas
- Scuderia Ferrari  
- McLaren F1 Team
- Aston Martin

### Pilotes (8)
- Max Verstappen & Sergio Pérez (Red Bull)
- Lewis Hamilton & George Russell (Mercedes)
- Charles Leclerc & Carlos Sainz (Ferrari)
- Lando Norris & Oscar Piastri (McLaren)

### Courses (5)
- Bahrain GP
- Saudi Arabian GP
- Australian GP
- Monaco GP
- British GP

### Résultats
- Exemples de résultats pour le GP de Monaco

---

## 🛠️ Commandes utiles

### Base de données
```bash
# Nettoyer la DB
node scripts/clean-db.js

# Migration Prisma
npx prisma db push
npx prisma generate
```

### Tests
```bash
# Test compilation TypeScript
npx tsc --noEmit

# Test API simple
curl -H "X-API-Key: your-key" http://localhost:3000/teams
```

---

## 📚 Documentation complète

Consultez `docs/API_Data_Tutorial.md` pour :
- Exemples détaillés de toutes les routes
- Structure complète des données
- Gestion des erreurs
- Bonnes pratiques
- Scripts d'automatisation avancés

---

## 🚨 Dépannage

### L'API ne démarre pas
1. Vérifiez que PostgreSQL et MongoDB sont démarrés
2. Vérifiez les variables d'environnement dans `.env`
3. Vérifiez les logs dans le terminal

### Erreurs lors de l'ajout de données
1. Vérifiez que votre clé API est correcte
2. Pour les classements, vérifiez que vous avez un token JWT valide
3. Vérifiez les logs du serveur pour plus de détails

### Script d'ajout de données ne fonctionne pas
1. Installez axios : `npm install axios`
2. Vérifiez que l'API est démarrée sur localhost:3000
3. Modifiez les variables API_KEY et JWT_TOKEN dans le script

---

Bon développement ! 🏎️💨
