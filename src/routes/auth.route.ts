import { indexController } from '@controllers';
import { CreateUserDto } from '@dtos/user.dto';
import validationMiddleware from '@middlewares/validation.middleware';
import { Router } from 'express';

const router = Router();

const path = '/auth';

router.get(`${path}`, validationMiddleware(CreateUserDto, 'body'), indexController.index);

export default { router, path };
