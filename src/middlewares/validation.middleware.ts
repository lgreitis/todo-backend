import { HttpException } from '@exceptions/httpException';
import { RequestHandler } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validationMiddleware = (
  schema: AnyZodObject,
  value: 'body' | 'query' | 'params'
): RequestHandler => {
  return (req, res, next) => {
    try {
      // eslint-disable-next-line security/detect-object-injection
      schema.parse(req[value]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HttpException(400, JSON.parse(error.message));
      } else {
        next(new HttpException(500, 'Internal server error'));
      }
    }
  };
};
export default validationMiddleware;
