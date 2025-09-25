import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from 'src/domain/user/repositories/users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [TypeOrmModule.forFeature([User, UsersRepository]), AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    makeCounterProvider({
      name: 'create_user_requests_total',
      help: 'Total de requisições para criação de usuários',
    }),
    makeCounterProvider({
      name: 'update_user_password_requests_total',
      help: 'Total de requisições para atualização de senha de usuários',
    }),
    makeCounterProvider({
      name: 'delete_user_requests_total',
      help: 'Total de requisições para deleção de usuários',
    }),
  ],
  exports: [UsersService],
})
export class UsersModule {}
