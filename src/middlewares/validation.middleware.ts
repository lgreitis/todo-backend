import { HttpException } from '@exceptions/HttpException';
import { RequestHandler } from 'express';
import Joi from 'joi';

const validationMiddleware = (
  schema: Joi.ObjectSchema<any>,
  value: 'body' | 'query' | 'params'
): RequestHandler => {
  return (req, res, next) => {
    const validation = schema.validate(req[value]);
    if (validation.error) {
      next(new HttpException(400, validation.error.message));
    } else {
      next();
    }
  };
};

export default validationMiddleware;
