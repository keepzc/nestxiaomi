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
import { CookieService } from '../../../service/cookie/cookie.service';
import { AddressService } from '../../../service/address/address.service';
import { OrderService } from '../../../service/order/order.service';
import { OrderItemService } from '../../../service/order-item/order-item.service';
import { ToolsService } from '../../../service/tools/tools.service';
@Controller('buy')
export class BuyController {
  constructor(
    private cookieService: CookieService,
    private addressService: AddressService,
    private orderService: OrderService,
    private orderItemService: OrderItemService,
    private toolsService: ToolsService,
  ) {}
  @Get('checkout')
  // @Render('default/buy/checkout')
  async checkout(@Query() query, @Request() req, @Response() res) {
    const orderList = [];
    let allPrice = 0;
    //生成签名防止重复提交订单
    const orderSign = this.toolsService.getMd5(
      this.toolsService.getRandomNum(),
    );
    req.session.orderSign = orderSign;
    const cartList = this.cookieService.get(req, 'cartList');
    if (cartList && cartList.length > 0) {
      for (let i = 0; i < cartList.length; i++) {
        if (cartList[i].checked) {
          orderList.push(cartList[i]);
          allPrice += cartList[i].price * cartList[i].num;
        }
      }
      if (allPrice == 0) {
        res.redirect('/cart');
      } else {
        const uid = this.cookieService.get(req, 'userinfo')._id;
        const addressResult = await this.addressService.find(
          { uid: uid },
          { default_address: -1 },
        );
        await res.render('default/buy/checkout', {
          orderList: orderList,
          allPrice: allPrice,
          addressList: addressResult,
          orderSign: orderSign,
        });
      }
    } else {
      res.redirect('/cart');
    }
  }

  //支付
  @Get('confirm')
  async confirm(@Query() query, @Response() res) {
    const id = query.id;
    const orderResult = await this.orderService.find({ _id: id });
    if (orderResult && orderResult.length > 0) {
      //获取商品
      const orderItemResult = await this.orderItemService.find({
        order_id: id,
      });
      await res.render('default/buy/confirm', {
        orderResult: orderResult[0],
        orderItemResult: orderItemResult,
      });
    } else {
      res.redirect('/');
    }
  }

  //提交订单
  @Post('doOrder')
  async doOrder(@Query() query, @Request() req, @Response() res, @Body() body) {
    /*
      1、获取收货地址信息
      2、获取购买商品的信息
      3、把订单信息放在订单表，把商品信息放在商品表
      4、删除购物车里面的选中数据
    */
    //防止重复提交
    if (body.orderSign != req.session.orderSign) {
      res.redirect('/cart');
      return false;
    }
    req.session.orderSign = null;
    const uid = this.cookieService.get(req, 'userinfo')._id;
    const addressResult = await this.addressService.find({
      uid: uid,
      default_address: 1,
    });
    const cartList = this.cookieService.get(req, 'cartList');
    let all_price = 0;
    if (
      addressResult &&
      addressResult.length > 0 &&
      cartList &&
      cartList.length > 0
    ) {
      const orderList = cartList.filter((item) => {
        if (item.checked) {
          all_price += item.num * item.price;
          return item;
        }
      });
      //执行提交订单
      const order_id = await this.toolsService.getOrderId();
      const name = addressResult[0].name;
      const phone = addressResult[0].phone;
      const address = addressResult[0].address;
      const zipcode = addressResult[0].zipcode;
      const pay_status = 0;
      const pay_type = '';
      const order_status = 0;
      const orderResult = await this.orderService.add({
        uid,
        order_id,
        name,
        phone,
        address,
        zipcode,
        pay_status,
        order_status,
        pay_type,
        all_price,
      });
      if (orderResult && orderResult._id) {
        for (let i = 0; i < orderList.length; i++) {
          const json = {
            uid: uid,
            order_id: orderResult._id, //订单id
            product_title: orderList[i].title,
            product_id: orderList[i]._id,
            product_img: orderList[i].goods_img,
            product_price: orderList[i].price,
            product_num: orderList[i].num,
          };
          await this.orderItemService.add(json);
        }
      } else {
        res.redirect('/buy/checkout');
        return;
      }
      //删除购物车数据
      const unCheckedCartList = cartList.filter((item) => !item.checked);
      this.cookieService.set(res, 'cartList', unCheckedCartList);
      res.redirect('/buy/confirm?id=' + orderResult._id);
    } else {
      //非法请求
      res.redirect('/buy/checkout');
    }
  }
}
