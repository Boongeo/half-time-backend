import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('swagger', async () => {
  return {
    user: process.env.SWAGGER_USER,
    password: process.env.SWAGGER_PASSWORD,
  };
});
