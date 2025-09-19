import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './domain/user/modules/users/users.module';
import { User } from './domain/user/modules/users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './domain/user/modules/auth/auth.module';
import { SendEmailModule } from './infra/send-email/send-email.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql',
      host: process.env.DB_DOCKER_HOST,
      port: Number(process.env.DB_DOCKER_PORT),
      username: process.env.DB_DOCKER_USERNAME,
      password: process.env.DB_DOCKER_PASSWORD,
      database: process.env.DB_DOCKER_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    AuthModule,
    SendEmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
