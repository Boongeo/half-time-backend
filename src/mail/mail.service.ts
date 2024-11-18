import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerifyToken(email: string, verifyToken: number) {
    const mailOptions = {
      to: email,
      subject: '[Half-time] 이메일 인증',
      template: './verify-email',
      context: {
        verifyToken,
      },
    };
    return await this.mailerService.sendMail(mailOptions);
  }
}
