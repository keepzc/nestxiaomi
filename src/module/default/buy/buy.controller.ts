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
@Controller('buy')
export class BuyController {
  constructor(
    private cookieService: CookieService,
    private addressService: AddressService,
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
}
