import { HttpException } from '@exceptions/httpException';
import { SyntaxError } from '@interfaces/error.interface';
import { Prisma } from '@prisma/client';
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
      // If json body parse failed
      status = error.status;
      message = error.message;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Generic prisma errors
      switch (error.code) {
        // Foreign key constraint failed
        case 'P2003': {
          status = 400;
          message = 'Bad Request';
          break;
        }
        // An operation failed because it depends on one or more records that were required but not found.
        case 'P2025': {
          status = 404;
          message = 'Not Found';
          break;
        }
        default: {
          logger.error(`Unhandled prisma error: ${error.code}`);
          break;
        }
      }
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
