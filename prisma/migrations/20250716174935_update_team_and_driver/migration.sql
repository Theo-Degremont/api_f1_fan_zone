/*
  Warnings:

  - You are about to drop the column `created_at` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `favorite_driver_id` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `favorite_team_id` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `modified_at` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `nb_run` on the `Team` table. All the data in the column will be lost.
  - You are about to alter the column `color` on the `Team` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(7)`.
  - Added the required column `name` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nb_championship` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nb_pole` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nb_race` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nb_victory` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nb_race` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "favorite_driver_id",
DROP COLUMN "favorite_team_id",
DROP COLUMN "modified_at",
DROP COLUMN "password",
DROP COLUMN "username",
ADD COLUMN     "name" VARCHAR(255) NOT NULL,
ADD COLUMN     "nb_championship" INTEGER NOT NULL,
ADD COLUMN     "nb_pole" INTEGER NOT NULL,
ADD COLUMN     "nb_race" INTEGER NOT NULL,
ADD COLUMN     "nb_victory" INTEGER NOT NULL,
ADD COLUMN     "number" INTEGER NOT NULL,
ADD COLUMN     "surname" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "nb_run",
ADD COLUMN     "nb_race" INTEGER NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "date_end" DROP NOT NULL,
ALTER COLUMN "color" SET DATA TYPE VARCHAR(7);

-- CreateTable
CREATE TABLE "DriverTeam" (
    "id" SERIAL NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),

    CONSTRAINT "DriverTeam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DriverTeam_driver_id_team_id_key" ON "DriverTeam"("driver_id", "team_id");

-- AddForeignKey
ALTER TABLE "DriverTeam" ADD CONSTRAINT "DriverTeam_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverTeam" ADD CONSTRAINT "DriverTeam_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
