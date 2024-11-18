import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import postgresConfig from './config/postgres.config';
import swaggerConfig from './config/swagger.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { BoardModule } from './board/board.module';
import { MenteeModule } from './mentee/mentee.module';
import { MentorModule } from './mentor/mentor.module';
import { MentorAvailabilityModule } from './mentor-availability/mentor-availability.module';
import { MentorTechStackModule } from './mentor-tech-stack/mentor-tech-stack.module';
import { MentoringSessionModule } from './mentoring-session/mentoring-session.module';
import { TechStackModule } from './tech-stack/tech-stack.module';
import loggerConfig from './config/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig, swaggerConfig, loggerConfig],
    }),
    TypeOrmModule.forRootAsync({
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
          autoLoadEntities: false,
          synchronize: false,
          logging: isDev,
        };
        if (isDev) console.log('Sync postgres with logging enabled');
        return obj;
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
    UserModule,
    AccountModule,
    BoardModule,
    MenteeModule,
    MentorModule,
    MentorAvailabilityModule,
    MentorTechStackModule,
    MentoringSessionModule,
    TechStackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
