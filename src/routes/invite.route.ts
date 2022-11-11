import { inviteController } from '@controllers';
import {
  AddUserFromInviteSchema,
  CreateInvitedUserSchema,
  CreateInviteSchema,
  EditInviteSchema,
  GetAllInvitesSchema,
  GetInviteSchema,
} from '@dtos/invite.dto';
import { authMiddleware } from '@middlewares/authentication.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { Router } from 'express';

const router = Router();

const path = '/invite';

router.get(
  `${path}/organization/:organizationId`,
  authMiddleware,
  validationMiddleware(GetAllInvitesSchema, 'params'),
  inviteController.getAllInvites
);

router.get(
  `${path}/:id`,
  authMiddleware,
  validationMiddleware(GetInviteSchema, 'params'),
  inviteController.getInvite
);

router.post(
  `${path}`,
  authMiddleware,
  validationMiddleware(CreateInviteSchema, 'body'),
  inviteController.createInvite
);

router.patch(
  `${path}`,
  authMiddleware,
  validationMiddleware(EditInviteSchema, 'body'),
  inviteController.editInvite
);

router.post(
  `${path}/createUser`,
  validationMiddleware(CreateInvitedUserSchema, 'body'),
  inviteController.createInviteUser
);

router.post(
  `${path}/addUser`,
  authMiddleware,
  validationMiddleware(AddUserFromInviteSchema, 'body'),
  inviteController.addUserFromInvite
);

export default { router, path };
