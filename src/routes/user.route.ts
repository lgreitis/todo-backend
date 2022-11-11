import { userController } from '@controllers';
import { authMiddleware } from '@middlewares/authentication.middleware';
import { roleMiddleware } from '@middlewares/authorization.middleware';
import { Router } from 'express';

const router = Router();

const path = '/user';

router.get(`${path}/`, authMiddleware, userController.getMeta);

router.post(
  `${path}/role`,
  authMiddleware,
  roleMiddleware(['SUPERADMIN']),
  userController.changeRole
);

export default { router, path };
