import { prisma } from '@config/prisma';
import { DirectoryItems } from '@interfaces/directory.interface';

const getRoot = async () => {
  const items = await prisma.$queryRaw<
    DirectoryItems[]
  >`select f.id, f."name", f."parentId", 'folder' as "type" 
    from "Folder" f 
    where f."parentId" is null
    union 
    select f2.id, f2."name", f2."parentId", 'file' as "type" 
    from "File" f2
    where f2."parentId" is null`;

  return items;
};

const getChildren = async (id: string) => {
  const items = await prisma.$queryRaw<
    DirectoryItems[]
  >`select f.id, f."name", f."parentId", 'folder' as "type" 
    from "Folder" f 
    where f."parentId" = ${id}
    union 
    select f2.id, f2."name", f2."parentId", 'file' as "type" 
    from "File" f2
    where f2."parentId" = ${id}`;

  return items;
};

const get = async (id: string | null) => {
  return await (id ? getChildren(id) : getRoot());
};

export const directoryService = { get, getRoot, getChildren };
