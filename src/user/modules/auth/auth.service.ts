import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(name: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByName(name);
    if (!user) {
      throw new Error('Usuário ou senha inválidos');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Usuário ou senha inválidos');
    }
    const payload = { sub: user.id, name: user.name };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async signUp(name: string, password: string): Promise<void> {
    await this.usersService.create({
      name,
      password,
      email: '',
    });
  }
}
