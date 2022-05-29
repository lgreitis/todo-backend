import { NextFunction, Request, Response } from 'express';

export const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).send({ hello: 'All good' });
  } catch (error) {
    next(error);
  }
};
