import Joi from 'joi';

export interface CreateUserDto {
  username: string;
  password: string;
  email: string;
}

export interface LoginUserDto {
  username: string;
  password: string;
}

export const CreateUserDto = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const LoginUserDto = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
