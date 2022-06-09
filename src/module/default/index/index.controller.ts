import { Controller, Get, Render } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { NavService } from '../../../service/nav/nav.service';
import { FocusService } from '../../../service/focus/focus.service';
import { GoodsCateService } from '../../../service/goods-cate/goods-cate.service';
import { GoodsService } from '../../../service/goods/goods.service';
@Controller('')
export class IndexController {
  constructor(
    private navService: NavService,
    private focusService: FocusService,
    private goodsCateService: GoodsCateService,
    private goodsService: GoodsService,
  ) {}
  @Get()
  @Render('default/index/index')
  async index() {
    //顶部导航
    const topNavResult = await this.navService.find({ position: 1, status: 1 });
    //轮播图
    const focusResult = await this.focusService.find({});
    //商品分类
    const goodsCateResult = await this.goodsCateService.getModel().aggregate([
      {
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items',
        },
      },
      {
        $match: {
          pid: '0',
          status: 1,
        },
      },
    ]);
    //获取中间导航数据
    let middleNavResult = await this.navService.find({
      position: 2,
      status: 1,
    });
    //middleNavResult 不可改变对象 (坑)  改为可改变对象
    middleNavResult = JSON.parse(JSON.stringify(middleNavResult));
    for (let i = 0; i < middleNavResult.length; i++) {
      if (middleNavResult[i].relation) {
        try {
          //1. relation转化为数组
          const tempArr = middleNavResult[i].relation
            .replace(/，/g, ',')
            .split(',');
          const relationIdsArr = [];
          //2、数组中的_id 转换成 Obejct _id
          tempArr.forEach((value) => {
            relationIdsArr.push(new mongoose.Types.ObjectId(value));
          });
          //3、数据库里面查找 _id 对应的数据
          const relationGoodsArr = await this.goodsService.findIn(
            {
              _id: { $in: relationIdsArr },
            },
            'title goods_img shop_price',
          );
          //4、扩展以前对象的属性
          middleNavResult[i].subGoods = relationGoodsArr;
        } catch (error) {
          middleNavResult[i].subGoods = [];
        }
      }
    }
    //获取手机分类下的子分类
    const subCateResult = await this.goodsService.find({});
    //获取子分类热门商品

    return {
      topNav: topNavResult,
      focus: focusResult,
      goodsCate: goodsCateResult,
      middleNav: middleNavResult,
    };
  }
}
