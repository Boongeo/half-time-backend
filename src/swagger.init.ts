import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as basicAuth from 'express-basic-auth';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function initializeSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const isDev =
    configService.get<string>('NODE_ENV') === 'development' ||
    configService.get<string>('NODE_ENV') === 'local';

  if (!isDev) return;

  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [configService.get<string>('swagger.user')]:
          configService.get<string>('swagger.password'),
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

  // Swagger에서 `@Public` 데코레이터가 붙은 엔드포인트의 인증 제외 처리
  Object.keys(document.paths).forEach((path) => {
    const methods = document.paths[path];
    Object.keys(methods).forEach((method) => {
      const operation = methods[method];

      // Swagger의 `operation` 객체에서 `@Public`을 구분할 수 있는 방식으로 체크
      if (operation.tags?.includes('Public')) {
        delete operation.security; // 인증 제외 처리
      }
    });
  });

  SwaggerModule.setup('docs', app, document, customOptions);
}
