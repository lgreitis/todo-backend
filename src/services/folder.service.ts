import { prisma } from '@config/prisma';
import { CreateItemDto, EditItemDto, RemoveItemDto } from '@dtos/directory.dto';
import { HttpException } from '@exceptions/httpException';

const addFolder = async (data: CreateItemDto) => {
  const folder = await prisma.folder.create({
    data: { name: data.name, parentId: data.parentId, organizationId: data.organizationId },
  });

  return folder;
};

const renameFolder = async (data: EditItemDto) => {
  const folder = await prisma.folder.update({
    data: { name: data.name },
    where: { id: data.id },
  });

  return folder;
};

const getFolder = async (id: string) => {
  const folder = await prisma.folder.findUnique({ where: { id } });

  if (!folder) {
    throw new HttpException(404, 'Folder not found');
  }

  return folder;
};

const removeFolder = async (data: RemoveItemDto) => {
  console.log('here');
  await prisma.folder.delete({ where: { id: data.id } });
};

export const folderService = { addFolder, renameFolder, getFolder, removeFolder };
