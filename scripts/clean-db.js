const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    console.log('Nettoyage de la base de données en cours...');
    
    await prisma.raceResult.deleteMany({});
    console.log('✅ RaceResult supprimés');
    
    await prisma.race.deleteMany({});
    console.log('✅ Race supprimés');
    
    await prisma.gameScore.deleteMany({});
    console.log('✅ GameScore supprimés');
    
    await prisma.driver.deleteMany({});
    console.log('✅ Driver supprimés');
    
    await prisma.team.deleteMany({});
    console.log('✅ Team supprimés');
    
    await prisma.user.deleteMany({});
    console.log('✅ User supprimés');
    
    console.log('Base de données nettoyée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage :', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
