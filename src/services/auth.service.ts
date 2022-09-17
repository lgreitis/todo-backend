import { prisma } from '@config/prisma';
import { JWT_SECRET } from '@constants';
import { CreateUserDto, LoginUserDto } from '@dtos/user.dto';
import { HttpException } from '@exceptions/HttpException';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

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
  const findUser = await await prisma.user.findUnique({
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

const signToken = (id: string) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) reject(new HttpException(500, 'Error signing token'));

      resolve(token);
    });
  });
};

const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return decoded;
  } catch (err) {
    throw new HttpException(401, 'Invalid token');
  }
};

export const authService = { register, login, verifyToken };
