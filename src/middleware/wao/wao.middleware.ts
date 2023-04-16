import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class WaoMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.send('<h1>你小子我忍你好久了,不给你访问</h1>');
  }
}
