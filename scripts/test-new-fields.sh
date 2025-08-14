#!/usr/bin/env bash

# Test rapide des nouveaux champs nb_podiums et nb_pole
API_BASE="http://localhost:3000"
API_KEY=${1:-"your-api-key-here"}

echo "🏎️  Test des nouveaux champs nb_podiums et nb_pole"
echo "=================================================="
echo ""

# Test 1: Créer une équipe avec les nouveaux champs
echo "📝 Test 1: Créer une équipe avec nb_podiums et nb_pole..."
TEAM_RESPONSE=$(curl -s -X POST "$API_BASE/teams" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "key": "test-podiums-team",
    "name": "Test Podiums Team",
    "date_start": "2024-01-01T00:00:00Z",
    "nb_victory": 10,
    "nb_podiums": 25,
    "nb_pole": 8,
    "color": "#FF0000",
    "nb_championship": 1,
    "nb_race": 50
  }')

if echo "$TEAM_RESPONSE" | grep -q '"nb_podiums"'; then
  echo "✅ Équipe créée avec nb_podiums et nb_pole"
  echo "   Réponse: $(echo "$TEAM_RESPONSE" | grep -o '"nb_podiums":[0-9]*')"
  TEAM_ID=$(echo "$TEAM_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
else
  echo "❌ Erreur lors de la création de l'équipe:"
  echo "$TEAM_RESPONSE"
  exit 1
fi

# Test 2: Créer un pilote avec les nouveaux champs
echo ""
echo "📝 Test 2: Créer un pilote avec nb_podiums..."
DRIVER_RESPONSE=$(curl -s -X POST "$API_BASE/drivers" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d "{
    \"key\": \"test-podiums-driver\",
    \"name\": \"Test\",
    \"surname\": \"Podiums\",
    \"number\": 98,
    \"nb_championship\": 1,
    \"nb_pole\": 5,
    \"nb_podiums\": 15,
    \"nb_race\": 30,
    \"nb_victory\": 3,
    \"current_team_id\": $TEAM_ID
  }")

if echo "$DRIVER_RESPONSE" | grep -q '"nb_podiums"'; then
  echo "✅ Pilote créé avec nb_podiums"
  echo "   Réponse: $(echo "$DRIVER_RESPONSE" | grep -o '"nb_podiums":[0-9]*')"
  DRIVER_ID=$(echo "$DRIVER_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
else
  echo "❌ Erreur lors de la création du pilote:"
  echo "$DRIVER_RESPONSE"
fi

# Test 3: Récupérer l'équipe et vérifier les champs
echo ""
echo "📝 Test 3: Vérifier les champs dans la récupération..."
TEAM_GET=$(curl -s -X GET "$API_BASE/teams" \
  -H "X-API-Key: $API_KEY")

if echo "$TEAM_GET" | grep -q '"nb_podiums"' && echo "$TEAM_GET" | grep -q '"nb_pole"'; then
  echo "✅ Les nouveaux champs sont présents dans la réponse GET /teams"
  PODIUMS_COUNT=$(echo "$TEAM_GET" | grep -o '"nb_podiums":[0-9]*' | wc -l)
  echo "   Nombre d'équipes avec nb_podiums: $PODIUMS_COUNT"
else
  echo "❌ Les nouveaux champs ne sont pas présents dans GET /teams"
fi

echo ""
echo "🎉 Tests des nouveaux champs terminés !"
echo ""
echo "💡 Pour nettoyer les données de test:"
echo "   curl -X DELETE \"$API_BASE/teams/$TEAM_ID\" -H \"X-API-Key: $API_KEY\""
echo "   curl -X DELETE \"$API_BASE/drivers/$DRIVER_ID\" -H \"X-API-Key: $API_KEY\""
