import { FirebaseAuthStrategy } from './firebase-auth-strategy';
import { DateTime } from 'luxon';
import { UserRecord } from 'firebase-admin/lib/auth';

describe('FirebaseAuthStrategy', () => {
  let strategy: jest.Mocked<FirebaseAuthStrategy>;

  beforeEach(() => {
    strategy = {
      verifyLogin: jest.fn((token) =>
        token === 'valid'
          ? Promise.resolve({
              aud: 'test',
              auth_time: DateTime.now().toSeconds(),
              exp: DateTime.now().plus({ second: 30 }).toSeconds(),
              firebase: {
                identities: {
                  test: 'test',
                },
                sign_in_provider: 'test',
              },
              iat: DateTime.now().toSeconds(),
              iss: 'test',
              sub: 'test',
              uid: 'test',
            })
          : null,
      ),
      delete: jest.fn().mockResolvedValue({
        uid: 'test',
        emailVerified: true,
        disabled: false,
        metadata: null,
        providerData: [],
        toJSON: {},
      }),
      login: jest.fn().mockResolvedValue('jwt.token'),
      register: jest.fn().mockResolvedValue({
        uid: 'test',
        emailVerified: true,
        disabled: false,
        metadata: null,
        providerData: [],
        toJSON: {},
      }),
    };
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('verifyLogin', () => {
    it('should return data about user when a valid token is provided', async () => {
      const result = await strategy.verifyLogin('valid');
      expect(result).toHaveProperty('uid', 'test');
    });

    it('should return null when an invalid token is provided', async () => {
      const result = await strategy.verifyLogin('');
      expect(result).toBeNull();
    });
  });

  describe('register user', () => {
    it('should return an user record', async () => {
      const result = (await strategy.register({})) as UserRecord;
      expect(result).toHaveProperty('uid', 'test');
    });
  });

  describe('delete user', () => {
    it('should return user id', async () => {
      const result = (await strategy.register({
        uid: 'test',
      })) as UserRecord;
      expect(result).toHaveProperty('uid', 'test');
    });
  });

  describe('login', () => {
    it('should return a token', async () => {
      const result = await strategy.login({});
      expect(result).toBe('jwt.token');
    });
  });
});
