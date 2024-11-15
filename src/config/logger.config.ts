import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { registerAs } from '@nestjs/config';

const isDev = process.env.NODE_ENV === 'development';

const loggerFormatter = winston.format.combine(
  winston.format.timestamp(),
  nestWinstonModuleUtilities.format.nestLike('Half-time', {
    colors: true,
    prettyPrint: true,
    appName: true,
  }),
);

const loggerSetting = {
  level: isDev ? 'debug' : 'info',
  format: loggerFormatter,
};

export default registerAs('logger', () => ({
  transports: [new winston.transports.Console(loggerSetting)],
}));
