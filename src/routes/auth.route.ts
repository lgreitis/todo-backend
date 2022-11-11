import { authController } from '@controllers';
import { CreateUserSchema, LoginUserSchema, RegenerateTokensSchema } from '@dtos/user.dto';
import validationMiddleware from '@middlewares/validation.middleware';
import { Router } from 'express';

const router = Router();

const path = '/auth';

router.post(`${path}/login`, validationMiddleware(LoginUserSchema, 'body'), authController.login);

router.post(
  `${path}/register`,
  validationMiddleware(CreateUserSchema, 'body'),
  authController.register
);

router.post(
  `${path}/regenerateToken`,
  validationMiddleware(RegenerateTokensSchema, 'body'),
  authController.regenerateToken
);

export default { router, path };
