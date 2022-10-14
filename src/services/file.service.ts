import { prisma } from '@config/prisma';
import { CreateItemDto, EditItemDto, GetFileDto, RemoveItemDto } from '@dtos/directory.dto';
import { HttpException } from '@exceptions/httpException';

export const addFile = async (data: CreateItemDto) => {
  const file = await prisma.file.create({
    data: { name: data.name, parentId: data.parentId, organizationId: data.organizationId },
  });

  return file;
};

export const renameFile = async (data: EditItemDto) => {
  const folder = await prisma.file.update({
    data: { name: data.name },
    where: { id: data.id },
  });

  return folder;
};

export const removeFile = async (data: RemoveItemDto) => {
  await prisma.file.delete({ where: { id: data.id } });
};

export const getFile = async (data: GetFileDto) => {
  const file = await prisma.file.findFirst({
    where: { organizationId: data.organizationId, parentId: data.folderId, id: data.fileId },
  });

  if (!file) {
    throw new HttpException(404, 'File does not exist');
  }

  return file;
};
