import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findByName(name: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ name });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updatePassword(id: number, newPassword: string): Promise<User | null> {
    if (newPassword) {
      newPassword = await bcrypt.hash(newPassword, 10);
    }
    await this.userRepository.update(id, { password: newPassword });
    return this.userRepository.findOneBy({ id });
  }
}
