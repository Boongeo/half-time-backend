import { registerAs } from '@nestjs/config';

export default registerAs('server', async () => {
  return {
    port: parseInt(process.env.PORT, 10),
    host: process.env.HOST,
  };
});
