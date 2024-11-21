import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { initializeSwagger } from './swagger.init';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { initializeTransactionalContext } from 'typeorm-transactional';
import * as session from 'express-session';

async function bootstrap() {
  initializeTransactionalContext();
  const envFile = (() => {
    switch (process.env.NODE_ENV) {
      case 'local':
        return '.env.local';
      case 'development':
        return '.env.develop';
      case 'production':
        return '.env.production';
      default:
        throw new Error(
          `Unknown NODE_ENV value: ${process.env.NODE_ENV}. Expected one of: local, develop, production`
        );
    }
  })();
  dotenv.config({ path: envFile });

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  app.useLogger(WinstonModule.createLogger(configService.get('logger')));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 3600000,
      },
    }),
  );

  initializeSwagger(app, configService);

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT).then(() => {
    console.log(`Server is running on ${process.env.PORT}`);
  });
}
bootstrap();
