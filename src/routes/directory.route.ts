import { directoryController } from '@controllers';
import { CreateItemSchema, EditItemSchema, GetDirectoryChildrenSchema } from '@dtos/directory.dto';
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

export default { router, path };
