import {
  Controller,
  Body,
  Get,
  Post,
  Query,
  Render,
  Response,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { AccessService } from '../../../service/access/access.service';
import { ToolsService } from '../../../service/tools/tools.service';
import { Config } from '../../../config/config';
@Controller(`${Config.adminPath}/access`)
export class AccessController {
  constructor(
    private accessService: AccessService,
    private toolsService: ToolsService,
  ) {}
  @Get()
  @Render('admin/access/index')
  async index() {
    //1. 在access中找出 module_id =0的数据
    //2. 让access和access表自关联 条件找出access表中module_id等于_id 的数据
    const result = await this.accessService.getModel().aggregate([
      {
        $lookup: {
          from: 'access',
          localField: '_id',
          foreignField: 'module_id',
          as: 'items',
        },
      },
      {
        $match: {
          module_id: '0',
        },
      },
    ]);
    return {
      list: result,
    };
  }
  @Get('add')
  @Render('admin/access/add')
  async add() {
    //获取模块列表
    const result = await this.accessService.find({ module_id: '0' });
    return { moduleList: result };
  }
  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    const module_id = body.module_id;
    if (module_id != 0) {
      body.module_id = new mongoose.Types.ObjectId(module_id);
    }
    const result = await this.accessService.add(body);
    if (result) {
      this.toolsService.success(
        res,
        '新增模块成功',
        `/${Config.adminPath}/access`,
      );
    }
  }
  @Get('edit')
  @Render('admin/access/edit')
  async edit(@Query() query) {
    //获取模块列表
    const result = await this.accessService.find({ module_id: '0' });
    const accessResult = await this.accessService.find({ _id: query.id });
    return {
      list: accessResult[0],
      moduleList: result,
    };
  }
  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    const module_id = body.module_id;
    const id = body._id;
    try {
      if (module_id != 0) {
        body.module_id = new mongoose.Types.ObjectId(module_id);
      }
      const result = await this.accessService.update({ _id: id }, body);
      if (result) {
        this.toolsService.success(
          res,
          '新增模块成功',
          `/${Config.adminPath}/access`,
        );
      }
    } catch (error) {
      this.toolsService.error(
        res,
        '非法请求',
        `/${Config.adminPath}/access/edit?id=${id}`,
      );
    }
  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    try {
      await this.accessService.delete({ _id: query.id });
      this.toolsService.success(res, '删除成功', `/${Config.adminPath}/access`);
    } catch (error) {
      this.toolsService.error(res, '删除失败', `/${Config.adminPath}/access`);
    }
  }
}
