import {
  CreateItemDto,
  EditItemDto,
  GetDirectoryChildrenDto,
  GetDirectoryRootDto,
  GetFileDto,
  ItemEnum,
  RemoveItemDto,
} from '@dtos/directory.dto';
import { File, Folder } from '@prisma/client';
import { directoryService, fileService, folderService, userService } from '@services';
import { NextFunction, Request, Response } from 'express';

export const meta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.params as GetDirectoryRootDto;
    const items = await directoryService.getRoot(params.organizationId, req.tokenData.id);

    res.status(200).send({ items });
  } catch (error) {
    next(error);
  }
};

export const getFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.params as GetFileDto;

    await userService.isUserInOrganizationOrThrow(req.tokenData.id, params.organizationId);

    const items = await fileService.getFile(params);

    res.status(200).send(items);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.params as GetDirectoryRootDto;
    const items = await directoryService.getAll(params.organizationId, req.tokenData.id);

    res.status(200).send({ items });
  } catch (error) {
    next(error);
  }
};

export const getChildren = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.params as GetDirectoryChildrenDto;
    const items = await directoryService.getChildren(
      params.parentId,
      params.organizationId,
      req.tokenData.id
    );

    res.status(200).send({ items });
  } catch (error) {
    next(error);
  }
};

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CreateItemDto = req.body;

    await userService.isUserInOrganizationOrThrow(req.tokenData.id, data.organizationId);

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

    const items = await directoryService.get(item.parentId, data.organizationId, req.tokenData.id);

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
        await fileService.userHasAccessOrThrow(req.tokenData.id, data.id);
        item = await fileService.renameFile(data);
        break;
      }
      case ItemEnum.folder: {
        await folderService.userHasAccessOrThrow(req.tokenData.id, data.id);
        item = await folderService.renameFolder(data);
        break;
      }
    }

    const items = await directoryService.get(item.parentId, item.organizationId, req.tokenData.id);

    res.status(200).send({ items });
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.params as RemoveItemDto;

    let item: File | Folder;
    switch (data.type) {
      case ItemEnum.file: {
        await fileService.userHasAccessOrThrow(req.tokenData.id, data.id);
        item = await fileService.getFileById(data.id);
        await fileService.removeFile(data);
        break;
      }
      case ItemEnum.folder: {
        await folderService.userHasAccessOrThrow(req.tokenData.id, data.id);
        item = await folderService.getFolder(data.id);
        await folderService.removeFolder(data);
        break;
      }
    }

    const items = await directoryService.get(item.parentId, item.organizationId, req.tokenData.id);

    res.status(200).send({ items });
  } catch (error) {
    next(error);
  }
};
