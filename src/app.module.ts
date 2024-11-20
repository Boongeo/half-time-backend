import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import postgresConfig from './config/postgres.config';
import swaggerConfig from './config/swagger.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { MenteeModule } from './mentee/mentee.module';
import { MentorModule } from './mentor/mentor.module';
import { MentorAvailabilityModule } from './mentor-availability/mentor-availability.module';
import { MentorTechStackModule } from './mentor-tech-stack/mentor-tech-stack.module';
import { MentoringSessionModule } from './mentoring-session/mentoring-session.module';
import { TechStackModule } from './tech-stack/tech-stack.module';
import loggerConfig from './config/logger.config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MailModule } from './mail/mail.module';
import mailConfig from './config/mail.config';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorInterceptor } from './common/interceptor/http-error.interceptor';
import jwtConfig from './config/jwt.config';
import { DataSource } from 'typeorm';
import * as console from 'node:console';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { RoleEntitySubscriber } from './subscriber/role-entity.subscriber';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import auth20SecretConfig from './config/auth20-secret.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        postgresConfig,
        swaggerConfig,
        loggerConfig,
        mailConfig,
        jwtConfig,
        auth20SecretConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: undefined,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isDev = configService.get('NODE_ENV') === 'development';
        const obj: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get('postgres.host'),
          port: configService.get('postgres.port'),
          database: configService.get('postgres.database'),
          username: configService.get('postgres.username'),
          password: configService.get('postgres.password'),
          autoLoadEntities: true,
          synchronize: false,
          logging: isDev,
        };
        if (isDev) console.log('Sync postgres with logging enabled');
        return obj;
      },
      async dataSourceFactory(option) {
        if (!option) throw new Error('Invalid options passed');
        return addTransactionalDataSource(new DataSource(option));
      },
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const loggerConfig = configService.get('logger');
        return {
          transports: loggerConfig.transports,
        };
      },
    }),
    CacheModule.register({
      ttl: 600000,
      max: 100,
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    BoardModule,
    MenteeModule,
    MentorModule,
    MentorAvailabilityModule,
    MentorTechStackModule,
    MentoringSessionModule,
    TechStackModule,
    MailModule,
  ],
  controllers: [],
  providers: [
    Logger,
    RoleEntitySubscriber,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpErrorInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
