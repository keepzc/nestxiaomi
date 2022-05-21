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
import { AccessService } from '../../../service/access/access.service';
import { RoleAccessService } from '../../../service/role-access/role-access.service';
import { Config } from '../../../config/config';

@Controller(`${Config.adminPath}/role`)
export class RoleController {
  constructor(
    private roleService: RoleService,
    private toolsService: ToolsService,
    private accessService: AccessService,
    private roleAccessService: RoleAccessService,
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
  @Get('auth')
  @Render('admin/role/auth')
  async auth(@Query() query) {
    //1. 在access中找出 module_id =0的数据
    //2. 让access和access表自关联 条件找出access表中module_id等于_id 的数据
    const role_id = query.id;
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
    //2. 查询当前角色拥有的权限（查询当前角色权限id）把差扫数据放到数组中
    const accessResult = await this.roleAccessService.find({
      role_id: role_id,
    });
    const roleAccessArr = [];
    accessResult.forEach((value) => {
      roleAccessArr.push(value.access_id.toString());
    });
    //3. 循环遍历所有的权限数据， 判断当前权限是否在角色数组中，如果是的话在当前数据加checked属性
    for (let i = 0; i < result.length; i++) {
      if (roleAccessArr.indexOf(result[i]._id.toString()) != -1) {
        result[i].checked = true;
      }
      for (let j = 0; j < result[i].items.length; j++) {
        if (roleAccessArr.indexOf(result[i].items[j]._id.toString()) != -1) {
          result[i].items[j].checked = true;
        }
      }
    }
    return {
      role_id,
      list: result,
    };
  }
  //授权接口
  @Post('doAuth')
  async doAuth(@Body() body, @Response() res) {
    const role_id = body.role_id;
    const access_node = body.access_node;
    //1. 删除当前角色下面所有权限
    await this.roleAccessService.deleteMany({ role_id: role_id });
    //2. 给role_access增加数据， 把获取的权限和角色新增到数据库
    for (let i = 0; i < access_node.length; i++) {
      await this.roleAccessService.add({
        role_id,
        access_id: access_node[i],
      });
    }
    console.log(role_id);
    this.toolsService.success(
      res,
      '授权成功',
      `/${Config.adminPath}/role/auth?id=${role_id}`,
    );
  }
}
