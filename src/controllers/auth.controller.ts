import { CreateUserDto, LoginUserDto, RegenerateTokensDto } from '@dtos/user.dto';
import { authService } from '@services';
import { NextFunction, Request, Response } from 'express';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: LoginUserDto = req.body;
    const responseData = await authService.login(data);

    res.status(200).send(responseData);
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CreateUserDto = req.body;
    const responseData = await authService.register(data);

    res.status(200).send(responseData);
  } catch (error) {
    next(error);
  }
};

export const regenerateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: RegenerateTokensDto = req.body;
    const responseData = await authService.regenerateTokens(data);

    res.status(200).send(responseData);
  } catch (error) {
    next(error);
  }
};
