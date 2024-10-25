-- CreateEnum
CREATE TYPE "ActiveProperties" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('READ', 'UNREAD', 'NOTACTIVE');

-- AlterTable
ALTER TABLE "ConversationUser" ADD COLUMN     "messageStatus" "MessageStatus" NOT NULL DEFAULT 'NOTACTIVE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" "ActiveProperties" NOT NULL DEFAULT 'OFFLINE';
