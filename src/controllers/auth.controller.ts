import { CreateUserDto, LoginUserDto } from '@dtos/user.dto';
import { authService } from '@services/auth.service';
import { NextFunction, Request, Response } from 'express';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: LoginUserDto = req.body;
    const token = await authService.login(data);

    res.status(200).send({ token });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CreateUserDto = req.body;
    const token = await authService.register(data);

    res.status(200).send({ token });
  } catch (error) {
    next(error);
  }
};
