import { Injectable, NestMiddleware } from '@nestjs/common';
import { Config } from '../config/config';
import { Helper } from '../extend/helper';
import { CookieService } from '../service/cookie/cookie.service';
@Injectable()
export class InitMiddleware implements NestMiddleware {
  constructor(private cookieService: CookieService) {}
  use(req: any, res: any, next: () => void) {
    res.locals.config = Config;
    res.locals.helper = Helper;
    //中间件里面保存上一页的地址
    req.prevPage = req.headers.referer;
    //保存用户信息
    res.locals.userinfo = this.cookieService.get(req, 'userinfo');
    next();
  }
}
