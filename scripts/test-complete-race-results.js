const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCompleteRaceResults() {
  try {
    console.log('🏁 Test de la route /races/:raceId/results avec toutes les données\n');
    
    // Simuler la fonction du service modifiée
    const raceId = 1;
    const raceResults = await prisma.raceResult.findMany({
      where: { race_id: raceId },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            surname: true,
            number: true,
            image_url: true,
            team_history: {
              where: { 
                season_start: { lte: 2025 },
                OR: [
                  { season_end: null },
                  { season_end: { gte: 2025 } }
                ]
              },
              select: {
                team: {
                  select: {
                    id: true,
                    name: true,
                    color: true
                  }
                }
              }
            }
          }
        },
        race: {
          select: {
            id: true,
            race_name: true,
            track_name: true,
            country: true,
            city: true,
            started_at: true,
            nb_laps: true,
            nb_curve: true,
            duration: true,
            image_url: true,
            season: true
          }
        }
      },
      orderBy: [{ position: 'asc' }]
    });

    // Structure la réponse comme l'API le ferait
    const response = {
      race: raceResults[0]?.race || null,
      statistics: {
        totalDrivers: raceResults.length,
        finishedDrivers: raceResults.filter(r => r.position > 0).length,
        dnfDrivers: raceResults.filter(r => r.position === 0).length
      },
      results: raceResults.map(result => ({
        id: result.id,
        position: result.position,
        points: result.points,
        status: result.status,
        lap_time: result.lap_time,
        fastest_lap: result.fastest_lap,
        total_time: result.total_time,
        created_at: result.created_at,
        driver: {
          id: result.driver.id,
          name: result.driver.name,
          surname: result.driver.surname,
          number: result.driver.number,
          image_url: result.driver.image_url,
          team: result.driver.team_history[0]?.team || null
        }
      }))
    };

    console.log('📋 RÉPONSE COMPLÈTE DE /races/1/results:');
    console.log('=' .repeat(60));
    console.log(JSON.stringify(response, null, 2));

    // Affichage formaté pour plus de lisibilité
    console.log('\n🏎️ INFORMATIONS DE LA COURSE:');
    console.log('=' .repeat(50));
    if (response.race) {
      console.log(`📍 Nom: ${response.race.race_name}`);
      console.log(`🏁 Circuit: ${response.race.track_name}`);
      console.log(`🌍 Lieu: ${response.race.city}, ${response.race.country}`);
      console.log(`📅 Date: ${response.race.started_at}`);
      console.log(`🔢 Nombre de tours: ${response.race.nb_laps}`);
      console.log(`🌀 Nombre de virages: ${response.race.nb_curve || 'N/A'}`);
      console.log(`⏱️ Durée: ${response.race.duration ? response.race.duration + ' minutes' : 'N/A'}`);
      console.log(`🖼️ Image: ${response.race.image_url || 'N/A'}`);
      console.log(`🏆 Saison: ${response.race.season}`);
    }

    console.log('\n📊 STATISTIQUES:');
    console.log('=' .repeat(30));
    console.log(`👥 Total pilotes: ${response.statistics.totalDrivers}`);
    console.log(`🏁 Pilotes classés: ${response.statistics.finishedDrivers}`);
    console.log(`🚩 Abandons (DNF): ${response.statistics.dnfDrivers}`);

    console.log('\n🏆 TOP 5 DU CLASSEMENT:');
    console.log('=' .repeat(40));
    response.results.slice(0, 5).forEach(result => {
      if (result.position > 0) {
        const driverName = `${result.driver.name} ${result.driver.surname}`;
        const teamName = result.driver.team?.name || 'N/A';
        console.log(`${result.position}. ${driverName} (${teamName}) - ${result.points} pts`);
      }
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCompleteRaceResults();
