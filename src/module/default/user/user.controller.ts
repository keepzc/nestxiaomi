import { Controller, Get, Render, Request } from '@nestjs/common';
import { OrderService } from '../../../service/order/order.service';
import { CookieService } from '../../../service/cookie/cookie.service';
import * as mongoose from 'mongoose';

@Controller('user')
export class UserController {
  constructor(
    private orderService: OrderService,
    private cookieService: CookieService,
  ) {}
  @Get('welcome')
  @Render('default/user/welcome')
  index() {
    return {};
  }
  @Get('order')
  @Render('default/user/order')
  async order(@Request() req) {
    const uid = this.cookieService.get(req, 'userinfo')._id;
    const page = req.query.page || 1;
    const pageSize = 2;
    //查询当前用户下面的所有订单
    const json = { uid: new mongoose.Types.ObjectId(uid) };
    // 总数量
    const totalNum = await this.orderService.count(json);
    //聚合管道要注意顺序
    const result = await this.orderService.getModel().aggregate([
      {
        $lookup: {
          from: 'order_item',
          localField: '_id',
          foreignField: 'order_id',
          as: 'orderItems',
        },
      },
      {
        $sort: { add_time: -1 },
      },
      {
        $match: json, //条件
      },
      {
        $skip: (page - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
    ]);
    return {
      list: result,
      totalPages: Math.ceil(totalNum / pageSize),
      page,
    };
  }

  @Get('orderinfo')
  @Render('default/user/orderinfo')
  orderInfo() {
    return {};
  }
}
