-- CreateEnum
CREATE TYPE "MessageVariant" AS ENUM ('TEXT', 'POST', 'IMAGE');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "messageVariant" "MessageVariant" NOT NULL DEFAULT 'TEXT';
