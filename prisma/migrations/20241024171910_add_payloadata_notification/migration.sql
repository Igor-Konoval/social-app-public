/*
  Warnings:

  - You are about to drop the column `payload` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "payload",
ADD COLUMN     "payloadData" TEXT;
