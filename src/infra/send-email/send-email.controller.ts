import {
    Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { BodyEmailDto } from 'src/infra/send-email/dto/body-email.dto';

@Controller('send-email')
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async sendEmail(@Body() dto: BodyEmailDto): Promise<any> {
    try {
      await this.sendEmailService.sendEmail(dto.to, dto.subject, dto.text);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('Error sending email: ' + errorMessage);
      throw new InternalServerErrorException(
        'Error sending email: ' + errorMessage,
      );
    }
  }
}
