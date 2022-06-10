import {
  Controller,
  Get,
  Param,
  Query,
  Render,
  Response,
} from '@nestjs/common';
import { GoodsService } from '../../../service/goods/goods.service';
import { CacheService } from '../../../service/cache/cache.service';
import { GoodsCateService } from '../../../service/goods-cate/goods-cate.service';
import * as mongoose from 'mongoose';
@Controller('category')
export class CategoryController {
  constructor(
    private goodsService: GoodsService,
    private cacheService: CacheService,
    private goodsCateService: GoodsCateService,
  ) {}

  @Get(':pid')
  // @Render('default/category/list')
  async index(@Query() query, @Param() params, @Response() res) {
    const pid = params.pid;
    const page = query.page || 1;
    const pageSize = 12;
    const limit = (page - 1) * pageSize;
    const cateResult = await this.goodsService.getCategoryGoods(
      pid,
      '',
      pageSize,
      limit,
    );
    // 1、获取当前分类
    let subCateResult;
    const currentCateResult = await this.goodsCateService.find({ _id: pid });
    console.log(currentCateResult[0]);
    if (currentCateResult[0].pid == '0') {
      //1. 获取它下面子分类
      subCateResult = await this.goodsCateService.find({
        pid: new mongoose.Types.ObjectId(pid),
      });
    } else {
      //2.获取顶级分类
      //3. 在获取顶级分类下的子分类
      subCateResult = await this.goodsCateService.find({
        pid: new mongoose.Types.ObjectId(currentCateResult[0].pid),
      });
    }
    //指定模板渲染
    const tpl = currentCateResult[0].template
      ? currentCateResult[0].template
      : 'default/category/list';
    res.render(tpl, {
      goodsList: cateResult,
      subCate: subCateResult,
      currentCate: currentCateResult[0],
    });
  }
}
