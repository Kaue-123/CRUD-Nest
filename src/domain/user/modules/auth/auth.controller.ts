import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { AuthLoginDocs } from './decorators/auth-decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectMetric('user_logins_total') private readonly loginCounter: Counter,
    @InjectMetric('user_login_failures_total')
    private readonly loginFailuresCounter: Counter,
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @AuthLoginDocs()
  async login(
    @Body() signInDto: { name: string; password: string },
  ): Promise<{ token: string }> {
    try {
      const { access_token } = await this.authService.signIn(
        signInDto.name,
        signInDto.password,
      );
      this.loginCounter.inc();
      return { token: access_token };
    } catch (error) {
      const err = error as Error;
      this.loginFailuresCounter.inc();
      throw new UnauthorizedException(err.message || 'Unauthorized');
    }
  }
}
