/*
  Warnings:

  - You are about to drop the column `Name` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `payerName` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `userName` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "Name",
DROP COLUMN "payerName",
ADD COLUMN     "userName" TEXT NOT NULL;
