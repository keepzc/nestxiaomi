import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Response,
} from '@nestjs/common';
import { RoleService } from '../../../service/role/role.service';
import { ToolsService } from '../../../service/tools/tools.service';
import { Config } from '../../../config/config';

@Controller(`${Config.adminPath}/role`)
export class RoleController {
  constructor(
    private roleService: RoleService,
    private toolsService: ToolsService,
  ) {}

  @Get()
  @Render('admin/role/index')
  async index() {
    const result = await this.roleService.find({});
    return {
      roleList: result,
    };
  }

  @Get('add')
  @Render('admin/role/add')
  async add() {
    return {};
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    if (body.title != '') {
      //判断角色是否存在
      const roleResult = await this.roleService.find({ title: body.title });
      if (roleResult.length > 0) {
        this.toolsService.error(
          res,
          '该角色已经存在',
          `/${Config.adminPath}/role/add`,
        );
      } else {
        const result = await this.roleService.add(body);
        if (result) {
          this.toolsService.success(
            res,
            '新增角色成功',
            `/${Config.adminPath}/role`,
          );
        } else {
          this.toolsService.error(
            res,
            '新增角色失败',
            `/${Config.adminPath}/role/add`,
          );
        }
      }
    } else {
      this.toolsService.error(
        res,
        '新增角色标题不能为空',
        `/${Config.adminPath}/role/add`,
      );
    }
  }

  @Get('edit')
  @Render('admin/role/edit')
  async edit(@Query() query) {
    const result = await this.roleService.find({ _id: query.id });
    return {
      roleList: result[0],
    };
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    if (body.title != '') {
      const result = await this.roleService.update({ _id: body._id }, body);
      if (result) {
        this.toolsService.success(
          res,
          '编辑角色成功',
          `/${Config.adminPath}/role`,
        );
      } else {
        this.toolsService.error(
          res,
          '编辑角色失败',
          `/${Config.adminPath}/role`,
        );
      }
    } else {
      this.toolsService.error(
        res,
        '编辑角色标题不能为空',
        `/${Config.adminPath}/role`,
      );
    }
  }
  @Get('delete')
  async delete(@Query() query, @Response() res) {
    await this.roleService.delete({ _id: query.id });
    this.toolsService.success(res, '删除成功', `/${Config.adminPath}/role`);
  }
}
