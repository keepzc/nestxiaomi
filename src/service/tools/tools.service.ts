import { Injectable } from '@nestjs/common';

import * as svgCaptcha from 'svg-captcha';
import * as md5 from 'md5';
@Injectable()
export class ToolsService {
  async getCaptcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 32,
      background: '#cc9966',
    });
    return captcha;
  }
  getMd5(str: string) {
    return md5(str);
  }
  async success(res, message, redirectUrl) {
    await res.render('admin/public/success', {
      message,
      redirectUrl,
    });
  }
  async error(res, message, redirectUrl) {
    await res.render('admin/public/error', {
      message,
      redirectUrl,
    });
  }
}
