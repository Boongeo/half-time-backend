import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  service: process.env.MAIL_SERVICE,
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  from: '"Half-time" <no-reply@gmail.com>',
}));
