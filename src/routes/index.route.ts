import { indexController } from '@controllers';
import { Router } from 'express';

const router = Router();

const path = '/';

router.get(`${path}`, indexController.index);

export default { router, path };
