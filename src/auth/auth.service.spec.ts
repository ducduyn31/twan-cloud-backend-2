import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { FirebaseAuthStrategy } from '../firebase/firebase-auth-strategy';
import { DateTime } from 'luxon';

describe('AuthService', () => {
  const strategy: jest.Mocked<FirebaseAuthStrategy> = {
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
    delete: jest.fn(),
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
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService.forStrategy(strategy)],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should have user id', async () => {
      const result = await service.register({});
      expect(result).toHaveProperty('uid', 'test');
    });
  });

  describe('deleteAuth', () => {
    it('should have user id', async () => {
      const result = await service.deleteAuth({});
      expect(result).toHaveProperty('uid', 'test');
    });
  });

  describe('login', () => {
    it('should have user id', async () => {
      const result = await service.login({});
      expect(result).toBe('jwt.token');
    });
  });

  describe('verify', () => {
    it('should have user id', async () => {
      const result = await service.verify({});
      expect(result).toHaveProperty('uid', 'test');
    });
  });
});
