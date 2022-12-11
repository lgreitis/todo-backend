import { signToken, verifyToken } from '@utils/jwt';
import sleep from '@utils/sleep';

describe('[UNIT] testing verifyToken', () => {
  it('Can verify correctly', async () => {
    const data = {
      id: 'testId',
      role: 'testRole',
      secret: 'superSecret',
      expiresIn: '1d',
    };

    const token = await signToken(data.id, data.role, data.secret, data.expiresIn);

    const verifiedData = verifyToken(token, data.secret);

    expect(verifiedData.id).toEqual(data.id);
    expect(verifiedData.role).toEqual(data.role);
  });

  it('Throws if expired', async () => {
    const data = {
      id: 'testId',
      role: 'testRole',
      secret: 'superSecret',
      expiresIn: '1s',
    };

    const token = await signToken(data.id, data.role, data.secret, data.expiresIn);

    await sleep(1100);

    const t = () => {
      verifyToken(token, data.secret);
    };

    expect(t).toThrow();
  });

  it('Throws if wrong secret', async () => {
    const data = {
      id: 'testId',
      role: 'testRole',
      secret: 'superSecret',
      expiresIn: '1d',
    };

    const token = await signToken(data.id, data.role, data.secret, data.expiresIn);

    const t = () => {
      verifyToken(token, 'BadSecret');
    };

    expect(t).toThrow();
  });

  it('Throws if random string', async () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const t = () => {
      verifyToken('VeryBadToken', 'RandomSecret');
    };

    expect(t).toThrow();
  });

  it('Throws if malformed data', async () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const t = () => {
      verifyToken(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6ImZkc2ZzZCJ9.eyJpZCI6InRlc3RJZCIsInJvbGUiOiJ0ZXN0Um9sZSIsImlhdCI6MTUxNjIzOTAyMn0.qnbH5lWQhptUJZ_irYti7SVe_OSE4S1JEPff-E4bBeo',
        'SuperSecret'
      );
    };

    expect(t).toThrow();
  });
});
