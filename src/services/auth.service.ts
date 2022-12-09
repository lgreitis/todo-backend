import { prisma } from '@config/prisma';
import { JWT_SECRET, REFRESH_JWT_SECRET } from '@constants';
import { CreateUserDto, LoginUserDto, RegenerateTokensDto } from '@dtos/user.dto';
import { HttpException } from '@exceptions/httpException';
import { signToken, verifyToken } from '@utils/jwt';
import { compare, hash } from 'bcrypt';

export const register = async (data: CreateUserDto) => {
  const findUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (findUser) throw new HttpException(409, 'Failed to register, user already exists');

  const hashedPassword = await hash(data.password, 10);

  const createUserData = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      password: hashedPassword,
      role: 'USER',
    },
    select: { email: true, username: true, id: true, role: true },
  });

  const tokens = await generateTokens(createUserData.id, createUserData.role);

  return { ...tokens, ...createUserData };
};

export const login = async (data: LoginUserDto) => {
  const findUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!findUser)
    throw new HttpException(400, 'Failed to login, please check your email and password');

  const isPasswordMatching = await compare(data.password, findUser.password);
  if (!isPasswordMatching)
    throw new HttpException(400, 'Failed to login, please check your email and password');

  const tokens = await generateTokens(findUser.id, findUser.role);

  return tokens;
};

export const regenerateTokens = async (data: RegenerateTokensDto) => {
  const verified = verifyToken(data.refreshToken, REFRESH_JWT_SECRET);
  const findUser = await prisma.user.findUnique({ where: { id: verified.id } });

  if (!findUser) {
    throw new HttpException(400, "User doesn't exist");
  }

  const findToken = await prisma.userToken.findMany({
    where: { refreshToken: data.refreshToken },
  });

  if (findToken.length === 0) {
    // await prisma.userToken.deleteMany({ where: findUser });
    throw new HttpException(400, 'Bad refresh token');
  }

  await prisma.userToken.deleteMany({ where: { refreshToken: data.refreshToken } });

  const tokens = await generateTokens(findUser.id, findUser.role);

  return tokens;
};

// export const logout = async (data: RegenerateTokensDto) => {
//   const verified = await verifyToken(data.refreshToken, REFRESH_JWT_SECRET);
//   const findUser = await prisma.user.findUnique({ where: { id: verified.id } });

//   if (!findUser) {
//     throw new HttpException(400, "User doesn't exist");
//   }

//   const findToken = await prisma.userToken.findMany({
//     where: { token: data.refreshToken },
//   });
// };

const generateTokens = async (id: string, role: string) => {
  const accessToken = await signToken(id, role, JWT_SECRET, '1h');
  const refreshToken = await signToken(id, role, REFRESH_JWT_SECRET, '30d');

  await prisma.userToken.create({ data: { userId: id, refreshToken: refreshToken } });

  return { accessToken, refreshToken };
};
