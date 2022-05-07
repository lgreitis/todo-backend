import { NextFunction, Request, Response } from 'express';

export const index = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
