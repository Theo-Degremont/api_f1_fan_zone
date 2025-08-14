const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Pilotes manquants identifiés lors du test
const missingDrivers = [
    {
        key: 'valtteri-bottas',
        name: 'Valtteri',
        surname: 'Bottas',
        number: 77,
        nb_championship: 0,
        nb_pole: 20,
        nb_podiums: 67,
        nb_race: 230,
        nb_victory: 10,
        current_team_id: null
    },
    {
        key: 'sergio-perez',
        name: 'Sergio',
        surname: 'Perez',
        number: 11,
        nb_championship: 0,
        nb_pole: 2,
        nb_podiums: 39,
        nb_race: 280,
        nb_victory: 6,
        current_team_id: null
    },
    {
        key: 'daniel-ricciardo',
        name: 'Daniel',
        surname: 'Ricciardo',
        number: 3,
        nb_championship: 0,
        nb_pole: 3,
        nb_podiums: 32,
        nb_race: 257,
        nb_victory: 8,
        current_team_id: null
    },
    {
        key: 'sebastian-vettel',
        name: 'Sebastian',
        surname: 'Vettel',
        number: 15, // Changé de 5 à 15
        nb_championship: 4,
        nb_pole: 57,
        nb_podiums: 122,
        nb_race: 299,
        nb_victory: 53,
        current_team_id: null
    },
    {
        key: 'kimi-raikkonen',
        name: 'Kimi',
        surname: 'Raikkonen',
        number: 17, // Changé de 7 à 17
        nb_championship: 1,
        nb_pole: 18,
        nb_podiums: 103,
        nb_race: 349,
        nb_victory: 21,
        current_team_id: null
    },
    {
        key: 'nicholas-latifi',
        name: 'Nicholas',
        surname: 'Latifi',
        number: 19, // Changé de 6 à 19
        nb_championship: 0,
        nb_pole: 0,
        nb_podiums: 0,
        nb_race: 55,
        nb_victory: 0,
        current_team_id: null
    },
    {
        key: 'antonio-giovinazzi',
        name: 'Antonio',
        surname: 'Giovinazzi',
        number: 99,
        nb_championship: 0,
        nb_pole: 0,
        nb_podiums: 0,
        nb_race: 62,
        nb_victory: 0,
        current_team_id: null
    },
    {
        key: 'mick-schumacher',
        name: 'Mick',
        surname: 'Schumacher',
        number: 47,
        nb_championship: 0,
        nb_pole: 0,
        nb_podiums: 0,
        nb_race: 43,
        nb_victory: 0,
        current_team_id: null
    },
    {
        key: 'robert-kubica',
        name: 'Robert',
        surname: 'Kubica',
        number: 88,
        nb_championship: 0,
        nb_pole: 1,
        nb_podiums: 12,
        nb_race: 97,
        nb_victory: 1,
        current_team_id: null
    },
    {
        key: 'nikita-mazepin',
        name: 'Nikita',
        surname: 'Mazepin',
        number: 9,
        nb_championship: 0,
        nb_pole: 0,
        nb_podiums: 0,
        nb_race: 21,
        nb_victory: 0,
        current_team_id: null
    }
];

async function addMissingDrivers() {
    console.log('🏁 Ajout des pilotes manquants...\n');

    try {
        for (const driver of missingDrivers) {
            // Vérifier si le pilote existe déjà
            const existingDriver = await prisma.driver.findFirst({
                where: {
                    OR: [
                        { key: driver.key },
                        {
                            AND: [
                                { name: driver.name },
                                { surname: driver.surname }
                            ]
                        }
                    ]
                }
            });

            if (existingDriver) {
                console.log(`⚠️  ${driver.name} ${driver.surname} (${driver.key}) existe déjà`);
                continue;
            }

            // Ajouter le pilote
            const newDriver = await prisma.driver.create({
                data: driver
            });

            console.log(`✅ Ajouté: ${newDriver.name} ${newDriver.surname} (${newDriver.key}) - ID: ${newDriver.id}`);
        }

        console.log('\n🎉 Tous les pilotes manquants ont été traités !');

    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout des pilotes:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Fonction pour lister tous les pilotes
async function listAllDrivers() {
    console.log('📋 Liste de tous les pilotes:\n');

    try {
        const drivers = await prisma.driver.findMany({
            orderBy: [
                { surname: 'asc' },
                { name: 'asc' }
            ]
        });

        drivers.forEach((driver, index) => {
            console.log(`${(index + 1).toString().padStart(2, '0')}. ${driver.name} ${driver.surname} (${driver.key}) - ID: ${driver.id}`);
        });

        console.log(`\n📊 Total: ${drivers.length} pilotes`);

    } catch (error) {
        console.error('❌ Erreur lors de la récupération des pilotes:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);

if (args.includes('--list')) {
    listAllDrivers();
} else if (args.includes('--help')) {
    console.log(`
🏁 Script d'ajout de pilotes manquants

Usage:
  node add-missing-drivers.js          # Ajouter les pilotes manquants
  node add-missing-drivers.js --list   # Lister tous les pilotes
  node add-missing-drivers.js --help   # Afficher cette aide
`);
} else {
    addMissingDrivers();
}
