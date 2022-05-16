import { Controller, Get, Render, Request, Response } from '@nestjs/common';
import { ToolsService } from '../../../service/tools/tools.service';
@Controller('admin/login')
export class LoginController {
  constructor(private toolsService: ToolsService) {}
  @Get()
  @Render('admin/login')
  index() {
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
}
