import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { SharedModule } from '../shared/shared.module';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    expect(
      service.createUser({
        email: 'user@test.com',
        password: 'test',
        cloudPassword: 'test',
        cloudUsername: 'test',
      }),
    );
  });

  describe('getToken', () => {
    expect(service.getToken('user@test.com')).toBe({ token: 'test' });
  });
});
