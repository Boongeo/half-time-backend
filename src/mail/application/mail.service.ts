import { Inject, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @Inject('NODEMAILER_TRANSPORTER')
    private readonly transporter: nodemailer.Transporter,
  ) {}

  async sendVerifyToken(email: string, verifyToken: number): Promise<void> {
    try {
      // 템플릿 파일 경로 설정
      const templatePath = path.join(__dirname, './templates/verify-email.hbs');
      const templateSource = fs.readFileSync(templatePath, 'utf-8');

      // Handlebars 템플릿 컴파일
      const template = handlebars.compile(templateSource);

      // 템플릿에 데이터를 바인딩
      const htmlContent = template({ verifyToken });

      // 이메일 옵션 설정
      const mailOptions = {
        from: '"Half-time" <no-reply@yourapp.com>',
        to: email,
        subject: '[Half-time] 이메일 인증',
        html: htmlContent,
      };

      // 이메일 전송
      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Sent email to ${result.accepted[0]}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }
}
