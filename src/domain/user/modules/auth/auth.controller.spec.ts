import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: 'PROM_METRIC_USER_LOGINS_TOTAL',
          useValue: { inc: jest.fn() },
        },
        {
          provide: 'PROM_METRIC_USER_LOGIN_FAILURES_TOTAL',
          useValue: { inc: jest.fn() },
        },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a token on successful login', async () => {
    mockAuthService.signIn = jest
      .fn()
      .mockResolvedValue({ access_token: 'token' });

    const sigInDto = { name: 'ana', password: 'testeNovaSenha' };
    const result = await controller.login(sigInDto);

    expect(result).toEqual({ token: 'token' });
    expect(mockAuthService.signIn).toHaveBeenCalledWith(
      'ana',
      'testeNovaSenha',
    );
  });
});
