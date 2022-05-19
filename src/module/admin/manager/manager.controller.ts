import { Body, Controller, Get, Post, Render, Response } from '@nestjs/common';
import { AdminService } from '../../../service/admin/admin.service';
import { RoleService } from '../../../service/role/role.service';
import { ToolsService } from '../../../service/tools/tools.service';
import { Config } from '../../../config/config';

@Controller(`${Config.adminPath}/manager`)
export class ManagerController {
  constructor(
    private adminService: AdminService,
    private roleService: RoleService,
    private toolsService: ToolsService,
  ) {}
  @Get()
  @Render('admin/manager/index')
  async index() {
    //获取 admin表以及role关联数据
    const result = await this.adminService.getModel().aggregate([
      {
        $lookup: {
          from: 'role',
          localField: 'role_id',
          foreignField: '_id',
          as: 'role',
        },
      },
    ]);
    return {
      adminResult: result,
    };
  }

  @Get('add')
  @Render('admin/manager/add')
  async add() {
    const roleResult = await this.roleService.find({});
    return {
      roleList: roleResult,
    };
  }
  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    console.log(body);
    if (body.username == '' || body.password.length < 6) {
      this.toolsService.error(
        res,
        '用户名或者密码长度不合法',
        `/${Config.adminPath}/manager/add`,
      );
    } else {
      //管理员是否存在
      const adminResult = await this.adminService.find({
        username: body.username,
      });
      if (adminResult.length > 0) {
        this.toolsService.error(
          res,
          '该用户已经存在',
          `/${Config.adminPath}/manager/add`,
        );
      } else {
        body.password = this.toolsService.getMd5(body.password);
        await this.adminService.add(body);
        this.toolsService.success(
          res,
          '增加管理员成功',
          `/${Config.adminPath}/manager`,
        );
      }
    }
  }
  @Get('edit')
  @Render('admin/manager/edit')
  edit() {
    return {};
  }
}
