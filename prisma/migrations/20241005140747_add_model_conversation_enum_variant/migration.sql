-- CreateEnum
CREATE TYPE "ConversationVariant" AS ENUM ('ONETOONE', 'CONVERSATION');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "variant" "ConversationVariant" NOT NULL DEFAULT 'ONETOONE';
