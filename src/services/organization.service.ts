import { prisma } from '@config/prisma';
import { CreateOrganizationDto, EditOrganizationDto } from '@dtos/organization.dto';
import { HttpException } from '@exceptions/httpException';
import { userService } from './user.service';

const getOrganization = async (userId: string, id: string) => {
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

const createOrganization = async (userId: string, data: CreateOrganizationDto) => {
  const organization = await prisma.organization.create({
    data: { name: data.name, ownerUserId: userId, users: { connect: { id: userId } } },
  });

  return organization;
};

const deleteOrganization = async (userId: string, id: string) => {
  if (!(await userService.isUserOwnerOfOrganization(userId, id))) {
    throw new HttpException(401, 'Unauthorized');
  }

  await prisma.organization.delete({ where: { id } });
};

const editOrganization = async (userId: string, data: EditOrganizationDto) => {
  if (!(await userService.isUserOwnerOfOrganization(userId, data.id))) {
    throw new HttpException(401, 'Unauthorized');
  }

  const organization = await prisma.organization.update({
    where: { id: data.id },
    data: { name: data.name },
  });

  return organization;
};

const addToOrganization = async (userId: string, ownerId: string, id: string) => {
  if (!(await userService.isUserOwnerOfOrganization(ownerId, id))) {
    throw new HttpException(401, 'Unauthorized');
  }

  const organization = await prisma.organization.update({
    where: { id },
    data: { users: { connect: { id: userId } } },
  });

  return organization;
};

const removeFromOrganization = async (userId: string, ownerId: string, id: string) => {
  if (!(await userService.isUserOwnerOfOrganization(ownerId, id))) {
    throw new HttpException(401, 'Unauthorized');
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

const listOrganizations = async (userId: string) => {
  const organizations = await prisma.organization.findMany({
    where: { users: { some: { id: userId } } },
  });

  return organizations;
};

export const organizationService = {
  getOrganization,
  createOrganization,
  deleteOrganization,
  editOrganization,
  listOrganizations,
  addToOrganization,
  removeFromOrganization,
};
