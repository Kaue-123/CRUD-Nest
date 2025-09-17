import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { BodyEmailDto } from 'src/infra/send-email/dto/body-email.dto';

@Controller('send-email')
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async sendEmail(dto: BodyEmailDto): Promise<any> {
    return this.sendEmailService.sendEmail(dto.to, dto.subject, dto.text);
  }
}
