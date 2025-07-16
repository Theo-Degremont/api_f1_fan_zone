/*
  Warnings:

  - You are about to drop the `DriverTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DriverTeam" DROP CONSTRAINT "DriverTeam_driver_id_fkey";

-- DropForeignKey
ALTER TABLE "DriverTeam" DROP CONSTRAINT "DriverTeam_team_id_fkey";

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "current_team_id" INTEGER,
ADD COLUMN     "previous_teams" INTEGER[];

-- DropTable
DROP TABLE "DriverTeam";

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_current_team_id_fkey" FOREIGN KEY ("current_team_id") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
