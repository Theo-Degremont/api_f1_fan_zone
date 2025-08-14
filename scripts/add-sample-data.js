// Script pour ajouter des données d'exemple de la saison 2024
const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const API_KEY = 'your-api-key-here'; // Remplacez par votre vraie clé API
const JWT_TOKEN = 'your-jwt-token-here'; // Remplacez par votre vrai token JWT

const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY
};

const authHeaders = {
  ...headers,
  'Authorization': `Bearer ${JWT_TOKEN}`
};

// Données d'équipes 2024
const teams = [
  {
    key: "red-bull",
    name: "Oracle Red Bull Racing",
    date_start: "2005-01-01T00:00:00Z",
    date_end: null,
    nb_victory: 115,
    nb_podiums: 280,
    nb_pole: 95,
    color: "#0600EF",
    nb_championship: 6,
    nb_race: 380
  },
  {
    key: "mercedes",
    name: "Mercedes-AMG Petronas F1 Team",
    date_start: "2010-01-01T00:00:00Z",
    date_end: null,
    nb_victory: 125,
    nb_podiums: 290,
    nb_pole: 135,
    color: "#00D2BE",
    nb_championship: 8,
    nb_race: 280
  },
  {
    key: "ferrari",
    name: "Scuderia Ferrari",
    date_start: "1950-01-01T00:00:00Z",
    date_end: null,
    nb_victory: 245,
    nb_podiums: 800,
    nb_pole: 230,
    color: "#DC143C",
    nb_championship: 16,
    nb_race: 1050
  },
  {
    key: "mclaren",
    name: "McLaren Formula 1 Team",
    date_start: "1966-01-01T00:00:00Z",
    date_end: null,
    nb_victory: 185,
    nb_podiums: 520,
    nb_pole: 156,
    color: "#FF8700",
    nb_championship: 8,
    nb_race: 900
  },
  {
    key: "aston-martin",
    name: "Aston Martin Aramco Cognizant F1 Team",
    date_start: "2021-01-01T00:00:00Z",
    date_end: null,
    nb_victory: 1,
    nb_podiums: 15,
    nb_pole: 1,
    color: "#006F62",
    nb_championship: 0,
    nb_race: 80
  }
];

// Données de pilotes 2024
const drivers = [
  {
    key: "verstappen-max",
    name: "Max",
    surname: "Verstappen",
    number: 1,
    nb_championship: 3,
    nb_pole: 34,
    nb_podiums: 90,
    nb_race: 180,
    nb_victory: 56,
    current_team_id: 1 // Red Bull
  },
  {
    key: "perez-sergio",
    name: "Sergio",
    surname: "Pérez",
    number: 11,
    nb_championship: 0,
    nb_pole: 3,
    nb_podiums: 39,
    nb_race: 280,
    nb_victory: 6,
    current_team_id: 1 // Red Bull
  },
  {
    key: "hamilton-lewis",
    name: "Lewis",
    surname: "Hamilton",
    number: 44,
    nb_championship: 7,
    nb_pole: 104,
    nb_podiums: 198,
    nb_race: 350,
    nb_victory: 103,
    current_team_id: 2 // Mercedes
  },
  {
    key: "russell-george",
    name: "George",
    surname: "Russell",
    number: 63,
    nb_championship: 0,
    nb_pole: 3,
    nb_podiums: 13,
    nb_race: 110,
    nb_victory: 1,
    current_team_id: 2 // Mercedes
  },
  {
    key: "leclerc-charles",
    name: "Charles",
    surname: "Leclerc",
    number: 16,
    nb_championship: 0,
    nb_pole: 25,
    nb_podiums: 35,
    nb_race: 130,
    nb_victory: 5,
    current_team_id: 3 // Ferrari
  },
  {
    key: "sainz-carlos",
    name: "Carlos",
    surname: "Sainz Jr.",
    number: 55,
    nb_championship: 0,
    nb_pole: 6,
    nb_podiums: 25,
    nb_race: 200,
    nb_victory: 3,
    current_team_id: 3 // Ferrari
  },
  {
    key: "norris-lando",
    name: "Lando",
    surname: "Norris",
    number: 4,
    nb_championship: 0,
    nb_pole: 7,
    nb_podiums: 21,
    nb_race: 120,
    nb_victory: 4,
    current_team_id: 4 // McLaren
  },
  {
    key: "piastri-oscar",
    name: "Oscar",
    surname: "Piastri",
    number: 81,
    nb_championship: 0,
    nb_pole: 0,
    nb_podiums: 8,
    nb_race: 45,
    nb_victory: 2,
    current_team_id: 4 // McLaren
  }
];

// Courses emblématiques 2024
const races = [
  {
    race_name: "Bahrain Grand Prix",
    track_name: "Bahrain International Circuit",
    country: "Bahrain",
    city: "Sakhir",
    started_at: "2024-03-02T15:00:00Z",
    nb_laps: 57,
    nb_curve: 15,
    duration: 5400000
  },
  {
    race_name: "Saudi Arabian Grand Prix",
    track_name: "Jeddah Corniche Circuit",
    country: "Saudi Arabia",
    city: "Jeddah",
    started_at: "2024-03-09T18:00:00Z",
    nb_laps: 50,
    nb_curve: 27,
    duration: 5100000
  },
  {
    race_name: "Australian Grand Prix",
    track_name: "Albert Park Circuit",
    country: "Australia",
    city: "Melbourne",
    started_at: "2024-03-24T05:00:00Z",
    nb_laps: 58,
    nb_curve: 16,
    duration: 5280000
  },
  {
    race_name: "Monaco Grand Prix",
    track_name: "Circuit de Monaco",
    country: "Monaco",
    city: "Monte Carlo",
    started_at: "2024-05-26T15:00:00Z",
    nb_laps: 78,
    nb_curve: 19,
    duration: 6180000
  },
  {
    race_name: "British Grand Prix",
    track_name: "Silverstone Circuit",
    country: "United Kingdom",
    city: "Silverstone",
    started_at: "2024-07-07T15:00:00Z",
    nb_laps: 52,
    nb_curve: 18,
    duration: 5100000
  }
];

async function addTeams() {
  console.log('\n🏁 Ajout des équipes...');
  for (const team of teams) {
    try {
      const response = await axios.post(`${API_BASE}/teams`, team, { headers });
      console.log(`✅ Équipe ajoutée: ${team.name} (ID: ${response.data.id})`);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`⚠️  Équipe déjà existante: ${team.name}`);
      } else {
        console.error(`❌ Erreur équipe ${team.name}:`, error.response?.data || error.message);
      }
    }
  }
}

async function addDrivers() {
  console.log('\n🏎️  Ajout des pilotes...');
  for (const driver of drivers) {
    try {
      const response = await axios.post(`${API_BASE}/drivers`, driver, { headers });
      console.log(`✅ Pilote ajouté: ${driver.name} ${driver.surname} (ID: ${response.data.id})`);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`⚠️  Pilote déjà existant: ${driver.name} ${driver.surname}`);
      } else {
        console.error(`❌ Erreur pilote ${driver.name}:`, error.response?.data || error.message);
      }
    }
  }
}

async function addRaces() {
  console.log('\n🏆 Ajout des courses...');
  for (const race of races) {
    try {
      const response = await axios.post(`${API_BASE}/races`, race, { headers });
      console.log(`✅ Course ajoutée: ${race.race_name} (ID: ${response.data.id})`);
    } catch (error) {
      console.error(`❌ Erreur course ${race.race_name}:`, error.response?.data || error.message);
    }
  }
}

async function addExampleRaceResults() {
  console.log('\n📊 Ajout de résultats d\'exemple (Monaco GP)...');
  
  // Résultats fictifs du GP de Monaco
  const monacoResults = [
    { driver_id: 5, position: 1, points: 25, lap_time: 74528 }, // Leclerc
    { driver_id: 8, position: 2, points: 18, lap_time: 74892 }, // Piastri
    { driver_id: 6, position: 3, points: 15, lap_time: 75124 }, // Sainz
    { driver_id: 7, position: 4, points: 12, lap_time: 75456 }, // Norris
    { driver_id: 4, position: 5, points: 10, lap_time: 75789 }, // Russell
    { driver_id: 3, position: 6, points: 8, lap_time: 76012 },  // Hamilton
    { driver_id: 1, position: 7, points: 6, lap_time: 76234 },  // Verstappen
    { driver_id: 2, position: 0, points: 0, lap_time: null }    // Pérez (DNF)
  ];

  for (const result of monacoResults) {
    const raceResult = {
      race_id: 4, // Monaco GP
      driver_id: result.driver_id,
      position: result.position,
      points: result.points,
      fastest_lap: result.lap_time ? "2024-05-26T15:45:32Z" : null,
      lap_time: result.lap_time,
      total_time: result.position > 0 ? 5825000 + (result.position * 1000) : null,
      status: result.position > 0 ? "FINISHED" : "DNF"
    };

    try {
      const response = await axios.post(`${API_BASE}/race-results`, raceResult, { headers });
      console.log(`✅ Résultat ajouté: P${result.position || 'DNF'} pour pilote ${result.driver_id}`);
    } catch (error) {
      console.error(`❌ Erreur résultat pilote ${result.driver_id}:`, error.response?.data || error.message);
    }
  }
}

async function addClassements() {
  console.log('\n🏆 Ajout des classements 2024...');
  
  // Classement pilotes fictif
  const driverClassements = [
    { id_driver: 1, position: 1, points: 575 }, // Verstappen
    { id_driver: 7, position: 2, points: 374 }, // Norris
    { id_driver: 5, position: 3, points: 356 }, // Leclerc
    { id_driver: 8, position: 4, points: 292 }, // Piastri
    { id_driver: 6, position: 5, points: 290 }, // Sainz
    { id_driver: 3, position: 6, points: 164 }, // Hamilton
    { id_driver: 4, position: 7, points: 122 }, // Russell
    { id_driver: 2, position: 8, points: 152 }  // Pérez
  ];

  for (const classement of driverClassements) {
    try {
      const response = await axios.post(`${API_BASE}/classement-drivers`, {
        season: 2024,
        ...classement
      }, { headers: authHeaders });
      console.log(`✅ Classement pilote ajouté: P${classement.position} (${classement.points} pts)`);
    } catch (error) {
      console.error(`❌ Erreur classement pilote ${classement.id_driver}:`, error.response?.data || error.message);
    }
  }

  // Classement équipes fictif
  const teamClassements = [
    { id_team: 4, position: 1, points: 666 }, // McLaren
    { id_team: 1, position: 2, points: 727 }, // Red Bull
    { id_team: 3, position: 3, points: 646 }, // Ferrari
    { id_team: 2, position: 4, points: 286 }  // Mercedes
  ];

  for (const classement of teamClassements) {
    try {
      const response = await axios.post(`${API_BASE}/classement-teams`, {
        season: 2024,
        ...classement
      }, { headers: authHeaders });
      console.log(`✅ Classement équipe ajouté: P${classement.position} (${classement.points} pts)`);
    } catch (error) {
      console.error(`❌ Erreur classement équipe ${classement.id_team}:`, error.response?.data || error.message);
    }
  }
}

async function main() {
  console.log('🚀 Début de l\'ajout des données F1 2024...');
  console.log(`📡 API: ${API_BASE}`);
  
  try {
    await addTeams();
    await addDrivers();
    await addRaces();
    await addExampleRaceResults();
    
    console.log('\n⚠️  Pour ajouter les classements, vous devez avoir un token JWT valide');
    console.log('   Modifiez la variable JWT_TOKEN en haut du fichier avec votre token');
    console.log('   puis décommentez la ligne suivante:');
    console.log('   // await addClassements();');
    
    // await addClassements(); // Décommentez cette ligne si vous avez un token JWT
    
    console.log('\n✅ Données de base ajoutées avec succès !');
    console.log('\n📚 Consultez le tutoriel complet dans docs/API_Data_Tutorial.md');
    
  } catch (error) {
    console.error('\n❌ Erreur générale:', error.message);
  }
}

// Configuration avant exécution
console.log('📋 Configuration requise:');
console.log('1. Votre API doit être démarrée sur http://localhost:3000');
console.log('2. Modifiez API_KEY avec votre vraie clé API');
console.log('3. Pour les classements, modifiez JWT_TOKEN avec votre token JWT');
console.log('\n⏳ Démarrage dans 3 secondes...\n');

setTimeout(main, 3000);

module.exports = { main, addTeams, addDrivers, addRaces, addExampleRaceResults, addClassements };
