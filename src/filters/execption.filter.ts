import {
  ExceptionFilter,
  HttpException,
  HttpStatus,
  LoggerService,
  ArgumentsHost,
  Catch,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';       
import * as requestIp from 'request-ip';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage: string = '';
    if (exception instanceof QueryFailedError) {
      errorMessage = exception.message;
    }

    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      // 还可以加入一些用户信息
      // IP信息
      ip: requestIp.getClientIp(request),
      exception: exception['name'],
      error: errorMessage,
    };

    this.logger.error('[message]', responseBody);
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
