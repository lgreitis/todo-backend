import { HttpException } from '@exceptions/httpException';
import { NextFunction, Request, Response } from 'express';

export const roleMiddleware = (role: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { tokenData } = req;

    if (role.includes(tokenData.role)) {
      next();
    } else {
      throw new HttpException(403, 'Forbidden');
    }
  };
};
