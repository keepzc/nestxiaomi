import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AdminauthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const pathname = req.baseUrl;
    //1. 获取session里面报错用户信息
    const userinfo = req.session.userinfo;
    if (userinfo && userinfo.username) {
      next();
    } else {
      //排除不需要做权限判断页面
      if (
        pathname == '/admin/login' ||
        pathname == '/admin/login/code' ||
        pathname == '/admin/login/doLogin'
      ) {
        next();
      } else {
        res.redirect('/admin/login');
      }
    }
  }
}
