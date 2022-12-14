import { Injectable, NestMiddleware } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { NavService } from '../service/nav/nav.service';
import { GoodsService } from '../service/goods/goods.service';
import { CacheService } from '../service/cache/cache.service';
import { GoodsCateService } from '../service/goods-cate/goods-cate.service';
import { CookieService } from '../service/cookie/cookie.service';
import * as url from 'url';
@Injectable()
export class DefaultMiddleware implements NestMiddleware {
  constructor(
    private navService: NavService,
    private goodsCateService: GoodsCateService,
    private goodsService: GoodsService,
    private cacheService: CacheService,
    private cookieService: CookieService,
  ) {}
  async use(req: any, res: any, next: () => void) {
    //保存用户信息
    res.locals.userinfo = this.cookieService.get(req, 'userinfo');
    //用户中心左侧菜单选中
    res.locals.pathname = url.parse(req.url).pathname;
    //顶部导航
    let topNavResult = await this.cacheService.get('indexTopNav');
    if (!topNavResult) {
      topNavResult = await this.navService.find({ position: 1, status: 1 });
      this.cacheService.set('indexTopNav', topNavResult, 60 * 60);
    }
    //商品分类
    let goodsCateResult = await this.cacheService.get('indexGoodsCate');
    if (!goodsCateResult) {
      goodsCateResult = await this.goodsCateService.getModel().aggregate([
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

      this.cacheService.set('indexGoodsCate', goodsCateResult, 60 * 60);
    }
    //获取中间导航数据
    let middleNavResult = await this.cacheService.get('indexMiddleNav');
    if (!middleNavResult) {
      middleNavResult = await this.navService.find({
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
              10,
            );
            //4、扩展以前对象的属性
            middleNavResult[i].subGoods = relationGoodsArr;
          } catch (error) {
            middleNavResult[i].subGoods = [];
          }
        }
      }
      this.cacheService.set('indexMiddleNav', middleNavResult, 60 * 60);
    }
    res.locals.goodsCate = goodsCateResult;
    res.locals.middleNav = middleNavResult;
    res.locals.topNav = topNavResult;
    next();
  }
}
