import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer';
import { configureTemplateEngine } from './util/template-engine';

@Injectable()
export class MailService {
  private transporter: Mail;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('mail.service'),
      auth: {
        user: this.configService.get<string>('mail.user'),
        pass: this.configService.get<string>('mail.password'),
      },
    });
    this.transporter.use('compile', configureTemplateEngine());
  }

  async sendVerifyToken(email: string, verifyToken: number) {
    const mailOptions = {
      to: email,
      subject: '[Half-time] 이메일 인증',
      template: 'verify-email',
      context: {
        verifyToken,
      },
    };
    return await this.transporter.sendMail(mailOptions);
  }
}
