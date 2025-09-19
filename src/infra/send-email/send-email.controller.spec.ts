import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailController } from './send-email.controller';

describe('SendEmailController', () => {
  let controller: SendEmailController;

  let emailQueueMock: { add: jest.Mock };
  beforeEach(async () => {
    emailQueueMock = { add: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendEmailController],
      providers: [{ provide: 'BullQueue_email', useValue: emailQueueMock }],
    }).compile();

    controller = module.get<SendEmailController>(SendEmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should enqueue an email job and return success', async () => {
    const emailDto = {
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Body',
    };
    emailQueueMock.add.mockResolvedValueOnce({});
    // mock getJobCounts
    controller['emailQueue'].getJobCounts = jest
      .fn()
      .mockResolvedValueOnce({ waiting: 1 });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await controller.sendEmail(emailDto);
    expect(emailQueueMock.add).toHaveBeenCalledWith('send-email', emailDto);
    expect(result).toEqual({ status: 'Entrou para a fila' });
  });

  it('should handle error when email does not enter the queue', async () => {
    const emailDto = {
      to: 'fail@example.com',
      subject: 'Fail Subject',
      text: 'Fail Body',
    };
    emailQueueMock.add.mockRejectedValueOnce(new Error('Queue error'));
    controller['emailQueue'].getJobCounts = jest.fn();
    await expect(controller.sendEmail(emailDto)).rejects.toThrow(
      'Error sending email: Queue error',
    );
  });
});
