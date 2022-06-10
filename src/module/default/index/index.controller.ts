import { Controller, Get, Render } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { FocusService } from '../../../service/focus/focus.service';
import { GoodsService } from '../../../service/goods/goods.service';
import { CacheService } from '../../../service/cache/cache.service';
@Controller('')
export class IndexController {
  constructor(
    private focusService: FocusService,
    private goodsService: GoodsService,
    private cacheService: CacheService,
  ) {}
  @Get()
  @Render('default/index/index')
  async index() {
    //轮播图
    let focusResult = await this.cacheService.get('indexFocus');
    if (!focusResult) {
      focusResult = await this.focusService.find(
        {},
        {
          sort: -1,
        },
      );
      this.cacheService.set('indexFocus', focusResult, 60 * 60);
    }

    //获取手机分类下面的子分类
    let phoneResult = await this.cacheService.get('indexPhone');
    if (!phoneResult) {
      phoneResult = await this.goodsService.getCategoryGoods(
        '628f9e83b2ee409d49160e20',
        'hot',
        8,
      );
      this.cacheService.set('indexPhone', phoneResult, 60 * 60);
    }

    //获取tv 分类下子分类 629b77702daaab33f8433baa
    let tvResult = await this.cacheService.get('indexTv');
    if (!tvResult) {
      tvResult = await this.goodsService.getCategoryGoods(
        '629b77702daaab33f8433baa',
        'hot',
        10,
      );
      this.cacheService.set('indexTv', tvResult, 60 * 60);
    }
    return {
      focus: focusResult,
      phone: phoneResult,
    };
  }
}
