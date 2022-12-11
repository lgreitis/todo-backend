import {
  AddUserFromInviteDto,
  CreateInviteDto,
  CreateInvitedUserDto,
  EditInviteDto,
  GetAllInvitesDto,
  GetInviteDto,
} from '@dtos/invite.dto';
import { inviteService, userService } from '@services';

import { NextFunction, Request, Response } from 'express';

export const getAllInvites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.params as GetAllInvitesDto;
    await userService.isUserInOrganizationOrThrow(req.tokenData.id, params.organizationId);
    const invite = await inviteService.getAllInvites(params.organizationId);

    res.status(200).send(invite);
  } catch (error) {
    next(error);
  }
};

export const getInvite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.params as GetInviteDto;
    // await inviteService.hasInviteEditPrivilegesOrThrow(req.tokenData.id, params.id);
    const invite = await inviteService.getInvite(params.id);

    res.status(200).send(invite);
  } catch (error) {
    next(error);
  }
};

export const createInvite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as CreateInviteDto;
    await userService.isUserInOrganizationOrThrow(req.tokenData.id, data.organizationId);
    const invite = await inviteService.createInvite(data);

    res.status(200).send(invite);
  } catch (error) {
    next(error);
  }
};

export const editInvite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as EditInviteDto;
    await inviteService.hasInviteEditPrivilegesOrThrow(req.tokenData.id, data.id);
    const invite = await inviteService.editInvite(data);

    res.status(200).send(invite);
  } catch (error) {
    next(error);
  }
};

export const createInviteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as CreateInvitedUserDto;
    const invite = await inviteService.createInviteUser(data);

    res.status(200).send(invite);
  } catch (error) {
    next(error);
  }
};

export const addUserFromInvite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.tokenData.id;
    const data = req.body as AddUserFromInviteDto;
    await inviteService.addUserFromInvite(userId, data.inviteId);

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};
