import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    makeCounterProvider({
      name: 'user_logins_total',
      help: 'Total de logins realizados com sucesso',
    }),
    makeCounterProvider({
      name: 'user_login_failures_total',
      help: 'Total de logins falhos',
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
