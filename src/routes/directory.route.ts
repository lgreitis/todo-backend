import { directoryController } from '@controllers';
import {
  CreateItemSchema,
  EditItemSchema,
  GetDirectoryChildrenSchema,
  RemoveItemSchema,
} from '@dtos/directory.dto';
import validationMiddleware from '@middlewares/validation.middleware';
import { Router } from 'express';

const router = Router();

const path = '/directory';

router.get(`${path}/`, directoryController.meta);

router.get(
  `${path}/:parentId`,
  validationMiddleware(GetDirectoryChildrenSchema, 'params'),
  directoryController.getChildren
);

router.post(
  `${path}/`,
  validationMiddleware(CreateItemSchema, 'body'),
  directoryController.createItem
);

router.patch(
  `${path}/`,
  validationMiddleware(EditItemSchema, 'body'),
  directoryController.editItem
);

router.delete(
  `${path}/:id/:type`,
  validationMiddleware(RemoveItemSchema, 'params'),
  directoryController.removeItem
);

export default { router, path };
