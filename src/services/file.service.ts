import { prisma } from '@config/prisma';
import { CreateItemDto, EditItemDto, RemoveItemDto } from '@dtos/directory.dto';

const addFile = async (data: CreateItemDto) => {
  const file = await prisma.file.create({
    data: { name: data.name, parentId: data.parentId, organizationId: data.organizationId },
  });

  return file;
};

const renameFile = async (data: EditItemDto) => {
  const folder = await prisma.file.update({
    data: { name: data.name },
    where: { id: data.id },
  });

  return folder;
};

const removeFile = async (data: RemoveItemDto) => {
  await prisma.file.delete({ where: { id: data.id } });
};

export const fileService = { addFile, renameFile, removeFile };
