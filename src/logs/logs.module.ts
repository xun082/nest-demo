import { Module } from '@nestjs/common';
import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { Console } from 'winston/lib/winston/transports';
import { utilities } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { LogEnum } from '../enum/config.enum';

const format = winston.format.combine(
  winston.format.timestamp(),
  utilities.format.nestLike(),
);

const consoleTransports = new Console({
  level: 'info',
  format,
});

function daily(level: 'warn' | 'info'): DailyRotateFile {
  return new DailyRotateFile({
    level,
    dirname: 'logs',
    filename: 'application-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format,
  });
}

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transports: [
            consoleTransports,
            ...(configService.get(LogEnum.LOG_ON)
              ? [daily('info'), daily('warn')]
              : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
  ],
})
export class LogsModule {}
