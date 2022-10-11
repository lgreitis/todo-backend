import { HttpException } from '@exceptions/httpException';
import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    let status = error.status;
    let message = error.message;

    // Since error type isn't exactly true
    // we don't want to leak the stack trace :)
    if (!(error instanceof HttpException)) {
      status = 500;
      message = 'Internal server error';
    }

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${error.message}`
    );

    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
