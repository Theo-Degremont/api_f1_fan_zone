const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configuration
const SEASON = 2025;
const RACE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const TOP_DRIVERS = [1, 3, 4, 9, 11]; // Souvent dans le top 5
const EXCLUDED_DRIVER = 41; // Ne pas inclure ce pilote

// Système de points F1 2024
const POINTS_SYSTEM = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

// Fonction pour mélanger un tableau
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Fonction pour générer une position aléatoire avec biais pour les top drivers
function generatePositionForDriver(driverId, availablePositions, isTopDriver) {
  if (isTopDriver && availablePositions.some(pos => pos <= 5)) {
    // Pour les top drivers, privilégier les 5 premières places
    const topPositions = availablePositions.filter(pos => pos <= 5);
    if (topPositions.length > 0) {
      const randomIndex = Math.floor(Math.random() * topPositions.length);
      return topPositions[randomIndex];
    }
  }
  
  // Position aléatoire parmi les disponibles
  const randomIndex = Math.floor(Math.random() * availablePositions.length);
  return availablePositions[randomIndex];
}

// Fonction pour générer un temps de tour aléatoire (en millisecondes)
function generateLapTime() {
  // Temps de base entre 1:15 et 1:25 (75000-85000ms)
  const baseTime = 75000 + Math.random() * 10000;
  // Ajouter des variations plus fines
  const variation = (Math.random() - 0.5) * 2000; // ±1 seconde
  return Math.round(baseTime + variation);
}

// Fonction pour convertir millisecondes en format temps lisible
function formatLapTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

// Fonction principale
async function generateRaceResults() {
  try {
    console.log(`🏎️ Génération des résultats de course pour la saison ${SEASON}`);
    
    // ÉTAPE 1: Supprimer toutes les données de la table RaceResult
    console.log('🗑️ Suppression de toutes les données existantes...');
    const deletedCount = await prisma.raceResult.deleteMany({});
    console.log(`✅ ${deletedCount.count} résultats supprimés`);
    
    // Récupérer les pilotes du classement 2025
    const drivers = await prisma.classementDriver.findMany({
      where: { 
        season: SEASON,
        NOT: { id_driver: EXCLUDED_DRIVER }
      },
      select: { id_driver: true },
      orderBy: { position: 'asc' }
    });
    
    const driverIds = drivers.map(d => d.id_driver);
    console.log(`📊 ${driverIds.length} pilotes trouvés pour la saison ${SEASON}`);
    console.log(`🚫 Pilote exclu: ${EXCLUDED_DRIVER}`);
    
    for (const raceId of RACE_IDS) {
      console.log(`\n🏁 Génération des résultats pour la course ${raceId}...`);
      
      // Vérifier si la course existe
      const race = await prisma.race.findUnique({
        where: { id: raceId }
      });
      
      if (!race) {
        console.log(`⚠️ Course ${raceId} non trouvée, passage à la suivante`);
        continue;
      }
      
      // Générer des temps de tour pour tous les pilotes
      const lapTimes = {};
      const fastestLaps = {};
      
      // Générer un temps de base pour le meilleur tour de la course (plus rapide que les temps moyens)
      const baseFastestTime = 72000 + Math.random() * 3000; // Entre 1:12 et 1:15
      
      driverIds.forEach(driverId => {
        // Temps de tour moyen (plus lent)
        lapTimes[driverId] = generateLapTime();
        
        // Fastest lap (meilleur temps personnel, proche du temps de base)
        const variation = (Math.random() - 0.5) * 2000; // ±1 seconde
        fastestLaps[driverId] = Math.round(baseFastestTime + variation);
      });
      
      // Trouver le meilleur temps absolu de la course
      const overallFastestTime = Math.min(...Object.values(fastestLaps));
      const fastestLapDriverId = Object.keys(fastestLaps).find(
        key => fastestLaps[key] === overallFastestTime
      );
      
      console.log(`⚡ Meilleur tour de la course: Pilote ${fastestLapDriverId} - ${formatLapTime(overallFastestTime)}`);
      
      // Mélanger les pilotes pour cette course
      let shuffledDrivers = shuffleArray(driverIds);
      
      // S'assurer que les top drivers sont dans les premières positions (mais dans un ordre aléatoire)
      const topDriversInRace = TOP_DRIVERS.filter(id => driverIds.includes(id));
      const otherDrivers = shuffledDrivers.filter(id => !TOP_DRIVERS.includes(id));
      const shuffledTopDrivers = shuffleArray(topDriversInRace);
      
      // Recombiner: top drivers en premier (mélangés), puis les autres
      const finalDriverOrder = [...shuffledTopDrivers, ...otherDrivers];
      
      // Générer quelques DNF aléatoirement (0-3 pilotes)
      const dnfCount = Math.floor(Math.random() * 3); // Maximum 2 DNF au lieu de 3
      const dnfDrivers = dnfCount > 0 ? finalDriverOrder.slice(-dnfCount) : [];
      const finishingDrivers = dnfCount > 0 ? finalDriverOrder.slice(0, -dnfCount) : finalDriverOrder;
      
      // Créer les résultats pour les pilotes qui finissent
      for (let i = 0; i < finishingDrivers.length; i++) {
        const driverId = finishingDrivers[i];
        const position = i + 1;
        const points = i < POINTS_SYSTEM.length ? POINTS_SYSTEM[i] : 0;
        
        // Convertir le fastest lap en timestamp pour la base de données
        const fastestLapTime = new Date();
        fastestLapTime.setMilliseconds(fastestLaps[driverId] % 1000);
        fastestLapTime.setSeconds(Math.floor(fastestLaps[driverId] / 1000) % 60);
        fastestLapTime.setMinutes(Math.floor(fastestLaps[driverId] / 60000));
        
        const resultData = {
          race_id: raceId,
          driver_id: driverId,
          position: position,
          points: points,
          status: 'FINISHED',
          lap_time: lapTimes[driverId],
          fastest_lap: fastestLapTime // Tous les pilotes ont maintenant un fastest_lap
        };
        
        await prisma.raceResult.create({
          data: resultData
        });
      }
      
      // Créer les résultats pour les DNF
      for (const driverId of dnfDrivers) {
        // Même pour les DNF, ils peuvent avoir fait un tour rapide avant l'abandon
        const fastestLapTime = new Date();
        fastestLapTime.setMilliseconds(fastestLaps[driverId] % 1000);
        fastestLapTime.setSeconds(Math.floor(fastestLaps[driverId] / 1000) % 60);
        fastestLapTime.setMinutes(Math.floor(fastestLaps[driverId] / 60000));
        
        await prisma.raceResult.create({
          data: {
            race_id: raceId,
            driver_id: driverId,
            position: 0,
            points: 0,
            status: 'DNF',
            lap_time: lapTimes[driverId],
            fastest_lap: fastestLapTime
          }
        });
      }
      
      console.log(`✅ Course ${raceId}: ${finishingDrivers.length} pilotes classés, ${dnfDrivers.length} DNF`);
      console.log(`🏆 Podium: ${finishingDrivers.slice(0, 3).join(', ')}`);
    }
    
    console.log(`\n🎉 Génération terminée pour ${RACE_IDS.length} courses!`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution
if (require.main === module) {
  generateRaceResults();
}

module.exports = { generateRaceResults };
