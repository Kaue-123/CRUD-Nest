import { Module } from '@nestjs/common';
import { AuthModule } from 'src/domain/user/modules/auth/auth.module';
import { SendEmailController } from './send-email.controller';
import { SendEmailService } from './send-email.service';
import { BullModule } from '@nestjs/bullmq/dist/bull.module';
import { EmailProcessor } from './email-processor';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
    AuthModule,
    PrometheusModule,
  ],
  controllers: [SendEmailController],
  providers: [
    SendEmailService,
    EmailProcessor,
    makeCounterProvider({
      name: 'emails_sent_total',
      help: 'Total de e-mails enviados',
    }),
  ],
  exports: [SendEmailService],
})
export class SendEmailModule {}
