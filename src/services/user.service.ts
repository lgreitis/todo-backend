import { prisma } from '@config/prisma';
import { HttpException } from '@exceptions/HttpException';

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

export const userService = { getById, getUserOrganizations, getUserOwnedOrganizations };
