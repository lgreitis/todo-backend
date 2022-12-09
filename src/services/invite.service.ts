import { prisma } from '@config/prisma';
import { CreateInviteDto, CreateInvitedUserDto, EditInviteDto } from '@dtos/invite.dto';
import { HttpException } from '@exceptions/httpException';
import { authService, userService } from '@services';
import { logger } from '@utils/logger';

export const getAllInvites = async (organizationId: string) => {
  const invites = await prisma.invite.findMany({
    where: { organizationId: organizationId },
    include: {
      organization: { select: { name: true } },
      _count: { select: { usersInvited: true } },
    },
  });

  return invites;
};

export const getInvite = async (id: string) => {
  const invite = await prisma.invite.findUnique({
    where: { id },
    include: { organization: { select: { name: true } } },
  });

  if (!invite) {
    throw new HttpException(404, "Couldn't find an invite");
  }

  return invite;
};

export const createInvite = async (data: CreateInviteDto) => {
  const invite = await prisma.invite.create({
    data: {
      organizationId: data.organizationId,
      dateCreated: Date.now(),
      expirationDate: data.expirationDate,
    },
  });

  return invite;
};

export const editInvite = async (data: EditInviteDto) => {
  const invite = await prisma.invite.update({
    where: { id: data.id },
    data: {
      expirationDate: data.expirationDate,
      disabled: data.disabled,
    },
  });

  return invite;
};

export const isInviteValid = async (inviteId: string) => {
  const invite = await prisma.invite.findFirst({ where: { id: inviteId } });

  if (!invite || invite.disabled) {
    return false;
  }

  return true;
};

export const createInviteUser = async (data: CreateInvitedUserDto) => {
  const isValid = isInviteValid(data.inviteId);

  if (!isValid) {
    throw new HttpException(400, 'This invite is not valid');
  }

  const organization = await prisma.organization.findFirst({
    where: { invites: { some: { id: data.inviteId } } },
  });

  if (!organization) {
    throw new HttpException(400, "This organization doesn't exist");
  }

  const user = await authService.register(data);
  await connectUser(user.id, data.inviteId, organization.id);
  return user;
};

export const addUserFromInvite = async (userId: string, inviteId: string) => {
  const isValid = isInviteValid(inviteId);

  if (!isValid) {
    throw new HttpException(400, 'This invite is not valid');
  }

  const organization = await prisma.organization.findFirst({
    where: { invites: { some: { id: inviteId } } },
  });

  if (!organization) {
    throw new HttpException(400, "This organization doesn't exist");
  }

  await connectUser(userId, inviteId, organization.id);
};

const connectUser = async (userId: string, inviteId: string, organizationId: string) => {
  await prisma.invite.update({
    where: { id: inviteId },
    data: { usersInvited: { connect: { id: userId } } },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { organizations: { connect: { id: organizationId } } },
  });
};

// Authorization function
export const hasInviteEditPrivilegesOrThrow = async (userId: string, inviteId: string) => {
  const findInvite = await prisma.invite.findUnique({ where: { id: inviteId } });

  if (!findInvite) {
    // Throwing organization not found because isUserInOrganizationOrThrow returns organization not found error
    // Adding logger error so it would be easier to debug
    logger.error(`${userId} tried to access ${inviteId} invite without privileges`);
    throw new HttpException(404, 'Organization not found');
  }

  await userService.isUserInOrganizationOrThrow(userId, findInvite.organizationId);
};
