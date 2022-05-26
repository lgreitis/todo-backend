import expressConfig from '@config/express';
import indexRoute from '@routes/index.route';
import request from 'supertest';

let server: any;

beforeAll(() => {
  server = expressConfig([indexRoute]);
});

describe('Testing index route', () => {
  describe('[GET] /', () => {
    it('Responds with 200 and json body', async function () {
      const response = await request(server).get('/');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ hello: 'All good' });
    });
  });
});
