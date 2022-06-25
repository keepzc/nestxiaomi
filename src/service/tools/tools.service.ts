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
  async getCaptcha(size?: number, width?: number, height?: number) {
    const captcha = svgCaptcha.create({
      size: size || 2,
      fontSize: 50,
      width: width || 100,
      height: height || 32,
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
  //生成随机数
  getRandomNum() {
    let random_str = '';
    for (let i = 0; i < 4; i++) {
      random_str += Math.floor(Math.random() * 10);
    }
    return random_str;
  }
  //订单如何生成
  getOrderId() {
    const nowTime = this.getTime();
    const randomNum = this.getRandomNum();
    return nowTime.toString() + randomNum.toString();
  }

  //获取年月日
  getDay() {
    const day = format(new Date(), 'YYYYMMDD');
    return day;
  }
  async uploadFile(file): Promise<any> {
    return new Promise((resolve, reject) => {
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
        writeImage.end();
        writeImage.on('finish', () => {
          //4. 返回图片保存地址
          const saveDir = join(
            Config.uploadDir,
            day,
            d + extname(file.originalname),
          );
          resolve({
            saveDir,
            uploadDir,
          });
        });
      } else {
        resolve({
          saveDir: '',
          uploadDir: '',
        });
      }
    });
  }
  jimpImg(target) {
    Jimp.read(target, (err, lenna) => {
      if (err) {
        console.log(err);
      } else {
        for (let i = 0; i < Config.jimpSize.length; i++) {
          lenna
            .resize(Config.jimpSize[i].width, Config.jimpSize[i].height)
            .quality(90) // set JPEG quality
            .write(
              `${target}_${Config.jimpSize[i].width}x${
                Config.jimpSize[i].height
              }${extname(target)}`,
            );
        }
      }
    });
  }
}
