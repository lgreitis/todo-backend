import { prisma } from '@config/prisma';
import { CreateItemDto, EditItemDto } from '@dtos/directory.dto';

const addFolder = async (data: CreateItemDto) => {
  const folder = await prisma.folder.create({
    data: { name: data.name, parentId: data.parentId },
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

export const folderService = { addFolder, renameFolder };
