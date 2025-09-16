import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/domain/user/repositories/users.repository';
import { User } from './entities/user.entity';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
    };
    return await this.userRepository.createUser(userData);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOneById(id);
  }

  async findByName(name: string): Promise<User | null> {
    return await this.userRepository.findByName(name);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.removeById(id);
  }

  async updatePassword(id: string, newPassword: string): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await this.userRepository.updatePassword(id, hashedPassword);
  }
}
