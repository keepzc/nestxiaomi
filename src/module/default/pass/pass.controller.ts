import { Controller, Request, Render, Get, Response } from '@nestjs/common';
import { ToolsService } from '../../../service/tools/tools.service';
import { UserService } from '../../../service/user/user.service';
import { UserTempService } from '../../../service/user-temp/user-temp.service';
@Controller('pass')
export class PassController {
  constructor(
    private toolsService: ToolsService,
    private userService: UserService,
    private userTempService: UserTempService,
  ) {}
  @Get('code')
  getCode(@Request() req, @Response() res) {
    // const svgCaptcha = this.toolsService.getCaptcha(5, 100, 52);
    // //设置session
    // req.session.identify_code = svgCaptcha.text;
    // res.type('image/svg+xml');
    // res.send(svgCaptcha.data);
  }

  @Get('login')
  @Render('default/pass/login')
  login() {
    return {};
  }

  @Get('registerStep1')
  @Render('default/pass/register_step1')
  register1() {
    return {};
  }

  @Get('registerStep2')
  @Render('default/pass/register_step2')
  register2() {
    return {};
  }

  @Get('registerStep3')
  @Render('default/pass/register_step3')
  register3() {
    return {};
  }
}
