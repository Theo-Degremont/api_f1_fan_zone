const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

    // Mapping entre les pilotes de l'API externe et les IDs de notre base de données
    const driverMapping = {
        'Max Verstappen': 1,
        'Lewis Hamilton': 10,
        'Valtteri Bottas': 24,
        'Sergio Perez': 25,
        'Carlos Sainz Jr': 19,
        'Lando Norris': 4,
        'Charles Leclerc': 9,
        'Daniel Ricciardo': 26,
        'Pierre Gasly': 13,
        'Fernando Alonso': 8,
        'Esteban Ocon': 15,
        'Sebastian Vettel': 28,
        'Lance Stroll': 7,
        'Yuki Tsunoda': 2,
        'George Russell': 11,
        'Kimi Raikkonen': 29,
        'Nicholas Latifi': 30,
        'Antonio Giovinazzi': 31,
        'Mick Schumacher': 32,
        'Robert Kubica': 33,
        'Nikita Mazepin': 34,
        'Oscar Piastri': 3,
        'Alexander Albon': 18
    };

// Configuration de l'API
const API_CONFIG = {
  baseURL: 'https://api-formula-1.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': '1561763b83msh8e88ed42af26e7dp18831fjsn35f12f3ba5f0',
    'X-RapidAPI-Host': 'api-formula-1.p.rapidapi.com'
  }
};

const apiClient = axios.create(API_CONFIG);

// Fonction pour récupérer les classements d'une saison
async function fetchDriverRankings(season) {
  try {
    console.log(`📡 Récupération des classements pour la saison ${season}...`);
    const response = await apiClient.get(`/rankings/drivers?season=${season}`);
    
    if (response.data.errors && response.data.errors.length > 0) {
      console.error(`❌ Erreurs API pour ${season}:`, response.data.errors);
      return null;
    }
    
    return response.data.response || [];
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération des données ${season}:`, error.message);
    return null;
  }
}

// Fonction pour nettoyer les classements existants d'une saison
async function clearSeasonRankings(season) {
  try {
    const deleted = await prisma.classementDriver.deleteMany({
      where: { season }
    });
    console.log(`🗑️  ${deleted.count} classements supprimés pour la saison ${season}`);
  } catch (error) {
    console.error(`❌ Erreur lors de la suppression des classements ${season}:`, error.message);
  }
}

// Fonction pour insérer les classements d'une saison
async function insertDriverRankings(season, rankings) {
  let inserted = 0;
  let skipped = 0;
  const missingDrivers = [];

  for (const ranking of rankings) {
    const driverName = ranking.driver.name;
    const internalDriverId = driverMapping[driverName];
    
    if (!internalDriverId) {
      missingDrivers.push({
        name: driverName,
        abbr: ranking.driver.abbr,
        number: ranking.driver.number,
        position: ranking.position
      });
      skipped++;
      continue;
    }

    try {
      // Convertir les points (peuvent être string ou null)
      let points = 0;
      if (ranking.points) {
        points = parseFloat(ranking.points.toString()) || 0;
      }

      await prisma.classementDriver.create({
        data: {
          season: parseInt(season),
          id_driver: internalDriverId,
          position: ranking.position,
          points: Math.round(points) // Arrondir les points
        }
      });
      
      inserted++;
      console.log(`✅ ${ranking.position}. ${driverName} - ${points} pts`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'insertion de ${driverName}:`, error.message);
      skipped++;
    }
  }

  console.log(`📊 Saison ${season}: ${inserted} pilotes insérés, ${skipped} ignorés`);
  
  if (missingDrivers.length > 0) {
    console.log(`\n⚠️  Pilotes manquants dans la base pour ${season}:`);
    missingDrivers.forEach(driver => {
      console.log(`   - ${driver.name} (${driver.abbr}) #${driver.number} - Position ${driver.position}`);
    });
  }

  return { inserted, skipped, missingDrivers };
}

// Fonction principale
async function importDriverRankings() {
  const seasons = [2020, 2021, 2022, 2023, 2024, 2025];
  const summary = {
    totalInserted: 0,
    totalSkipped: 0,
    allMissingDrivers: new Set()
  };

  console.log('🏁 Début de l\'importation des classements pilotes...\n');

  for (const season of seasons) {
    console.log(`\n🏆 === SAISON ${season} ===`);
    
    // Récupérer les données de l'API
    const rankings = await fetchDriverRankings(season);
    
    if (!rankings || rankings.length === 0) {
      console.log(`⚠️  Aucune donnée trouvée pour ${season}`);
      continue;
    }

    // Nettoyer les classements existants
    await clearSeasonRankings(season);
    
    // Insérer les nouveaux classements
    const result = await insertDriverRankings(season, rankings);
    
    summary.totalInserted += result.inserted;
    summary.totalSkipped += result.skipped;
    
    // Collecter tous les pilotes manquants
    result.missingDrivers.forEach(driver => {
      summary.allMissingDrivers.add(`${driver.name} (${driver.abbr})`);
    });
    
    // Pause entre les requêtes pour éviter la limite de taux
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Résumé final
  console.log('\n🏁 === RÉSUMÉ FINAL ===');
  console.log(`✅ Total pilotes insérés: ${summary.totalInserted}`);
  console.log(`⚠️  Total pilotes ignorés: ${summary.totalSkipped}`);
  
  if (summary.allMissingDrivers.size > 0) {
    console.log(`\n📝 Pilotes à ajouter dans la base de données:`);
    Array.from(summary.allMissingDrivers).sort().forEach(driver => {
      console.log(`   - ${driver}`);
    });
  }

  console.log('\n🎉 Importation terminée !');
}

// Fonction de test pour une seule saison
async function testSingleSeason(season = 2021) {
  console.log(`🧪 Test pour la saison ${season}...\n`);
  
  const rankings = await fetchDriverRankings(season);
  
  if (rankings && rankings.length > 0) {
    console.log(`📊 ${rankings.length} pilotes trouvés:`);
    rankings.forEach(ranking => {
      const internalId = driverMapping[ranking.driver.name];
      const status = internalId ? '✅' : '❌';
      console.log(`${status} ${ranking.position}. ${ranking.driver.name} (${ranking.driver.abbr}) - ${ranking.points || 0} pts`);
    });
  }
}

// Gestion des arguments de ligne de commande
async function main() {
  try {
    const args = process.argv.slice(2);
    
    if (args.includes('--test') || args.includes('-t')) {
      const season = args[1] ? parseInt(args[1]) : 2021;
      await testSingleSeason(season);
    } else if (args.includes('--help') || args.includes('-h')) {
      console.log(`
🏁 Script d'importation des classements F1

Usage:
  node import-driver-rankings.js              # Importer toutes les saisons (2020-2025)
  node import-driver-rankings.js --test 2021  # Tester une saison spécifique
  node import-driver-rankings.js --help       # Afficher cette aide

Options:
  --test, -t    Mode test (ne fait pas d'insertion)
  --help, -h    Afficher l'aide
      `);
    } else {
      await importDriverRankings();
    }
  } catch (error) {
    console.error('💥 Erreur fatale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution du script
if (require.main === module) {
  main();
}

module.exports = {
  importDriverRankings,
  testSingleSeason
};
