import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from 'src/domain/user/repositories/users.repository';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUsersService = {
    findAll: jest
      .fn()
      .mockReturnValue([{ id: '1', name: 'Kaue', email: 'kaue@email.com' }]),
    create: jest.fn(),
    findOne: jest.fn(),
  };
  const mockUsersRepository = {};
  const mockJwtService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: 'PROM_METRIC_USERS_TOTAL', useValue: {} },
        { provide: 'PROM_METRIC_USERS_CREATED_TOTAL', useValue: {} },
        { provide: 'PROM_METRIC_USERS_FETCHED_TOTAL', useValue: {} },
        { provide: 'PROM_METRIC_USERS_DELETED_TOTAL', useValue: {} },
        { provide: 'PROM_METRIC_USERS_UPDATED_TOTAL', useValue: {} },
        { provide: 'PROM_METRIC_USERS_PASSWORD_UPDATED_TOTAL', useValue: {} },
        { provide: 'PROM_METRIC_CREATE_USER_REQUESTS_TOTAL', useValue: {} },
        {
          provide: 'PROM_METRIC_UPDATE_USER_PASSWORD_REQUESTS_TOTAL',
          useValue: {},
        },
        { provide: 'PROM_METRIC_DELETE_USER_REQUESTS_TOTAL', useValue: {} },
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users from service', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      { id: '1', name: 'Kaue', email: 'kaue@email.com' },
    ]);
    expect(mockUsersService.findAll).toHaveBeenCalled();
  });
  it('should create a user', async () => {
    const createUserDto = {
      name: 'Novo',
      email: 'novo@email.com',
      password: '123',
    };
    mockUsersService.create.mockResolvedValue({ id: '2', ...createUserDto });
    const result = await controller.create(createUserDto);
    expect(result).toEqual({ id: '2', ...createUserDto });
    expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should return a user by id', async () => {
    const user = { id: '1', name: 'Kaue', email: 'kaue@email.com' };
    mockUsersService.findOne.mockReturnValue(user);
    const result = await controller.findOne('1');
    expect(result).toEqual(user);
    expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
  });
});
