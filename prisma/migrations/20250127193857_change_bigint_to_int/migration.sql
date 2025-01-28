/*
  Warnings:

  - You are about to alter the column `sequence` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "sequence" SET DATA TYPE INTEGER;
