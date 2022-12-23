import { prisma } from '@config/prisma';
import { CreateItemDto, EditItemDto, RemoveItemDto } from '@dtos/directory.dto';
import { HttpException } from '@exceptions/httpException';
import { userService } from '@services';

export const addFolder = async (data: CreateItemDto) => {
  const folder = await prisma.folder.create({
    data: { name: data.name, parentId: data.parentId, organizationId: data.organizationId },
  });

  return folder;
};

export const renameFolder = async (data: EditItemDto) => {
  const folder = await prisma.folder.update({
    data: { name: data.name },
    where: { id: data.id },
  });

  return folder;
};

export const getFolder = async (id: string) => {
  const folder = await prisma.folder.findUnique({ where: { id } });

  if (!folder) {
    throw new HttpException(404, 'Folder not found');
  }

  return folder;
};

export const removeFolder = async (data: RemoveItemDto) => {
  await prisma.folder.delete({ where: { id: data.id } });
};

// Authorization function
export const userHasAccessToFolder = async (userId: string, folderId: string) => {
  const folder = await prisma.folder.findFirst({ where: { id: folderId } });

  if (!folder) {
    throw new HttpException(404, 'Organization does not exist');
  }

  return await userService.isUserInOrganization(userId, folder.organizationId);
};

// Authorization function
export const userHasAccessOrThrow = async (userId: string, folderId: string) => {
  const res = await userHasAccessToFolder(userId, folderId);

  if (!res) {
    const foundUser = await prisma.user.findUnique({ where: { id: userId } });
    if (foundUser && foundUser.role === 'SUPERADMIN') {
      return true;
    }

    throw new HttpException(404, 'Organization does not exist');
  }

  return res;
};
