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
    res.send('获取订单信息-去支付');
  }

  //提交订单
  @Post('doOrder')
  async doOrder(@Query() query, @Request() req, @Response() res) {
    /*
      1、获取收货地址信息
      2、获取购买商品的信息
      3、把订单信息放在订单表，把商品信息放在商品表
      4、删除购物车里面的选中数据
    */
  }
}
