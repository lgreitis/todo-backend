import expressConfig from '@config/express';
import { CreateUserDto, RegenerateTokensDto } from '@dtos/user.dto';
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
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.username).toBeDefined();
      expect(response.body.email).toBeDefined();
      expect(response.body.role).toBe('USER');
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

  describe('[POST] /auth/regenerateToken', () => {
    it('Responds with 200 and json with token', async () => {
      const userData: CreateUserDto = {
        username: 'test123',
        password: 'test123',
        email: 'test@test.com',
      };

      const user = await request(server).post('/auth/register').send(userData);

      const data: RegenerateTokensDto = {
        refreshToken: user.body.refreshToken,
      };

      const newTokens = await request(server).post('/auth/regenerateToken').send(data);
      expect(newTokens.status).toEqual(200);
      expect(newTokens.body.accessToken).toBeDefined();
      expect(newTokens.body.refreshToken).toBeDefined();
    });

    it('Responds with 400 if old refreshToken', async () => {
      const userData: CreateUserDto = {
        username: 'test123',
        password: 'test123',
        email: 'test@test.com',
      };

      const user = await request(server).post('/auth/register').send(userData);

      const data: RegenerateTokensDto = {
        refreshToken: user.body.refreshToken,
      };

      await new Promise((r) => setTimeout(r, 1100));

      await request(server).post('/auth/regenerateToken').send(data);

      await new Promise((r) => setTimeout(r, 1100));

      const badRequest = await request(server).post('/auth/regenerateToken').send(data);

      expect(badRequest.status).toEqual(400);
      expect(badRequest.body.message).toBe('Bad refresh token');
      expect(badRequest.body.accessToken).toBeUndefined();
      expect(badRequest.body.refreshToken).toBeUndefined();
    });
  });
});
