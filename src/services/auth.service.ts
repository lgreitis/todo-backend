import { prisma } from '@config/prisma';
import { CreateUserDto, LoginUserDto } from '@dtos/user.dto';
import { HttpException } from '@exceptions/httpException';
import { signToken } from '@utils/jwt';
import { compare, hash } from 'bcrypt';

const register = async (data: CreateUserDto) => {
  const findUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (findUser) throw new HttpException(409, 'User already exists');

  const hashedPassword = await hash(data.password, 10);

  const createUserData = await prisma.user.create({
    data: { email: data.email, username: data.username, password: hashedPassword },
  });

  const token = signToken(createUserData.id);

  return token;
};

const login = async (data: LoginUserDto) => {
  const findUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!findUser) throw new HttpException(400, 'Failed to login');

  const isPasswordMatching = await compare(data.password, findUser.password);
  if (!isPasswordMatching) throw new HttpException(400, 'Failed to login');

  const token = await signToken(findUser.id);

  return token;
};

export const authService = { register, login };
