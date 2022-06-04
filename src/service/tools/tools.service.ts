import { Injectable } from '@nestjs/common';
import { format } from 'silly-datetime';
import * as svgCaptcha from 'svg-captcha';
import * as md5 from 'md5';
import * as mkdirp from 'mkdirp';
import { createWriteStream } from 'fs';
import { join, extname } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Jimp = require('jimp');
import { Config } from '../../config/config';
@Injectable()
export class ToolsService {
  async getCaptcha() {
    const captcha = svgCaptcha.create({
      size: 2,
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
  getTime() {
    const d = new Date();
    return d.getTime();
  }
  uploadFile(file) {
    if (file) {
      //1. 获取当前日期 年月日
      const day = format(new Date(), 'YYYYMMDD'); //目录名称
      const d = this.getTime();
      //2. 根据日期创建目录
      const dir = join(__dirname, `../../../public/${Config.uploadDir}`, day);
      mkdirp.sync(dir);
      const uploadDir = join(dir, d + extname(file.originalname));
      //3. 实现上传
      const writeImage = createWriteStream(uploadDir);
      writeImage.write(file.buffer);
      //4. 返回图片保存地址
      const saveDir = join(
        Config.uploadDir,
        day,
        d + extname(file.originalname),
      );
      return {
        saveDir,
        uploadDir,
      };
    } else {
      return {
        saveDir: '',
        uploadDir: '',
      };
    }
  }
  jimpImg(target) {
    Jimp.read(target, (err, lenna) => {
      if (err) {
        console.log(err);
      } else {
        lenna
          .resize(200, 200) // resize
          .quality(90) // set JPEG quality
          // .greyscale() // set greyscale
          .write(target + '_200x200' + extname(target)); // save
      }
    });
    Jimp.read(target, (err, lenna) => {
      if (err) {
        console.log(err);
      } else {
        lenna
          .resize(100, 100) // resize
          .quality(90) // set JPEG quality
          // .greyscale() // set greyscale
          .write(target + '_100x100' + extname(target)); // save
      }
    });
  }
}
