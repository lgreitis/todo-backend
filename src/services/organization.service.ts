import { prisma } from '@config/prisma';
import { CreateOrganizationDto, EditOrganizationDto } from '@dtos/organization.dto';
import { HttpException } from '@exceptions/httpException';
import { userService } from '@services';

export const getOrganization = async (userId: string, id: string) => {
  const organization = await prisma.organization.findFirst({
    where: { id, users: { some: { id: userId } } },
    select: {
      id: true,
      name: true,
      users: { select: { id: true, email: true, username: true } },
      ownerUser: { select: { id: true, email: true, username: true } },
    },
  });

  if (!organization) {
    throw new HttpException(404, 'Organization not found');
  }

  return organization;
};

export const createOrganization = async (userId: string, data: CreateOrganizationDto) => {
  const organization = await prisma.organization.create({
    data: { name: data.name, ownerUserId: userId, users: { connect: { id: userId } } },
  });

  return organization;
};

export const deleteOrganization = async (userId: string, id: string) => {
  if (!(await userService.isUserOwnerOfOrganization(userId, id))) {
    throw new HttpException(404, 'Organization not found');
  }

  await prisma.organization.delete({ where: { id } });
};

export const editOrganization = async (userId: string, data: EditOrganizationDto) => {
  if (!(await userService.isUserOwnerOfOrganization(userId, data.id))) {
    throw new HttpException(404, 'Organization not found');
  }

  const organization = await prisma.organization.update({
    where: { id: data.id },
    data: { name: data.name },
  });

  return organization;
};

export const addToOrganization = async (userId: string, ownerId: string, id: string) => {
  if (!(await userService.isUserOwnerOfOrganization(ownerId, id))) {
    throw new HttpException(404, 'Organization not found');
  }

  const organization = await prisma.organization.update({
    where: { id },
    data: { users: { connect: { id: userId } } },
  });

  return organization;
};

export const removeFromOrganization = async (userId: string, ownerId: string, id: string) => {
  if (!(await userService.isUserOwnerOfOrganization(ownerId, id))) {
    throw new HttpException(404, 'Organization not found');
  }

  if (userId === ownerId) {
    throw new HttpException(400, "Can't remove owner from organization");
  }

  const organization = await prisma.organization.update({
    where: { id },
    data: { users: { disconnect: { id: userId } } },
  });

  return organization;
};

export const listOrganizations = async (userId: string) => {
  const organizations = await prisma.organization.findMany({
    where: { users: { some: { id: userId } } },
  });

  return organizations;
};
