/*
  Warnings:

  - You are about to drop the `OrganizationsOnUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerUserId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrganizationsOnUsers" DROP CONSTRAINT "OrganizationsOnUsers_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationsOnUsers" DROP CONSTRAINT "OrganizationsOnUsers_userId_fkey";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "ownerUserId" TEXT NOT NULL;

-- DropTable
DROP TABLE "OrganizationsOnUsers";

-- CreateTable
CREATE TABLE "_organizations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_organizations_AB_unique" ON "_organizations"("A", "B");

-- CreateIndex
CREATE INDEX "_organizations_B_index" ON "_organizations"("B");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_organizations" ADD CONSTRAINT "_organizations_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_organizations" ADD CONSTRAINT "_organizations_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
