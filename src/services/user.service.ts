import { HttpException } from '@exceptions/HttpException';
import { User } from '@models/user';

const getById = async (id: string) => {
  const findUser = await User.findById(id);

  if (!findUser) throw new HttpException(400, 'Failed to retrieve user');

  return findUser;
};

export const userService = { getById };
