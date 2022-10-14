import { prisma } from '@config/prisma';
import { HttpException } from '@exceptions/httpException';
import { DirectoryItems } from '@interfaces/directory.interface';
import { userService } from '@services';

export const getRoot = async (organizationId: string, userId: string) => {
  const userInOrganization = await userService.isUserInOrganization(userId, organizationId);

  if (!userInOrganization) {
    throw new HttpException(404, 'Organization not found');
  }

  const items = await prisma.$queryRaw<
    DirectoryItems[]
  >`select f.id, f."name", f."parentId", 'folder' as "type" 
    from "Folder" f 
    where f."parentId" is null and f."organizationId" = ${organizationId}
    union 
    select f2.id, f2."name", f2."parentId", 'file' as "type" 
    from "File" f2
    where f2."parentId" is null and f2."organizationId" = ${organizationId}`;

  return items;
};

export const getChildren = async (id: string, organizationId: string, userId: string) => {
  const userInOrganization = await userService.isUserInOrganization(userId, organizationId);

  if (!userInOrganization) {
    throw new HttpException(404, 'Organization not found');
  }

  const items = await prisma.$queryRaw<
    DirectoryItems[]
  >`select f.id, f."name", f."parentId", 'folder' as "type" 
    from "Folder" f 
    where f."parentId" = ${id} and f."organizationId" = ${organizationId}
    union 
    select f2.id, f2."name", f2."parentId", 'file' as "type" 
    from "File" f2
    where f2."parentId" = ${id} and f2."organizationId" = ${organizationId}`;

  return items;
};

export const get = async (id: string | null, organizationId: string, userId: string) => {
  return await (id ? getChildren(id, organizationId, userId) : getRoot(organizationId, userId));
};
