import { IsEmail, IsNotEmpty } from 'class-validator';

export class BodyEmailDto {
  @IsEmail()
  to: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  text: string;
}
