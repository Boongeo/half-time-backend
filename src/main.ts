import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { initializeSwagger } from './swagger.init';

async function bootstrap() {
  const envFile =
    process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
  dotenv.config({ path: envFile });

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  app.useLogger(WinstonModule.createLogger(configService.get('logger')));

  initializeSwagger(app, configService);

  await app.listen(process.env.PORT).then(() => {
    console.log(`Server is running on ${process.env.PORT}`);
  });
}
bootstrap();
