import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionFilter } from './filters/exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.enableCors();
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // app.setGlobalPrefix("api/v1")

  const httpAdapter = app.get(HttpAdapterHost);
  const logger = new Logger();

  app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));

  // 全局拦截器
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
