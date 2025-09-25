import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailService } from './send-email.service';

describe('SendEmailService', () => {
  let service: SendEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendEmailService,
        {
          provide: 'PROM_METRIC_EMAILS_SENT_TOTAL',
          useValue: { inc: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<SendEmailService>(SendEmailService);
  });

  it('should send an email successfully', async () => {
    const mockSendMail = jest
      .fn()
      .mockResolvedValue({ accepted: ['test@example.com'] });
    service['transporter'].sendMail = mockSendMail;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await service.sendEmail(
      'test@example.com',
      'Subject',
      'Body',
    );
    expect(result).toEqual({ accepted: ['test@example.com'] });
  });

  it('should throw error if subject is missing', async () => {
    await expect(
      service.sendEmail('test@example.com', '', 'Body'),
    ).rejects.toThrow('Subject is required');
  });

  it('should throw error if recipient is missing', async () => {
    await expect(service.sendEmail('', 'Subject', 'Body')).rejects.toThrow(
      'Recipient is required',
    );
  });
});
