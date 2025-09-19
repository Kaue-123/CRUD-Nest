import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { BodyEmailDto } from 'src/infra/send-email/dto/body-email.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('send-email')
export class SendEmailController {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async sendEmail(@Body() dto: BodyEmailDto): Promise<any> {
    try {
      await this.emailQueue.add('send-email', dto);
      const counts = await this.emailQueue.getJobCounts();
      console.log('Job counts:', counts);
      return { status: 'Entrou para a fila' };
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
