import { IsEmail, IsNotEmpty } from 'class-validator';

export class BodyEmailDto {
  @IsEmail({}, { message: 'Formato de e-mail inválido' })
  @IsNotEmpty({ message: 'Destinatário é obrigatório' })
  to: string;

  @IsNotEmpty({ message: 'Assunto do e-mail é obrigatório' })
  subject: string;

  text: string;
}
