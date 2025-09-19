import { Processor, WorkerHost } from '@nestjs/bullmq';
import { SendEmailService } from './send-email.service';
import { Job } from 'bullmq';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly sendEmailService: SendEmailService) {
    super();
  }

  async process(
    job: Job<{ to: string; subject: string; text: string }>,
  ): Promise<void> {
    const { to, subject, text } = job.data;
    await this.sendEmailService.sendEmail(to, subject, text);
  }
}
