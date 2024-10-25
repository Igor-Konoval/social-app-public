/*
  Warnings:

  - The values [REJECTED] on the enum `FriendStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FriendStatus_new" AS ENUM ('PENDING', 'ACCEPTED');
ALTER TABLE "Friend" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Friend" ALTER COLUMN "status" TYPE "FriendStatus_new" USING ("status"::text::"FriendStatus_new");
ALTER TYPE "FriendStatus" RENAME TO "FriendStatus_old";
ALTER TYPE "FriendStatus_new" RENAME TO "FriendStatus";
DROP TYPE "FriendStatus_old";
ALTER TABLE "Friend" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "type";

-- DropEnum
DROP TYPE "NotificationType";
