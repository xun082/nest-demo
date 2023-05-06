import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class TypeOrmFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const code = exception.status;

    response.status(code).json({
      code,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
