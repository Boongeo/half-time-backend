import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

export function initializeSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const isDev = configService.get<string>('NODE_ENV') === 'development';

  if (!isDev) return;

  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [configService.get<string>('swagger.user')]: configService.get<string>('swagger.password'),
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Half-Time project')
    .setDescription('Half-Time project API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, customOptions);
}
