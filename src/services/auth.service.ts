import { JWT_SECRET } from '@constants';
import { CreateUserDto, LoginUserDto } from '@dtos/user.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@models/user';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (data: CreateUserDto) => {
  const findUser = await User.findOne({
    $or: [{ username: data.username }, { email: data.email }],
  });

  if (findUser) throw new HttpException(409, 'User already exists');

  const hashedPassword = await hash(data.password, 10);

  const createUserData = await User.create({
    ...data,
    credits: 100000,
    age: 0,
    password_hash: hashedPassword,
  });

  const token = signToken(createUserData._id);

  return token;
};

const login = async (data: LoginUserDto) => {
  const findUser = await User.findOne({ username: data.username });

  if (!findUser) throw new HttpException(400, 'Failed to login');

  const isPasswordMatching = await compare(data.password, findUser.password_hash);
  if (!isPasswordMatching) throw new HttpException(400, 'Failed to login');

  const token = await signToken(findUser._id);

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
