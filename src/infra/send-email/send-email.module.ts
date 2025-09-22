import { Module } from '@nestjs/common';
import { AuthModule } from 'src/domain/user/modules/auth/auth.module';
import { SendEmailController } from './send-email.controller';
import { SendEmailService } from './send-email.service';
import { BullModule } from '@nestjs/bullmq/dist/bull.module';
import { EmailProcessor } from './email-processor';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
    AuthModule,
  ],
  controllers: [SendEmailController],
  providers: [SendEmailService, EmailProcessor],
  exports: [SendEmailService],
})
export class SendEmailModule {}
