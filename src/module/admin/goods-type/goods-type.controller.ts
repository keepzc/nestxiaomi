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
import { Config } from '../../../config/config';
@Controller(`${Config.adminPath}/goodsType`)
export class GoodsTypeController {
  constructor(
    private toolsService: ToolsService,
    private goodsTypeService: GoodsTypeService,
  ) {}
  @Get()
  @Render('admin/goodsType/index')
  async index() {
    const result = await this.goodsTypeService.find({});
    return {
      list: result,
    };
  }
  @Get('add')
  @Render('admin/goodsType/add')
  async add() {
    return {};
  }
  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    await this.goodsTypeService.add(body);
    this.toolsService.success(
      res,
      '新增商品成功',
      `/${Config.adminPath}/goodsType`,
    );
  }

  @Get('edit')
  @Render('admin/goodsType/edit')
  async edit(@Query() query) {
    const result = await this.goodsTypeService.find({ _id: query.id });
    return {
      list: result[0],
    };
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    const id = body._id;
    await this.goodsTypeService.update({ _id: id }, body);

    this.toolsService.success(
      res,
      '修改商品成功',
      `/${Config.adminPath}/goodsType`,
    );
  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    const result = await this.goodsTypeService.delete({ _id: query.id });
    this.toolsService.success(
      res,
      '删除商品成功',
      `/${Config.adminPath}/goodsType`,
    );
  }
}
