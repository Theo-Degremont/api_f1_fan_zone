#!/usr/bin/env bash

# Script de test rapide de l'API F1 Fan Zone
# Usage: ./test-api.sh [API_KEY]

API_BASE="http://localhost:3000"
API_KEY=${1:-"your-api-key-here"}

echo "🏎️  Test de l'API F1 Fan Zone"
echo "================================"
echo "📡 API: $API_BASE"
echo "🔑 Clé API: $API_KEY"
echo ""

# Test 1: Ajouter une équipe
echo "📝 Test 1: Ajouter une équipe de test..."
TEAM_RESPONSE=$(curl -s -X POST "$API_BASE/teams" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "key": "test-team",
    "name": "Test Racing Team",
    "date_start": "2024-01-01T00:00:00Z",
    "nb_victory": 0,
    "color": "#FF0000",
    "nb_championship": 0,
    "nb_race": 0
  }')

if echo "$TEAM_RESPONSE" | grep -q '"id"'; then
  TEAM_ID=$(echo "$TEAM_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
  echo "✅ Équipe créée avec l'ID: $TEAM_ID"
else
  echo "❌ Erreur lors de la création de l'équipe:"
  echo "$TEAM_RESPONSE"
  exit 1
fi

# Test 2: Ajouter un pilote
echo ""
echo "📝 Test 2: Ajouter un pilote de test..."
DRIVER_RESPONSE=$(curl -s -X POST "$API_BASE/drivers" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d "{
    \"key\": \"test-driver\",
    \"name\": \"Test\",
    \"surname\": \"Driver\",
    \"number\": 99,
    \"nb_championship\": 0,
    \"nb_pole\": 0,
    \"nb_race\": 0,
    \"nb_victory\": 0,
    \"current_team_id\": $TEAM_ID
  }")

if echo "$DRIVER_RESPONSE" | grep -q '"id"'; then
  DRIVER_ID=$(echo "$DRIVER_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
  echo "✅ Pilote créé avec l'ID: $DRIVER_ID"
else
  echo "❌ Erreur lors de la création du pilote:"
  echo "$DRIVER_RESPONSE"
fi

# Test 3: Ajouter une course
echo ""
echo "📝 Test 3: Ajouter une course de test..."
RACE_RESPONSE=$(curl -s -X POST "$API_BASE/races" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "race_name": "Test Grand Prix",
    "track_name": "Test Circuit",
    "country": "Test Country",
    "city": "Test City",
    "started_at": "2024-12-31T15:00:00Z",
    "nb_laps": 50,
    "nb_curve": 10,
    "duration": 5400000
  }')

if echo "$RACE_RESPONSE" | grep -q '"id"'; then
  RACE_ID=$(echo "$RACE_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
  echo "✅ Course créée avec l'ID: $RACE_ID"
else
  echo "❌ Erreur lors de la création de la course:"
  echo "$RACE_RESPONSE"
fi

# Test 4: Lister les équipes
echo ""
echo "📝 Test 4: Récupérer toutes les équipes..."
TEAMS_LIST=$(curl -s -X GET "$API_BASE/teams" \
  -H "X-API-Key: $API_KEY")

if echo "$TEAMS_LIST" | grep -q '"id"'; then
  TEAMS_COUNT=$(echo "$TEAMS_LIST" | grep -o '"id":[0-9]*' | wc -l)
  echo "✅ $TEAMS_COUNT équipe(s) trouvée(s)"
else
  echo "❌ Erreur lors de la récupération des équipes:"
  echo "$TEAMS_LIST"
fi

# Test 5: Lister les pilotes
echo ""
echo "📝 Test 5: Récupérer tous les pilotes..."
DRIVERS_LIST=$(curl -s -X GET "$API_BASE/drivers" \
  -H "X-API-Key: $API_KEY")

if echo "$DRIVERS_LIST" | grep -q '"id"'; then
  DRIVERS_COUNT=$(echo "$DRIVERS_LIST" | grep -o '"id":[0-9]*' | wc -l)
  echo "✅ $DRIVERS_COUNT pilote(s) trouvé(s)"
else
  echo "❌ Erreur lors de la récupération des pilotes:"
  echo "$DRIVERS_LIST"
fi

# Test 6: Lister les courses
echo ""
echo "📝 Test 6: Récupérer toutes les courses..."
RACES_LIST=$(curl -s -X GET "$API_BASE/races" \
  -H "X-API-Key: $API_KEY")

if echo "$RACES_LIST" | grep -q '"id"'; then
  RACES_COUNT=$(echo "$RACES_LIST" | grep -o '"id":[0-9]*' | wc -l)
  echo "✅ $RACES_COUNT course(s) trouvée(s)"
else
  echo "❌ Erreur lors de la récupération des courses:"
  echo "$RACES_LIST"
fi

echo ""
echo "🎉 Tests terminés !"
echo ""
echo "💡 Pour nettoyer les données de test, vous pouvez utiliser:"
echo "   curl -X DELETE \"$API_BASE/teams/$TEAM_ID\" -H \"X-API-Key: $API_KEY\""
echo "   curl -X DELETE \"$API_BASE/drivers/$DRIVER_ID\" -H \"X-API-Key: $API_KEY\""
echo "   curl -X DELETE \"$API_BASE/races/$RACE_ID\" -H \"X-API-Key: $API_KEY\""
echo ""
echo "📚 Consultez docs/API_Data_Tutorial.md pour plus d'exemples"
