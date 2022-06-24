import {
  Request,
  Controller,
  Render,
  Get,
  Response,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { AddressService } from '../../../service/address/address.service';
import { CookieService } from '../../../service/cookie/cookie.service';
@Controller('user/address')
export class AddressController {
  constructor(
    private addressService: AddressService,
    private cookieService: CookieService,
  ) {}
  @Post('addAddress')
  async addAddress(@Body() body, @Request() req) {
    /*
      1、获取表单提交的数据
      2、更新当前用户的所有收货地址的默认收货地址状态为0
      3、增加当前收货地址，让默认收货地址状态是1
      4、查询当前用户的所有收货地址返回    
    */
    const uid = this.cookieService.get(req, 'userinfo')._id;
    const name = body.name;
    const phone = body.phone;
    const address = body.address;
    const zipcode = body.zipcode;
    const addressCount = await this.addressService.count({ uid });
    if (addressCount > 20) {
      return {
        success: false,
        result: '增加收货地址失败 收货地址数量超过限制',
      };
    } else {
      await this.addressService.updateMany(
        { uid: uid },
        { default_address: 0 },
      );
      await this.addressService.add({ uid, name, phone, address, zipcode }); //Schema里面配置的default_address=1，所以增加完成后就显示了默认收货地址
      const addressResult = await this.addressService.find(
        { uid: uid },
        { default_address: -1 },
      );
      return {
        success: true,
        result: addressResult,
        msg: '新增收货地址成功',
      };
    }
  }
  // 获取一个收货地址  返回指定收货地址id的收货地址
  @Get('getOneAddressList')
  async getOneAddressList(@Query() query, @Request() req) {
    const id = query.id;
    const addressResult = await this.addressService.find({ _id: id });
    return {
      success: true,
      result: addressResult[0],
    };
  }
  // 编辑收货地址
  @Post('doEditAddressList')
  async doEditAddressList(@Body() body, @Request() req) {
    /*
      1、获取表单增加的数据
      2、更新当前用户的所有收货地址的默认收货地址状态为0
      3、修改当前收货地址，让默认收货地址状态是1
      4、查询当前用户的所有收货地址并返回
    */
    const uid = this.cookieService.get(req, 'userinfo')._id;
    const id = body.id;
    const name = body.name;
    const phone = body.phone;
    const address = body.address;
    const zipcode = body.zipcode;
    await this.addressService.updateMany({ uid: uid }, { default_address: 0 });
    await this.addressService.update(
      { _id: id, uid: uid },
      {
        name,
        phone,
        address,
        zipcode,
        default_address: 1,
      },
    );
    const addressResult = await this.addressService.find(
      { uid: uid },
      { default_address: -1 },
    );
    return {
      success: true,
      result: addressResult,
      msg: '修改收货地址成功',
    };
  }
  // 修改默认的收货地址
  @Get('changeDefaultAddress')
  async changeDefaultAddress(@Query() query, @Request() req) {
    /*    
      1、获取当前用户收货地址id 以及用户id
      2、更新当前用户的所有收货地址的默认收货地址状态为0
       3、更新当前收货地址的默认收货地址状态为1
    */
    const id = query.id;
    const uid = this.cookieService.get(req, 'userinfo')._id;
    await this.addressService.updateMany({ uid: uid }, { default_address: 0 });
    await this.addressService.update(
      { uid: uid, _id: id },
      { default_address: 1 },
    );
    return {
      success: true,
      msg: '更新默认收货地址成功',
    };
  }
}
