import { authController } from '@controllers';
import { CreateUserDto, LoginUserDto } from '@dtos/user.dto';
import validationMiddleware from '@middlewares/validation.middleware';
import { Router } from 'express';

const router = Router();

const path = '/auth';

router.post(`${path}/login`, validationMiddleware(LoginUserDto, 'body'), authController.login);

router.post(
  `${path}/register`,
  validationMiddleware(CreateUserDto, 'body'),
  authController.register
);

export default { router, path };
