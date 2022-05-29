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

  const createUserData = await User.create({ ...data, password_hash: hashedPassword });

  const token = signToken(createUserData._id);

  return token;
};

const login = async (data: LoginUserDto) => {
  const findUser = await User.findOne({ username: data.username });

  if (!findUser) throw new HttpException(400, 'User not found');

  const isPasswordMatching = await compare(data.password, findUser.password_hash);
  if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

  const token = signToken(findUser._id);

  return token;
};

const signToken = (id: string) => {
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
    if (err) throw new HttpException(500, 'Error signing token');

    return token;
  });
};

const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new HttpException(401, 'Invalid token');
  }
};

export { register, login, verifyToken };
