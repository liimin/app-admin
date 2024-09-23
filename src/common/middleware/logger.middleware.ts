import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const { method, path , url,params,query } = req;
    Logger.debug(`method -> ${method} url -> ${url} params -> ${JSON.stringify(params)} query -> ${JSON.stringify(query)}`);
    next();
  }
}
