import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      this.logger.warn('Token não fornecido');
      throw new UnauthorizedException('Token não fornecido');
    }
    const [, token] = authHeader.split(' ');
    if (!token) {
      this.logger.warn('Token mal formatado');
      throw new UnauthorizedException('Token mal formatado');
    }
    try {
      const payload: Record<string, unknown> = this.jwtService.verify(token);
      request.user = payload;
      this.logger.log(`Token válido para o usuário ${JSON.stringify(payload)}`);
      return true;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Token inválido ou expirado: ${err.message}`);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
