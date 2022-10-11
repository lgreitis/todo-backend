import { prisma } from '@config/prisma';
import { CreateItemDto, EditItemDto, RemoveItemDto } from '@dtos/directory.dto';
import { HttpException } from '@exceptions/httpException';

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
  console.log('here');
  await prisma.folder.delete({ where: { id: data.id } });
};
