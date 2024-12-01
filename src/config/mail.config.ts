import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  service: process.env.MAIL_SERVICE || 'gmail',
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT, 10) || 587,
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  from: `"Half-time" <${process.env.MAIL_USER}>`,
}));
