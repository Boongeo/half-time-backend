import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiredIn: process.env.JWT_EXPIRED_IN,
}));
