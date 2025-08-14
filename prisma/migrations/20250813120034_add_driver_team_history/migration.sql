-- CreateTable
CREATE TABLE "driver_team_history" (
    "id" SERIAL NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "date_start" TIMESTAMP(3) NOT NULL,
    "date_end" TIMESTAMP(3),
    "season_start" INTEGER NOT NULL,
    "season_end" INTEGER,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "driver_team_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "driver_team_history_driver_id_team_id_season_start_key" ON "driver_team_history"("driver_id", "team_id", "season_start");

-- AddForeignKey
ALTER TABLE "driver_team_history" ADD CONSTRAINT "driver_team_history_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_team_history" ADD CONSTRAINT "driver_team_history_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
