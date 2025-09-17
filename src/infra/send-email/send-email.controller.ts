import { Controller } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { BodyEmailDto } from 'src/domain/maker/dto/body-email.dto';

@Controller('send-email')
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  async sendEmail(dto: BodyEmailDto): Promise<any> {
    return this.sendEmailService.sendEmail(dto.to, dto.subject, dto.text);
  }
}
