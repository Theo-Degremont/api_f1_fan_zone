SET session_replication_role = replica;

TRUNCATE TABLE "RaceResult" CASCADE;
TRUNCATE TABLE "Race" CASCADE;
TRUNCATE TABLE "GameScore" CASCADE;
TRUNCATE TABLE "Driver" CASCADE;
TRUNCATE TABLE "Team" CASCADE;
TRUNCATE TABLE "User" CASCADE;

SET session_replication_role = DEFAULT;

ALTER SEQUENCE "User_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Driver_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Team_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Race_id_seq" RESTART WITH 1;
ALTER SEQUENCE "RaceResult_id_seq" RESTART WITH 1;
ALTER SEQUENCE "GameScore_id_seq" RESTART WITH 1;

SELECT 'Base de données nettoyée avec succès !' as message;
