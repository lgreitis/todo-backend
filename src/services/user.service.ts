import { prisma } from '@config/prisma';
import { ChangeRoleDto } from '@dtos/user.dto';
import { HttpException } from '@exceptions/httpException';
import { logger } from '@utils/logger';

export const getById = async (id: string) => {
  const findUser = await prisma.user.findUnique({
    where: { id: id },
    select: { username: true, email: true },
  });

  if (!findUser) throw new HttpException(400, 'Failed to retrieve user');

  return findUser;
};

export const getUserOrganizations = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id }, select: { organizations: true } });

  if (!user) throw new HttpException(400, 'Failed to retrieve user');

  return user;
};

export const getUserOwnedOrganizations = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { ownedOrganizations: true },
  });

  if (!user) throw new HttpException(400, 'Failed to retrieve user');

  return user;
};

// Authorization function
export const isUserInOrganization = async (userId: string, organizationId: string) => {
  const organization = await prisma.organization.findFirst({
    where: { users: { some: { id: userId } }, id: organizationId },
  });

  if (!organization) {
    const foundUser = await prisma.user.findUnique({ where: { id: userId } });
    if (foundUser && foundUser.role === 'SUPERADMIN') {
      return true;
    }
  }

  return organization ? true : false;
};

// Authorization function
export const isUserInOrganizationOrThrow = async (userId: string, organizationId: string) => {
  const organization = await isUserInOrganization(userId, organizationId);

  if (!organization) {
    logger.error(`${userId} tried to access ${organizationId} resources without privileges`);
    throw new HttpException(404, 'Organization not found');
  }

  return organization ? true : false;
};

// Authorization function
export const isUserOwnerOfOrganization = async (userId: string, organizationId: string) => {
  const organization = await prisma.organization.findFirst({
    where: { ownerUserId: userId, id: organizationId },
  });

  if (!organization) {
    const foundUser = await prisma.user.findUnique({ where: { id: userId } });
    if (foundUser && foundUser.role === 'SUPERADMIN') {
      return true;
    }
  }

  return organization ? true : false;
};

export const removeUser = async (userId: string) => {
  await prisma.user.delete({ where: { id: userId } });
};

export const changeRole = async (data: ChangeRoleDto) => {
  await prisma.userToken.deleteMany({ where: { userId: data.userId } });

  return prisma.user.update({ where: { id: data.userId }, data: { role: data.role } });
};
