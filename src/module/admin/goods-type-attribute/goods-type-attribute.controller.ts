import {
  Controller,
  Body,
  Get,
  Post,
  Query,
  Render,
  Response,
} from '@nestjs/common';
import { GoodsTypeService } from '../../../service/goods-type/goods-type.service';
import { ToolsService } from '../../../service/tools/tools.service';
import { GoodsTypeAttributeService } from '../../../service/goods-type-attribute/goods-type-attribute.service';
import { Config } from '../../../config/config';
@Controller(`${Config.adminPath}/goodsTypeAttribute`)
export class GoodsTypeAttributeController {
  constructor(
    private toolsService: ToolsService,
    private goodsTypeService: GoodsTypeService,
    private goodsTypeAttributeService: GoodsTypeAttributeService,
  ) {}

  @Get()
  @Render('admin/goodsTypeAttribute/index')
  async index(@Query() query) {
    const id = query.id;
    const result = await this.goodsTypeService.find({ _id: id });
    const goodsTypeAttrResult = await this.goodsTypeAttributeService.find({
      cate_id: id,
    });
    return {
      goodsType: result[0],
      list: goodsTypeAttrResult,
    };
  }
  @Get('add')
  @Render('admin/goodsTypeAttribute/add')
  async add(@Query() query) {
    //商品类型 id
    const id = query.id;
    //获取所有的商品类型
    const goodsTypeResult = await this.goodsTypeService.find({});
    return {
      goodsTypes: goodsTypeResult,
      cate_id: id,
    };
  }
  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    console.log(body, '00');
    const result = await this.goodsTypeAttributeService.add(body);
    if (result) {
      this.toolsService.success(
        res,
        '新增属性成功',
        `/${Config.adminPath}/goodsTypeAttribute?id=${body.cate_id}`,
      );
    } else {
      this.toolsService.error(
        res,
        '新增属性失败',
        `/${Config.adminPath}/goodsTypeAttribute?id=${body.cate_id}`,
      );
    }
  }
  @Get('edit')
  @Render('admin/goodsTypeAttribute/edit')
  async edit(@Query() query) {
    //属性 id
    const id = query.id;
    //获取要修改的数据
    const goodsTypeAttributeResult = await this.goodsTypeAttributeService.find({
      _id: id,
    });

    //获取所有的商品类型
    const goodsTypeResult = await this.goodsTypeService.find({});

    return {
      goodsTypes: goodsTypeResult,
      goodsTypeAttribute: goodsTypeAttributeResult[0],
    };
  }
  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    const id = body._id;

    body.attr_type != 3 ? (body.attr_value = '') : '';

    const result = await this.goodsTypeAttributeService.update(
      { _id: id },
      body,
    );
    if (result) {
      this.toolsService.success(
        res,
        '修改属性成功',
        `/${Config.adminPath}/goodsTypeAttribute?id=${body.cate_id}`,
      );
    } else {
      this.toolsService.error(
        res,
        '修改属性失败',
        `/${Config.adminPath}/goodsTypeAttribute?id=${body.cate_id}`,
      );
    }
  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    const result = await this.goodsTypeAttributeService.delete({
      _id: query.id,
    });
    this.toolsService.success(
      res,
      '删除属性成功',
      `/${Config.adminPath}/goodsTypeAttribute?id=${query.cate_id}`,
    );
  }
}
