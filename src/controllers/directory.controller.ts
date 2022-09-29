import { CreateItemDto, EditItemDto, ItemEnum } from '@dtos/directory.dto';
import { DirectoryItems } from '@interfaces/directory.interface';
import { File, Folder } from '@prisma/client';
import { directoryService } from '@services/directory.service';
import { fileService } from '@services/file.service';
import { folderService } from '@services/folder.service';
import { NextFunction, Request, Response } from 'express';

export const meta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await directoryService.getRoot();

    res.status(200).send({ items });
  } catch (error) {
    next(error);
  }
};

export const getChildren = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.params;
    const items = await directoryService.getChildren(params.parentId);

    res.status(200).send({ items });
  } catch (error) {
    next(error);
  }
};

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CreateItemDto = req.body;

    let item: File | Folder;
    switch (data.type) {
      case ItemEnum.file:
        item = await fileService.addFile(data);
        break;
      case ItemEnum.folder:
        item = await folderService.addFolder(data);
        break;
    }

    let items: DirectoryItems[] = [];
    if (item.parentId) {
      items = (await directoryService.getChildren(item.parentId)) as DirectoryItems[];
    } else {
      items = (await directoryService.getRoot()) as DirectoryItems[];
    }

    res.status(200).send({ items });
  } catch (error) {
    next(error);
  }
};

export const editItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: EditItemDto = req.body;

    let item: File | Folder;
    switch (data.type) {
      case ItemEnum.file:
        item = await fileService.renameFile(data);
        break;
      case ItemEnum.folder:
        item = await folderService.renameFolder(data);
        break;
    }

    let items: DirectoryItems[] = [];
    if (item.parentId) {
      items = (await directoryService.getChildren(item.parentId)) as DirectoryItems[];
    } else {
      items = (await directoryService.getRoot()) as DirectoryItems[];
    }

    res.status(200).send({ items });
  } catch (error) {
    next(error);
  }
};
