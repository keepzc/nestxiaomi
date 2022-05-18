import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Request,
  Response,
} from '@nestjs/common';
import { ToolsService } from '../../../service/tools/tools.service';
import { AdminService } from '../../../service/admin/admin.service';

@Controller('admin/login')
export class LoginController {
  constructor(
    private toolsService: ToolsService,
    private adminService: AdminService,
  ) {}
  @Get()
  @Render('admin/login')
  async index() {
    return {};
  }

  @Get('code')
  async getCode(@Request() req, @Response() res) {
    //设置session
    const captcha = await this.toolsService.getCaptcha();
    //服务里面的方法
    req.session.code = captcha.text;
    res.type('image/svg+xml');
    /*指定返回的类型*/
    res.send(captcha.data);
  }

  @Post('doLogin')
  async doLogin(@Body() body, @Request() req, @Response() res) {
    try {
      const code: string = body.code;
      const username: string = body.username;
      let password: string = body.password;
      if (username == '' || password.length < 6) {
        this.toolsService.error(res, '用户名 或者密码不合法', '/admin/login');
      } else {
        console.log(req.session.code, code);
        if (code.toUpperCase() == req.session.code.toUpperCase()) {
          password = this.toolsService.getMd5(password);
          const userResult = await this.adminService.find({
            username: username,
            password: password,
          });
          if (userResult.length > 0) {
            req.session.userinfo = userResult[0];
            this.toolsService.success(res, '登录成功', '/admin/main');
          } else {
            this.toolsService.error(
              res,
              '用户名或者密码不正确',
              '/admin/login',
            );
          }
        } else {
          this.toolsService.error(res, '验证码不正确', '/admin/login');
        }
      }
    } catch (error) {
      console.log(error);
      res.redirect('/admin/login');
    }
  }
  @Get('loginOut')
  loginOut(@Request() req, @Response() res) {
    req.session.userinfo = null;
    res.redirect('/admin/login');
  }
}
