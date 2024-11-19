import { Inject, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async sendVerifyToken(email: string, verifyToken: number): Promise<void> {
    const mailOptions = {
      to: email,
      subject: '[Half-time] 이메일 인증',
      template: './verify-email',
      context: {
        verifyToken,
      },
    };

    const result = await this.mailerService.sendMail(mailOptions);
    this.logger.log(
      `info`,
      `[MailService] sent email to ${result.accepted[0]}`,
    );
    return result.accepted[0];
  }
}
