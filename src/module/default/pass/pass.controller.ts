import {
  Controller,
  Request,
  Render,
  Get,
  Response,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { ToolsService } from '../../../service/tools/tools.service';
import { UserService } from '../../../service/user/user.service';
import { UserTempService } from '../../../service/user-temp/user-temp.service';
import { CookieService } from '../../../service/cookie/cookie.service';
@Controller('pass')
export class PassController {
  constructor(
    private toolsService: ToolsService,
    private userService: UserService,
    private userTempService: UserTempService,
    private cookieService: CookieService,
  ) {}
  @Get('code')
  async getCode(@Query() query, @Request() req, @Response() res) {
    const width = query.width || 135;
    const height = query.height || 50;
    const svgCaptcha = await this.toolsService.getCaptcha(3, width, height);
    //设置session
    console.log(svgCaptcha.text);
    req.session.identify_code = svgCaptcha.text;
    res.type('image/svg+xml');
    res.send(svgCaptcha.data);
  }
  //登录页面
  @Get('login')
  @Render('default/pass/login')
  login() {
    return {};
  }
  //退出登录
  @Get('loginOut')
  loginOut(@Response() res) {
    this.cookieService.set(res, 'userinfo', '');
    res.redirect('/');
  }
  //执行登录
  @Post('doLogin')
  async doLogin(@Body() body, @Response() res, @Request() req) {
    const username = body.username;
    let password = body.password;
    const identify_code = body.identify_code;
    if (req.session.identify_code != identify_code) {
      //后端生成验证码
      const svgCaptcha = await this.toolsService.getCaptcha(3, 100, 40);
      req.session.identify_code = svgCaptcha.text;
      res.send({
        success: false,
        msg: '输入的图形验证码不正确',
      });
    } else {
      password = this.toolsService.getMd5(password);
      const userInfo = await this.userService.find(
        {
          phone: username,
          password: password,
        },
        '_id phone last_ip add_time email status',
      );
      if (userInfo && userInfo.length > 0) {
        this.cookieService.set(res, 'userinfo', userInfo[0]);
        res.send({
          success: true,
          msg: '登录成功',
        });
      } else {
        const svgCaptcha = await this.toolsService.getCaptcha(3, 100, 40);
        req.session.identify_code = svgCaptcha.text;
        res.send({
          success: false,
          msg: '用户名或者密码不正确',
        });
      }
    }
  }
  @Get('registerStep1')
  @Render('default/pass/register_step1')
  register1() {
    return {};
  }

  @Get('registerStep2')
  // @Render('default/pass/register_step2')
  async register2(@Query() query, @Response() res) {
    const sign = query.sign;
    const identify_code = query.identify_code;
    const userTempResult = await this.userTempService.find({ sign: sign });
    if (userTempResult.length > 0) {
      await res.render('default/pass/register_step2', {
        phone: userTempResult[0].phone,
        identify_code,
        sign,
      });
    } else {
      res.redirect('/pass/register_step1');
    }
  }

  @Get('registerStep3')
  // @Render('default/pass/register_step3')
  async register3(@Query() query, @Response() res, @Request() req) {
    const sign = query.sign;
    const phone_code = query.phone_code;
    //1. 判断手机收到验证码是否相同
    if (req.session.phone_code != phone_code) {
      res.redirect('/pass/registerStep1');
      return;
    }
    //2、验证传过来的参数是否正确
    const userTempResult = await this.userTempService.find({ sign: sign });
    if (userTempResult && userTempResult.length > 0) {
      await res.render('default/pass/register_step3', {
        phone: userTempResult[0].phone,
        phone_code: phone_code,
        sign: sign,
      });
    } else {
      res.redirect('/pass/registerStep1');
    }
  }

  @Get('sendCode')
  async sendCode(@Query() query, @Request() req) {
    const phone = query.phone;
    const identify_code = query.identify_code;
    //1. 验证图形验证码是否合法
    if (req.session.identify_code != identify_code) {
      return {
        success: false,
        msg: '输入图形验证码不存在',
      };
    }
    //2. 判断手机号是否合法
    const reg = /^[\d]{11}$/;
    if (!reg.test(phone)) {
      return {
        success: false,
        msg: '手机号输入错误',
      };
    }
    //3. 验证手机号是否注册过
    const userResult = await this.userService.find({ phone: phone });
    if (userResult && userResult.length > 0) {
      return {
        success: false,
        msg: '此用户已存在',
      };
    }
    //4. 手机发送验证码次数
    const add_day = await this.toolsService.getDay(); //年月日
    const sign = await this.toolsService.getMd5(phone + add_day); //签名
    const ip = req.ip.replace(/::ffff:/, ''); //获取客户端ip
    const phone_code = await this.toolsService.getRandomNum(); //发送短信的随机码
    const userTempResult = await this.userTempService.find({
      phone: phone,
      sign: sign,
      add_day: add_day,
    });
    const ipCount = await this.userTempService.count({
      ip: ip,
      add_day: add_day,
    });
    if (userTempResult && userTempResult.length > 0) {
      if (ipCount > 10) {
        return {
          success: false,
          msg: '发送失败',
          sign: sign,
        };
      }
      if (userTempResult[0].send_count < 4) {
        const send_count = userTempResult[0].send_count + 1;
        const nowTime = await this.toolsService.getTime();
        await this.userTempService.update(
          { phone: phone, sign: sign, add_day: add_day },
          { send_count: send_count, add_time: nowTime },
        );
        // 发送验证码 保存验证
        req.session.phone_code = phone_code;
        console.log(phone_code);
        return {
          success: true,
          msg: '短信发送成功',
          sign: sign,
        };
      } else {
        return {
          success: false,
          msg: '当前手机号发送短信的次数太多了',
          sign: sign,
        };
      }
    } else {
      //发送验证码
      req.session.phone_code = phone_code;
      console.log(phone_code);
      this.userTempService.add({
        phone,
        add_day,
        sign,
        ip,
        send_count: 1,
      });
      return {
        success: true,
        msg: '短信发送成功',
        sign: sign,
      };
    }
  }
  //验证验证码
  @Get('validatePhoneCode')
  async validatePhoneCode(@Query() query, @Request() req) {
    const sign = query.sign;
    const phone_code = query.phone_code;
    const add_day = await this.toolsService.getDay(); //年月日
    //1、验证数据是否合法
    const userTempResult = await this.userTempService.find({
      sign: sign,
      add_day: add_day,
    });
    if (userTempResult.length == 0) {
      return {
        success: false,
        msg: '参数错误',
      };
    }

    //2、验证验证码是否正确
    if (req.session.phone_code != phone_code) {
      return {
        success: false,
        msg: '输入的验证码错误',
      };
    }
    //3、判断验证码有没有过期
    const nowTime = await this.toolsService.getTime();
    if ((nowTime - userTempResult[0].add_time) / 1000 / 60 > 15) {
      return {
        success: false,
        msg: '验证码已经过期',
      };
    }
    return {
      success: true,
      msg: '验证码输入正确',
      sign: sign,
      phone_code: phone_code,
    };
  }
  @Post('doRegister')
  async doRegister(@Body() body, @Response() res, @Request() req) {
    const sign = body.sign;
    const phone_code = body.phone_code;
    const password = body.password;
    const ip = req.ip.replace(/::ffff:/, '');
    //1、判断手机收到的验证码是否正确
    if (req.session.phone_code != phone_code) {
      res.redirect('/pass/registerStep1');
      return;
    }
    //2. 获取sign对应的手机信息
    const userTempResult = await this.userTempService.find({ sign: sign });
    if (userTempResult.length > 0) {
      const userResult = await this.userService.add({
        phone: userTempResult[0].phone,
        password: this.toolsService.getMd5(password),
        last_ip: ip,
      });
      //执行登录
      if (userResult) {
        const userInfo = await this.userService.find(
          {
            phone: userTempResult[0].phone,
          },
          '_id phone last_ip add_time email status',
        );
        this.cookieService.set(res, 'userinfo', userInfo[0]);
        res.redirect('/');
      }
    } else {
      res.redirect('/pass/registerStep1');
    }
  }
}
