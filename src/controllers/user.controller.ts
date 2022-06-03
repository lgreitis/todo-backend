import { userService } from '@services/user.service';
import { NextFunction, Request, Response } from 'express';

export const getMeta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getById(req.tokenData);

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};
