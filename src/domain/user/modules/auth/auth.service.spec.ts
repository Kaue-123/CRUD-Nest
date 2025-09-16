import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  compare: jest.fn(() => Promise.resolve(true)),
}));

describe('AuthService', () => {
  let service: AuthService;
  const mockUsersService = {
    findByName: jest
      .fn()
      .mockResolvedValue({ id: '1', name: 'ana', password: 'hashed' }),
    create: jest.fn(),
  };
  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be signed in', async () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));
    console.log('Mocked bcrypt.compare to always return true');

    const result = await service.signIn('ana', 'testeNovaSenha');
    console.log('Result of signIn:', result);

    expect(result).toEqual({ access_token: 'token' });
  });
});
