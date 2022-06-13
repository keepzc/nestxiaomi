import { Controller, Get, Param, Query, Render } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { GoodsService } from '../../../service/goods/goods.service';
import { CacheService } from '../../../service/cache/cache.service';
import { GoodsColorService } from '../../../service/goods-color/goods-color.service';
import { GoodsImageService } from '../../../service/goods-image/goods-image.service';
import { GoodsAttrService } from '../../../service/goods-attr/goods-attr.service';
@Controller('product')
export class ProductController {
  constructor(
    private goodsService: GoodsService,
    private cacheService: CacheService,
    private goodsColorService: GoodsColorService,
    private goodsImageService: GoodsImageService,
    private goodsAttrService: GoodsAttrService,
  ) {}

  @Get('getImagelist')
  async getImagelist(@Query() query) {
    try {
      const color_id = query.color_id;
      const goods_id = query.goods_id;

      let goodsImageResult = await this.goodsImageService.find({
        goods_id,
        color_id: new mongoose.Types.ObjectId(color_id),
      });

      if (goodsImageResult.length == 0) {
        goodsImageResult = await this.goodsImageService.find({
          goods_id: goods_id,
        });
      }
      return {
        success: true,
        result: goodsImageResult,
      };
    } catch (error) {
      return {
        success: false,
        result: [],
      };
    }
  }

  @Get(':id')
  @Render('default/product/info')
  async index(@Param() params) {
    //1. 商品详情
    const goods_id = params.id;
    const goodsInfo = await this.goodsService.find({ _id: goods_id });
    //2. 获取关联商品
    const relationGoodsIds = this.goodsService.strToArray(
      goodsInfo[0].relation_goods,
    );
    const relationGoods = await this.goodsService.findIn(
      {
        _id: { $in: relationGoodsIds },
      },
      'goods_version shop_price',
    );
    //3. 关联赠品
    const goodsGiftIds = this.goodsService.strToArray(goodsInfo[0].goods_gift);
    const goodsGift = await this.goodsService.findIn(
      {
        _id: { $in: goodsGiftIds },
      },
      'goods_img title',
    );
    //4. 关联颜色
    const goodsColorIds = this.goodsService.strToArray(
      goodsInfo[0].goods_color,
    );
    const goodsColor = await this.goodsColorService.find({
      _id: { $in: goodsColorIds },
    });
    //5. 获取关联配件
    const goodsFittingIds = this.goodsService.strToArray(
      goodsInfo[0].goods_fitting,
    );
    const goodsFitting = await this.goodsService.findIn(
      {
        _id: { $in: goodsFittingIds },
      },
      'goods_img title',
    );
    //6、获取商品关联的图片

    const goodsImage = await this.goodsImageService.find({
      goods_id: goods_id,
    });

    //7、获取规格参数信息

    const goodsAttr = await this.goodsAttrService.find({ goods_id: goods_id });
    return {
      goodsInfo: goodsInfo[0],
      relationGoods: relationGoods,
      goodsFitting: goodsFitting,
      goodsGift: goodsGift,
      goodsColor: goodsColor,
      goodsImage: goodsImage,
      goodsAttr: goodsAttr,
    };
  }
}
