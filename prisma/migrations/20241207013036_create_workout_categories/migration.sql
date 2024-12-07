/*
  Warnings:

  - You are about to drop the column `category` on the `Workout` table. All the data in the column will be lost.
  - Added the required column `workoutCategoryId` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('Cardio', 'LegDay', 'PushDay', 'PullDay', 'Abs');

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "category",
ADD COLUMN     "workoutCategoryId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "WorkoutCategory";

-- CreateTable
CREATE TABLE "WorkoutCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CategoryType" NOT NULL,

    CONSTRAINT "WorkoutCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_workoutCategoryId_fkey" FOREIGN KEY ("workoutCategoryId") REFERENCES "WorkoutCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
