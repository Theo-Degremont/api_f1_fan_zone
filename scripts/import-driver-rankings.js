const { PrismaClient } = require('@prisma/client');
const https = require('https');

const prisma = new PrismaClient();

// Configuration de l'API RapidAPI
const RAPIDAPI_KEY = '1561763b83msh8e88ed42af26e7dp18831fjsn35f12f3ba5f0';
const BASE_URL = 'https://api-formula-1.p.rapidapi.com/rankings/drivers';

// Mapping des noms de pilotes de l'API externe vers les noms dans notre BDD
const DRIVER_NAME_MAPPING = {
  'Oscar Piastri': 'Oscar',
  'Lando Norris': 'Lando',
  'Max Verstappen': 'Max',
  'George Russell': 'George',
  'Charles Leclerc': 'Charles',
  'Lewis Hamilton': 'Lewis',
  'Andrea Kimi Antonelli': 'Andrea Kimi',
  'Alexander Albon': 'Alexander',
  'Nico Hulkenberg': 'Nico',
  'Esteban Ocon': 'Esteban',
  'Fernando Alonso': 'Fernando',
  'Lance Stroll': 'Lance',
  'Isack Hadjar': 'Isack',
  'Pierre Gasly': 'Pierre',
  'Liam Lawson': 'Liam',
  'Carlos Sainz Jr': 'Carlos',
  'Gabriel Bortoleto': 'Gabriel',
  'Yuki Tsunoda': 'Yuki',
  'Oliver Bearman': 'Oliver',
  'Franco Colapinto': 'Franco',
  'Jack Doohan': 'Jack',
  'Sergio Perez': 'Sergio',
  'Kevin Magnussen': 'Kevin',
  'Guanyu Zhou': 'Guanyu',
  'Valtteri Bottas': 'Valtteri',
  'Pietro Fittipaldi': 'Pietro'
};

async function findDriverInDatabase(driverName) {
  try {
    // Essayer d'abord avec le mapping
    const mappedName = DRIVER_NAME_MAPPING[driverName];
    if (mappedName) {
      const driver = await prisma.driver.findFirst({
        where: { name: mappedName }
      });
      if (driver) return driver;
    }

    // Essayer avec le nom complet
    const driver = await prisma.driver.findFirst({
      where: { 
        OR: [
          { name: { contains: driverName.split(' ')[0], mode: 'insensitive' } },
          { surname: { contains: driverName.split(' ')[1] || '', mode: 'insensitive' } }
        ]
      }
    });

    return driver;
  } catch (error) {
    console.error(`❌ Erreur lors de la recherche du pilote ${driverName}:`, error.message);
    return null;
  }
}

async function fetchDriverRankings(season) {
  return new Promise((resolve, reject) => {
    console.log(`🔍 Récupération des classements pour la saison ${season}...`);
    
    const options = {
      hostname: 'api-formula-1.p.rapidapi.com',
      path: `/rankings/drivers?season=${season}`,
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'api-formula-1.p.rapidapi.com'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          console.log(`📡 Réponse reçue (${data.length} caractères)`);
          const jsonData = JSON.parse(data);
          
          console.log(`🔍 Debug API Response:`, {
            get: jsonData.get,
            results: jsonData.results,
            errors: jsonData.errors,
            responseLength: jsonData.response ? jsonData.response.length : 'undefined'
          });
          
          if (jsonData.errors && jsonData.errors.length > 0) {
            reject(new Error(`Erreur API: ${jsonData.errors.join(', ')}`));
            return;
          }

          resolve(jsonData.response);
        } catch (error) {
          console.error(`❌ Erreur parsing JSON:`, error.message);
          console.error(`📄 Données reçues:`, data.substring(0, 500));
          reject(new Error(`Erreur parsing JSON: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Erreur requête: ${error.message}`));
    });

    req.end();
  });
}

async function insertDriverRankings(season) {
  try {
    // Récupérer les données de l'API
    const rankings = await fetchDriverRankings(season);
    
    if (!rankings || rankings.length === 0) {
      console.log(`⚠️ Aucune donnée de classement trouvée pour la saison ${season}`);
      return;
    }

    console.log(`📊 ${rankings.length} classements trouvés pour la saison ${season}`);

    // Supprimer les classements existants pour cette saison
    await prisma.classementDriver.deleteMany({
      where: { season: parseInt(season) }
    });
    console.log(`🗑️ Classements existants supprimés pour la saison ${season}`);

    let inserted = 0;
    let skipped = 0;

    // Traiter chaque classement
    for (const ranking of rankings) {
      try {
        // Trouver le pilote dans notre BDD
        const driver = await findDriverInDatabase(ranking.driver.name);
        
        if (!driver) {
          console.warn(`⚠️ Pilote non trouvé dans la BDD: ${ranking.driver.name} (position ${ranking.position})`);
          skipped++;
          continue;
        }

        // Insérer le classement
        await prisma.classementDriver.create({
          data: {
            season: parseInt(season),
            id_driver: driver.id,
            position: ranking.position,
            points: ranking.points || 0,
            nb_wins: ranking.wins || 0,
            nb_points: ranking.points || 0
          }
        });

        console.log(`✅ Classement inséré: ${driver.name} ${driver.surname} - Position ${ranking.position} (${ranking.points || 0} pts)`);
        inserted++;

      } catch (error) {
        console.error(`❌ Erreur lors de l'insertion du classement pour ${ranking.driver.name}:`, error.message);
        skipped++;
      }
    }

    console.log(`\n📈 Résumé pour la saison ${season}:`);
    console.log(`   ✅ Classements insérés: ${inserted}`);
    console.log(`   ⚠️ Classements ignorés: ${skipped}`);
    console.log(`   📊 Total traité: ${rankings.length}`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des classements:', error.message);
    throw error;
  }
}

async function main() {
  const season = process.argv[2];
  
  if (!season) {
    console.error('❌ Veuillez spécifier une saison en paramètre');
    console.log('Usage: node import-driver-rankings.js 2025');
    process.exit(1);
  }

  if (!/^\d{4}$/.test(season)) {
    console.error('❌ La saison doit être une année à 4 chiffres (ex: 2025)');
    process.exit(1);
  }

  try {
    console.log(`🏎️ Début de l'import des classements pilotes pour la saison ${season}`);
    await insertDriverRankings(season);
    console.log(`🏁 Import terminé avec succès pour la saison ${season}!`);
  } catch (error) {
    console.error('💥 Erreur fatale:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  main();
}

module.exports = { insertDriverRankings, findDriverInDatabase };
