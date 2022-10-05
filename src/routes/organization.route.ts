import { organizationController } from '@controllers';
import {
  AddUserToOrganizationSchema,
  CreateOrganizationSchema,
  EditOrganizationSchema,
  GetOrganizationSchema,
} from '@dtos/organization.dto';
import { authMiddleware } from '@middlewares/authentication.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { Router } from 'express';

const router = Router();

const path = '/organization';

router.get(
  `${path}/:id`,
  authMiddleware,
  validationMiddleware(GetOrganizationSchema, 'params'),
  organizationController.getOrganization
);

router.post(
  `${path}`,
  authMiddleware,
  validationMiddleware(CreateOrganizationSchema, 'body'),
  organizationController.createOrganization
);

router.get(`${path}`, authMiddleware, organizationController.listOrganizations);

router.patch(
  `${path}/:id`,
  authMiddleware,
  validationMiddleware(EditOrganizationSchema, 'body'),
  organizationController.editOrganization
);

router.post(
  `${path}/add`,
  authMiddleware,
  validationMiddleware(AddUserToOrganizationSchema, 'body'),
  organizationController.addUserToOrganization
);

export default { router, path };
