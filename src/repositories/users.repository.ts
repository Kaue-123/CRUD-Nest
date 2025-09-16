import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/domain/user/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async createUser(data: Partial<User>): Promise<User> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = this.repository.create(data);
    return await this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findOneById(id: string): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }

  async findByName(name: string): Promise<User | null> {
    return await this.repository.findOneBy({ name });
  }

  async removeById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async updatePassword(id: string, newPassword: string): Promise<User | null> {
    if (newPassword) {
      newPassword = await bcrypt.hash(newPassword, 10);
    }
    await this.repository.update(id, { password: newPassword });
    return this.repository.findOneBy({ id });
  }
}
