import { Injectable } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
@Injectable()
export class SendEmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<any> {
    if (!subject) throw new Error('Subject is required');
    if (!to) throw new Error('Recipient is required');
    return await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  }
}
