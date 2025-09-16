import { IsString, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString({ message: 'A senha deve ser uma string. ' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres. ' })
  password: string;
}
