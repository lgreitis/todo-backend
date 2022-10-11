import expressConfig from '@config/express';
import { CreateUserDto } from '@dtos/user.dto';
import { authRoute } from '@routes';
import request from 'supertest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let server: any;

beforeAll(() => {
  server = expressConfig([authRoute]);
});

describe('Testing auth route', () => {
  describe('[POST] /auth/register', () => {
    it('Responds with 200 and json with token', async () => {
      const data: CreateUserDto = {
        username: 'test123',
        password: 'test123',
        email: 'test@test.com',
      };

      const response = await request(server).post('/auth/register').send(data);
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeDefined();
    });

    it('Responds with 409 if email already exists', async () => {
      const data: CreateUserDto = {
        username: 'test123',
        password: 'test123',
        email: 'test@test.com',
      };
      await request(server).post('/auth/register').send(data);

      const request2 = await request(server).post('/auth/register').send(data);

      expect(request2.status).toEqual(409);
    });
  });
});
