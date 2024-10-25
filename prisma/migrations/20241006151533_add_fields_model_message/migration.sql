/*
  Warnings:

  - You are about to drop the column `username` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "username",
ADD COLUMN     "postId" INTEGER,
ADD COLUMN     "postUserAvatarUrl" TEXT,
ADD COLUMN     "postUsername" TEXT,
ALTER COLUMN "imageUrl" DROP NOT NULL,
ALTER COLUMN "imageUrl" SET DATA TYPE TEXT;
