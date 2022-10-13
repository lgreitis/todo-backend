import {
  CreateItemDto,
  EditItemDto,
  GetDirectoryChildrenDto,
  GetDirectoryRootDto,
  ItemEnum,
  RemoveItemDto,
} from '@dtos/directory.dto';
import { File, Folder } from '@prisma/client';
import { directoryService, fileService, folderService } from '@services';
import { NextFunction, Request, Response } from 'express';

export const meta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.params as GetDirectoryRootDto;
    const items = await directoryService.getRoot(params.organizationId);

    res.status(200).send({ items });
  } catch (error) {
    next(error);
  }
};

export const getChildren = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.params as GetDirectoryChildrenDto;
    const items = await directoryService.getChildren(params.parentId, params.organizationId);

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
      case ItemEnum.file: {
        item = await fileService.addFile(data);
        break;
      }
      case ItemEnum.folder: {
        item = await folderService.addFolder(data);
        break;
      }
    }

    const items = await directoryService.get(item.parentId, data.organizationId);

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
      case ItemEnum.file: {
        item = await fileService.renameFile(data);
        break;
      }
      case ItemEnum.folder: {
        item = await folderService.renameFolder(data);
        break;
      }
    }

    const items = await directoryService.get(item.parentId, item.organizationId);

    res.status(200).send({ items });
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.params as RemoveItemDto;

    switch (data.type) {
      case ItemEnum.file: {
        await fileService.removeFile(data);
        break;
      }
      case ItemEnum.folder: {
        await folderService.removeFolder(data);
        break;
      }
    }

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};
