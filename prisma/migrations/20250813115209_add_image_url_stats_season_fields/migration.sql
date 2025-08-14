/*
  Warnings:

  - You are about to drop the column `previous_teams` on the `Driver` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[race_id,driver_id]` on the table `RaceResult` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `season` to the `Race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "previous_teams",
ADD COLUMN     "image_url" VARCHAR(500),
ADD COLUMN     "key" VARCHAR(255) NOT NULL,
ADD COLUMN     "nb_podiums" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Race" ADD COLUMN     "image_url" VARCHAR(500),
ADD COLUMN     "season" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RaceResult" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lap_time" INTEGER,
ADD COLUMN     "status" VARCHAR(50) NOT NULL DEFAULT 'FINISHED',
ADD COLUMN     "total_time" INTEGER,
ALTER COLUMN "fastest_lap" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "key" VARCHAR(255) NOT NULL,
ADD COLUMN     "nb_podiums" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nb_pole" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "classement_driver" (
    "id" SERIAL NOT NULL,
    "season" INTEGER NOT NULL,
    "id_driver" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "nb_wins" INTEGER NOT NULL DEFAULT 0,
    "nb_points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "classement_driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classement_team" (
    "id" SERIAL NOT NULL,
    "season" INTEGER NOT NULL,
    "id_team" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "nb_wins" INTEGER NOT NULL DEFAULT 0,
    "nb_points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "classement_team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "classement_driver_season_id_driver_key" ON "classement_driver"("season", "id_driver");

-- CreateIndex
CREATE UNIQUE INDEX "classement_driver_season_position_key" ON "classement_driver"("season", "position");

-- CreateIndex
CREATE UNIQUE INDEX "classement_team_season_id_team_key" ON "classement_team"("season", "id_team");

-- CreateIndex
CREATE UNIQUE INDEX "classement_team_season_position_key" ON "classement_team"("season", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_key_key" ON "Driver"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_number_key" ON "Driver"("number");

-- CreateIndex
CREATE UNIQUE INDEX "RaceResult_race_id_driver_id_key" ON "RaceResult"("race_id", "driver_id");

-- CreateIndex
CREATE UNIQUE INDEX "Team_key_key" ON "Team"("key");

-- AddForeignKey
ALTER TABLE "classement_driver" ADD CONSTRAINT "classement_driver_id_driver_fkey" FOREIGN KEY ("id_driver") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classement_team" ADD CONSTRAINT "classement_team_id_team_fkey" FOREIGN KEY ("id_team") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
