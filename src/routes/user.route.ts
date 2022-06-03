import { userController } from '@controllers';
import { authMiddleware } from '@middlewares/authentication.middleware';
import { Router } from 'express';

const router = Router();

const path = '/user';

router.get(`${path}/`, authMiddleware, userController.getMeta);

export default { router, path };
