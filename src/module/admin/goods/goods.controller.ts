import {
  Controller,
  Body,
  Get,
  Post,
  Query,
  Render,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ToolsService } from '../../../service/tools/tools.service';
import { GoodsService } from '../../../service/goods/goods.service';
import { GoodsCateService } from '../../../service/goods-cate/goods-cate.service';
import { GoodsColorService } from '../../../service/goods-color/goods-color.service';
import { GoodsTypeService } from '../../../service/goods-type/goods-type.service';
import { GoodsTypeAttributeService } from '../../../service/goods-type-attribute/goods-type-attribute.service';
import { GoodsAttrService } from '../../../service/goods-attr/goods-attr.service';
import { GoodsImageService } from '../../../service/goods-image/goods-image.service';
import { Config } from '../../../config/config';
@Controller(`${Config.adminPath}/goods`)
export class GoodsController {
  constructor(
    private toolsService: ToolsService,
    private goodsService: GoodsService,
    private goodsCateService: GoodsCateService,
    private goodsTypeService: GoodsTypeService,
    private goodsColorService: GoodsColorService,
    private goodsTypeAttributeService: GoodsTypeAttributeService,
    private goodsAttrService: GoodsAttrService,
    private goodsImageService: GoodsImageService,
  ) {}

  @Get()
  @Render('admin/goods/index')
  async index() {
    const result = await this.goodsService.find({});
    return {
      goodsList: result,
    };
  }

  @Get('add')
  @Render('admin/goods/add')
  async add() {
    //1. 获取商品分类
    const goodscateRes = await this.goodsCateService.getModel().aggregate([
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
        },
      },
    ]);
    //2. 获取所有颜色
    const goodsColorsRes = await this.goodsColorService.find({});
    //3. 获取商品类型
    const goodsTypeRes = await this.goodsTypeService.find({});
    return {
      goodsCate: goodscateRes,
      goodsColor: goodsColorsRes,
      goodsType: goodsTypeRes,
    };
  }
  //富文本编辑器上传 图库上传
  @Post('doImageUpload')
  @UseInterceptors(FileInterceptor('file'))
  async doImageUpload(@UploadedFile() file) {
    const { saveDir, uploadDir } = this.toolsService.uploadFile(file);
    //缩略图
    if (uploadDir) {
      this.toolsService.jimpImg(uploadDir);
    }
    return {
      link: '/' + saveDir,
    };
  }
  //获取商品类型属性
  @Get('getGoodsTypeAttribute')
  async getGoodsTypeAttribute(@Query() query) {
    const cate_id = query.cate_id;
    const goodsTypeAttrResult = await this.goodsTypeAttributeService.find({
      cate_id: cate_id,
    });
    return {
      result: goodsTypeAttrResult,
    };
  }
  //执行增加
  @Post('doAdd')
  @UseInterceptors(FileInterceptor('goods_img'))
  async doAdd(@UploadedFile() file, @Body() body) {
    console.log(body);
    const { saveDir } = this.toolsService.uploadFile(file);
    // return {
    //   link: '/' + saveDir,
    // };
    console.log(saveDir);
    return body;
  }
}
