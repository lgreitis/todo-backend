import { HttpException } from '@exceptions/httpException';
import jwt from 'jsonwebtoken';

// export const signToken = (id: string, expiresIn: string) => {
export const signToken = (
  id: string,
  role: string,
  secret: string,
  expiresIn: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign({ id, role }, secret, { expiresIn }, (err, token) => {
      if (err || !token) {
        reject(new HttpException(500, 'Error signing token'));
        return;
      }

      resolve(token);
    });
  });
};

export const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    return decoded;
  } catch {
    throw new HttpException(401, 'Invalid token');
  }
};
