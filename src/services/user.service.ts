import { prisma } from '@config/prisma';
import { HttpException } from '@exceptions/httpException';

const getById = async (id: string) => {
  const findUser = await prisma.user.findUnique({
    where: { id: id },
    select: { username: true, email: true },
  });

  if (!findUser) throw new HttpException(400, 'Failed to retrieve user');

  return findUser;
};

const getUserOrganizations = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id }, select: { organizations: true } });

  if (!user) throw new HttpException(400, 'Failed to retrieve user');

  return user;
};

const getUserOwnedOrganizations = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { ownedOrganizations: true },
  });

  if (!user) throw new HttpException(400, 'Failed to retrieve user');

  return user;
};

const isUserInOrganization = async (userId: string, organizationId: string) => {
  const organization = await prisma.organization.findFirst({
    where: { users: { some: { id: userId } }, id: organizationId },
  });

  return organization ? true : false;
};

const isUserOwnerOfOrganization = async (userId: string, organizationId: string) => {
  const organization = await prisma.organization.findFirst({
    where: { ownerUserId: userId, id: organizationId },
  });

  return organization ? true : false;
};

export const userService = {
  getById,
  getUserOrganizations,
  getUserOwnedOrganizations,
  isUserInOrganization,
  isUserOwnerOfOrganization,
};
