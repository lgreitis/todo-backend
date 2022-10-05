import { prisma } from '@config/prisma';
import { CreateOrganizationDto, EditOrganizationDto } from '@dtos/organization.dto';
import { HttpException } from '@exceptions/HttpException';
import { exceptions } from 'winston';
import { userService } from './user.service';

const getOrganization = async (userId: string, id: string) => {
  const organization = await prisma.organization.findFirst({
    where: { id, users: { some: { id: userId } } },
    include: {
      users: { select: { id: true, email: true, username: true } },
    },
  });

  if (!organization) {
    throw new HttpException(404, 'Organization not found');
  }
  return organization;
};

const createOrganization = async (userId: string, data: CreateOrganizationDto) => {
  const organization = await prisma.organization.create({
    data: { name: data.name, ownerUserId: userId, users: { connect: { id: userId } } },
  });

  return organization;
};

// const deleteOrganization = async () => {};

const editOrganization = async (userId: string, id: string, data: EditOrganizationDto) => {
  const user = await userService.getUserOwnedOrganizations(userId);

  if (!user.ownedOrganizations.find((el) => el.id === id)) {
    throw new HttpException(401, 'Unauthorized');
  }

  const organization = await prisma.organization.update({ where: { id }, data: { ...data } });

  return organization;
};

const addToOrganization = async (userId: string, ownerId: string, id: string) => {
  const user = await userService.getUserOwnedOrganizations(ownerId);

  if (!user.ownedOrganizations.find((el) => el.id === id)) {
    throw new HttpException(401, 'Unauthorized');
  }

  const organization = await prisma.organization.update({
    where: { id },
    data: { users: { connect: { id: userId } } },
  });

  return organization;
};

const listOrganizations = async (userId: string) => {
  const organizations = await prisma.organization.findMany({
    where: { users: { some: { id: userId } } },
  });

  return organizations;
};

export const organizationService = {
  getOrganization,
  createOrganization,
  //   deleteOrganization,
  editOrganization,
  listOrganizations,
  addToOrganization,
};