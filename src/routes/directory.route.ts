import { directoryController } from '@controllers';
import {
  CreateItemSchema,
  EditItemSchema,
  GetDirectoryChildrenSchema,
  GetDirectoryRootSchema,
  RemoveItemSchema,
} from '@dtos/directory.dto';
import { authMiddleware } from '@middlewares/authentication.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { Router } from 'express';

const router = Router();

const path = '/directory';

router.get(
  `${path}/:organizationId`,
  authMiddleware,
  validationMiddleware(GetDirectoryRootSchema, 'params'),
  directoryController.meta
);

router.get(
  `${path}/:organizationId/:parentId`,
  authMiddleware,
  validationMiddleware(GetDirectoryChildrenSchema, 'params'),
  directoryController.getChildren
);

router.post(
  `${path}/`,
  authMiddleware,
  validationMiddleware(CreateItemSchema, 'body'),
  directoryController.createItem
);

router.patch(
  `${path}/`,
  authMiddleware,
  validationMiddleware(EditItemSchema, 'body'),
  directoryController.editItem
);

router.delete(
  `${path}/:id/:type`,
  authMiddleware,
  validationMiddleware(RemoveItemSchema, 'params'),
  directoryController.removeItem
);

export default { router, path };
