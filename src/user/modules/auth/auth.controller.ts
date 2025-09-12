import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() signInDto: { name: string; password: string },
  ): Promise<{ token: string }> {
    try {
      const { access_token } = await this.authService.signIn(
        signInDto.name,
        signInDto.password,
      );
      return { token: access_token };
    } catch (error) {
      const err = error as Error;
      throw new UnauthorizedException(err.message || 'Unauthorized');
    }
  }
}
