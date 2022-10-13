import { HttpException } from '@exceptions/httpException';
import { SyntaxError } from '@interfaces/error.interface';
import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';

const errorMiddleware = (
  error: HttpException | Error | SyntaxError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let status = 500;
    let message = 'Internal server error';

    if (error instanceof HttpException) {
      status = error.status;
      message = error.message;
    } else if ('type' in error && error.type === 'entity.parse.failed') {
      status = error.status;
      message = error.message;
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
