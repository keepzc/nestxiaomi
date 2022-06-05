import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Response,
  Request,
} from '@nestjs/common';
import { ToolsService } from '../../../service/tools/tools.service';
import { NavService } from '../../../service/nav/nav.service';
import { Config } from '../../../config/config';
@Controller(`${Config.adminPath}/nav`)
export class NavController {
  constructor(
    private toolsService: ToolsService,
    private navService: NavService,
  ) {}
  @Get()
  @Render('admin/nav/index')
  async index(@Query() query) {
    const currentPage = query.page || 1;
    const pageSize = 15;
    const skip = (currentPage - 1) * pageSize;
    const sort = { add_time: -1 };
    const result = await this.navService.find({}, skip, sort, pageSize);
    const count = await this.navService.count({});
    const totalPages = Math.ceil(count / pageSize);
    return {
      list: result,
      currentPage: currentPage,
      totalPages: totalPages,
    };
  }

  @Get('add')
  @Render('admin/nav/add')
  add() {
    return {};
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    const result = await this.navService.add(body);
    if (body.title != '') {
      if (result) {
        this.toolsService.success(
          res,
          '新增导航成功',
          `/${Config.adminPath}/nav`,
        );
      } else {
        this.toolsService.error(
          res,
          '新增导航失败',
          `/${Config.adminPath}/nav`,
        );
      }
    } else {
      this.toolsService.error(
        res,
        '导航标题不能为空',
        `/${Config.adminPath}/nav`,
      );
    }
  }
  @Get('edit')
  @Render('admin/nav/edit')
  async edit(@Request() req, @Query() query) {
    const result = await this.navService.find({ _id: query.id });
    return {
      list: result[0],
      prevPage: req.prevPage, //从中间件 获取前一页路由
    };
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    const id = body._id;
    const prevPage = body.prevPage || `/${Config.adminPath}/nav`;
    if (body.title != '') {
      const result = await this.navService.update({ _id: id }, body);
      if (result) {
        this.toolsService.success(res, '修改成功', prevPage);
      } else {
        this.toolsService.error(res, '修改失败', prevPage);
      }
    } else {
      this.toolsService.error(res, '导航标题不能为空', prevPage);
    }
  }
  @Get('delete')
  async delete(@Request() req, @Query() query, @Response() res) {
    const result = await this.navService.delete({ _id: query.id });
    //保证删除返回删除页面
    const prevPage = req.prevPage || `/${Config.adminPath}/nav`;
    this.toolsService.success(res, '删除成功', prevPage);
  }
}
