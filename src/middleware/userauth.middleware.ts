import { Injectable, NestMiddleware } from '@nestjs/common';
import { CookieService } from '../service/cookie/cookie.service';
import { UserService } from '../service/user/user.service';
@Injectable()
export class UserauthMiddleware implements NestMiddleware {
  constructor(
    private cookieService: CookieService,
    private userService: UserService,
  ) {}
  async use(req: any, res: any, next: () => void) {
    //1. 从cookie获取用户信息
    const userinfo = this.cookieService.get(req, 'userinfo');
    if (userinfo && userinfo.phone) {
      //2. 从用户表查询这个用户
      const userResult = await this.userService.find({
        _id: userinfo._id,
        phone: userinfo.phone,
      });
      if (userResult && userResult.length > 0) {
        await next();
        return;
      }
      //跳转
      res.redirect('/pass/login');
      return;
    }
    //跳转登录
    res.redirect('/pass/login');
  }
}
