import { Controller, Get, Query, Request, Render } from '@nestjs/common';
import { Config } from '../../../config/config';
import { AccessService } from '../../../service/access/access.service';
import { RoleAccessService } from '../../../service/role-access/role-access.service';
import { FocusService } from '../../../service/focus/focus.service';
@Controller(`${Config.adminPath}/main`)
export class MainController {
  constructor(
    private accessService: AccessService,
    private roleAccessService: RoleAccessService,
    private focusService: FocusService,
  ) {}

  @Get()
  @Render('admin/main/index')
  async index(@Request() req) {
    //1. 在access中找出 module_id =0的数据
    //2. 让access和access表自关联 条件找出access表中module_id等于_id 的数据
    const userinfo = req.session.userinfo;
    const role_id = userinfo.role_id;
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
      asideList: result,
    };
  }

  @Get('welcome')
  @Render('admin/main/welcome')
  welcome() {
    return {};
  }
  @Get('changeStatus')
  async changeStatus(@Query() query) {
    //1. 获取要修改数据id
    //2. 查询当前数据状态
    //3. 修改状态1-->0
    const id = query.id;
    let json;
    const model = query.model + 'Service'; //要操作的service
    const fields = query.fields; //要修改的字段 status
    const result = await this[model].find({ _id: id });
    if (result.length > 0) {
      const tmpFields = result[0][fields];
      tmpFields == 1 ? (json = { [fields]: 0 }) : (json = { [fields]: 1 });
      await this[model].update({ _id: id }, json);
      return {
        success: true,
        message: '修改成功',
      };
    } else {
      return {
        success: false,
        message: '传入参数错误',
      };
    }
  }
}
