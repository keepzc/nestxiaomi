import { Controller, Get, Response, Request, Post } from '@nestjs/common';
//alipay-mobile安装指定版本 "2.2.7"
import * as Alipay from 'alipay-mobile';
@Controller('alipay')
export class AlipayController {
  @Get()
  async index(@Response() res) {
    const alipayOptions = {
      //Appid
      app_id: '',
      //应用私钥->  工具生成的
      appPrivKeyFile: '',
      //支付宝公钥->  用工具生成的应用公钥换取的支付公钥
      alipayPubKeyFile: '',
    };
    const service = new Alipay(alipayOptions);
    const randStr = Math.floor(Math.random() * 1000);
    const data = {
      subject: 'nest小米支付测试',
      out_trade_no: '123456' + randStr, //订单号
      total_amount: '0.2',
    };
    const basicParams = {
      return_url: 'http://localhost:3000/alipay/alipayReturn', //返回地址
      notify_url: 'http://pay.apiying.com/alipay/alipayNotify', //支付成功异步通知地址
    };
    const result = await service.createPageOrderURL(data, basicParams);

    console.log(result);
    res.redirect(result.data);
  }

  @Get('alipayReturn')
  async order() {
    return '执行 alipayReturn 跳转到订单页面';
  }
  @Post('alipayNotify')
  async alipayNotify(@Request() req) {
    const params = req.body; //接收 支付宝post 提交的 XML
    const alipayOptions = {
      //Appid
      app_id: '',
      //应用私钥->  工具生成的
      appPrivKeyFile: '',
      //支付宝公钥->  用工具生成的应用公钥换取的支付公钥
      alipayPubKeyFile: '',
    };
    //实例化 alipay
    const service = new Alipay(alipayOptions);
    const result = await service.makeNotifyResponse(params);
    console.log(result);

    //验证结果是否正确 如果正确执行更新订单操作
  }
}
