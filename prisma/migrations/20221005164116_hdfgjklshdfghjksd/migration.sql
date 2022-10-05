/*
  Warnings:

  - You are about to drop the `_OrganizationToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrganizationToUser" DROP CONSTRAINT "_OrganizationToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrganizationToUser" DROP CONSTRAINT "_OrganizationToUser_B_fkey";

-- DropTable
DROP TABLE "_OrganizationToUser";

-- CreateTable
CREATE TABLE "OrganizationsOnUsers" (
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isOwner" BOOLEAN NOT NULL,

    CONSTRAINT "OrganizationsOnUsers_pkey" PRIMARY KEY ("organizationId","userId")
);

-- AddForeignKey
ALTER TABLE "OrganizationsOnUsers" ADD CONSTRAINT "OrganizationsOnUsers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationsOnUsers" ADD CONSTRAINT "OrganizationsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
