import { Controller, Get, Request, Response, Post } from '@nestjs/common';
import { WechatPay } from '../../../extend/wechatPay';
import * as qr from 'qr-image';
@Controller('wxpay')
export class WxpayController {
  @Get('')
  async index(@Request() req, @Response() res) {
    const config = {
      mch_id: '',
      wxappid: '',
      wxpaykey: '',
    };
    const pay = new WechatPay(config);

    pay.createOrder(
      {
        openid: '',
        notify_url: 'http://pay.apiying.com/wxpay/notify', //微信支付完成后的回调
        out_trade_no: new Date().getTime(), //订单号
        attach: '微信购买信息名称222',
        body: '微信购买信息名称222',
        total_fee: '3', // 此处的额度为分
        spbill_create_ip: req.connection.remoteAddress.replace(/::ffff:/, ''),
      },
      function (error, responseData) {
        console.log(responseData);
        if (error) {
          console.log(error);
        }
        //生成二维码
        const codeImg = qr.imageSync(responseData.code_url, { type: 'png' });
        res.status(200);
        res.type('image/png');
        res.send(codeImg);
      },
    );
  }
  //支付成功异步通知
  @Post('notify')
  async weixinNotify(@Request() req) {
    /*
    注意：
        1、域名必须备案 
        2、微信商户平台 产品中心->Native 支付->产品设置->扫码支付 扫码回调链接 必须配置
     */
    const config = {
      mch_id: '',
      wxappid: '',
      wxpaykey: '',
    };
    const pay = new WechatPay(config);
    const notifyObj = req.body.xml;
    const signObj = {};
    for (const attr in notifyObj) {
      if (attr != 'sign') {
        signObj[attr] = notifyObj[attr][0];
      }
    }
    console.log(pay.getSign(signObj));
    console.log('--------------------------');
    console.log(req.body.xml.sign[0]);
    console.log(notifyObj);
  }
}
