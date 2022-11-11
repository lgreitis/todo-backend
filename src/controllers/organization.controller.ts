import {
  CreateOrganizationDto,
  DeleteOrganizationDto,
  EditOrganizationDto,
  EditUserOnOrganizationDto,
} from '@dtos/organization.dto';
import { organizationService } from '@services';
import { NextFunction, Request, Response } from 'express';

export const getOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.params;
    const tokenData = req.tokenData;

    const organization =
      tokenData.role !== 'SUPERADMIN'
        ? await organizationService.getOrganization(tokenData.id, params.id)
        : await organizationService.getOrganizationAdmin(params.id);

    res.status(200).send(organization);
  } catch (error) {
    next(error);
  }
};

export const createOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenData = req.tokenData;
    const data: CreateOrganizationDto = req.body;

    const organization =
      tokenData.role !== 'SUPERADMIN'
        ? await organizationService.createOrganization(tokenData.id, data)
        : await organizationService.createOrganization(data.userId ?? tokenData.id, data);

    res.status(200).send(organization);
  } catch (error) {
    next(error);
  }
};

export const listOrganizations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.tokenData.id;

    const organization = await organizationService.listOrganizations(userId);

    res.status(200).send(organization);
  } catch (error) {
    next(error);
  }
};

export const listAllOrganizations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organization = await organizationService.listAllOrganizations();

    res.status(200).send(organization);
  } catch (error) {
    next(error);
  }
};

export const editOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.tokenData.id;
    const data: EditOrganizationDto = req.body;

    const organization = await organizationService.editOrganization(userId, data);

    res.status(200).send(organization);
  } catch (error) {
    next(error);
  }
};

export const addUserToOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.tokenData.id;
    const data: EditUserOnOrganizationDto = req.body;
    const organization = await organizationService.addToOrganization(data.userId, userId, data.id);

    res.status(200).send(organization);
  } catch (error) {
    next(error);
  }
};

export const removeUserFromOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.tokenData.id;
    const data: EditUserOnOrganizationDto = req.body;

    const organization = await organizationService.removeFromOrganization(
      data.userId,
      userId,
      data.id
    );

    res.status(200).send(organization);
  } catch (error) {
    next(error);
  }
};

export const deleteOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.tokenData.id;
    const data = req.params as DeleteOrganizationDto;

    await organizationService.deleteOrganization(userId, data.id);

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};
