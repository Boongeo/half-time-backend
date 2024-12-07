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
import * as express from 'express';
import { join } from 'path';
import passport from 'passport';
import { Role } from './user/enums/role.enum';

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
          `Unknown NODE_ENV value: ${process.env.NODE_ENV}. Expected one of: local, develop, production`,
        );
    }
  })();
  dotenv.config({ path: envFile });

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.use(
    '/sensitive-uploads',
    (req, res, next) => {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user || !user.roles.includes(Role.ADMIN)) {
          return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
        }
        req.user = user;
        next();
      })(req, res, next);
    },
    express.static(join(__dirname, '..', 'sensitive-uploads')),
  );

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

  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'),
    credentials: true, // 쿠키를 포함한 요청 허용
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // 허용할 HTTP 메서드
  });

  initializeSwagger(app, configService);

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT).then(() => {
    console.log(`Server is running on ${process.env.PORT}`);
  });
}
bootstrap();
