import { organizationController } from '@controllers';
import {
  CreateOrganizationSchema,
  DeleteOrganizationSchema,
  EditOrganizationSchema,
  EditUserOnOrganizationSchema,
  GetOrganizationSchema,
} from '@dtos/organization.dto';
import { authMiddleware } from '@middlewares/authentication.middleware';
import { roleMiddleware } from '@middlewares/authorization.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { Router } from 'express';

const router = Router();

const path = '/organization';

router.post(
  `${path}`,
  authMiddleware,
  validationMiddleware(CreateOrganizationSchema, 'body'),
  organizationController.createOrganization
);

router.get(`${path}`, authMiddleware, organizationController.listOrganizations);

router.get(
  `${path}/superadmin`,
  authMiddleware,
  roleMiddleware(['SUPERADMIN']),
  organizationController.listAllOrganizations
);

router.get(
  `${path}/:id`,
  authMiddleware,
  validationMiddleware(GetOrganizationSchema, 'params'),
  organizationController.getOrganization
);

router.patch(
  `${path}`,
  authMiddleware,
  validationMiddleware(EditOrganizationSchema, 'body'),
  organizationController.editOrganization
);

router.post(
  `${path}/add`,
  authMiddleware,
  validationMiddleware(EditUserOnOrganizationSchema, 'body'),
  organizationController.addUserToOrganization
);

router.post(
  `${path}/remove`,
  authMiddleware,
  validationMiddleware(EditUserOnOrganizationSchema, 'body'),
  organizationController.removeUserFromOrganization
);

router.delete(
  `${path}/:id`,
  authMiddleware,
  validationMiddleware(DeleteOrganizationSchema, 'params'),
  organizationController.deleteOrganization
);

export default { router, path };
