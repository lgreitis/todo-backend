import { ChangeRoleDto } from '@dtos/user.dto';
import { userService } from '@services';
import { NextFunction, Request, Response } from 'express';

export const getMeta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getById(req.tokenData.id);

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as ChangeRoleDto;
    const user = await userService.changeRole(data);

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};
