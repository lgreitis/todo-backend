import { JWT_SECRET } from '@constants';
import { HttpException } from '@exceptions/httpException';
import jwt from 'jsonwebtoken';

export const signToken = (id: string) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) reject(new HttpException(500, 'Error signing token'));

      resolve(token);
    });
  });
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return decoded;
  } catch {
    throw new HttpException(401, 'Invalid token');
  }
};
