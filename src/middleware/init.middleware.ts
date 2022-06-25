import { Injectable, NestMiddleware } from '@nestjs/common';
import { Config } from '../config/config';
import { Helper } from '../extend/helper';

@Injectable()
export class InitMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    res.locals.config = Config;
    res.locals.helper = Helper;
    //中间件里面保存上一页的地址
    req.prevPage = req.headers.referer;

    next();
  }
}
