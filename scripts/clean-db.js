const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    console.log('🧹 Nettoyage de la base de données en cours...');
    
    // Suppression dans l'ordre des dépendances (enfants d'abord)
    await prisma.raceResult.deleteMany({});
    console.log('✅ RaceResult supprimés');
    
    // Nettoyage conditionnel des nouvelles tables
    try {
      await prisma.classementDriver.deleteMany({});
      console.log('✅ ClassementDriver supprimés');
    } catch (error) {
      if (error.code === 'P2021') {
        console.log('⚠️  Table classement_driver n\'existe pas encore');
      } else {
        throw error;
      }
    }
    
    try {
      await prisma.classementTeam.deleteMany({});
      console.log('✅ ClassementTeam supprimés');
    } catch (error) {
      if (error.code === 'P2021') {
        console.log('⚠️  Table classement_team n\'existe pas encore');
      } else {
        throw error;
      }
    }
    
    await prisma.gameScore.deleteMany({});
    console.log('✅ GameScore supprimés');
    
    await prisma.race.deleteMany({});
    console.log('✅ Race supprimés');
    
    await prisma.driver.deleteMany({});
    console.log('✅ Driver supprimés');
    
    await prisma.team.deleteMany({});
    console.log('✅ Team supprimés');
    
    await prisma.user.deleteMany({});
    console.log('✅ User supprimés');
    
    console.log('🎉 Base de données PostgreSQL nettoyée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage :', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
