import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdminInterface } from '../../interface/admin.interface';
import { RoleAccessService } from '../../service/role-access/role-access.service';
import { AccessService } from '../../service/access/access.service';
import { Config } from '../../config/config';
@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private readonly adminModel,
    private roleAccessService: RoleAccessService,
    private accessService: AccessService,
  ) {}

  async find(json: AdminInterface, fields?: string) {
    try {
      return await this.adminModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }
  async add(json: AdminInterface) {
    try {
      const role = new this.adminModel(json);
      const result = await role.save();
      return result;
    } catch (error) {
      return null;
    }
  }
  async update(json1: AdminInterface, json2: AdminInterface) {
    try {
      const result = await this.adminModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }
  async delete(json: AdminInterface) {
    try {
      const result = await this.adminModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  getModel() {
    return this.adminModel;
  }

  async checkAuth(req) {
    //1.  获取当前用户的角色
    const userinfo = req.session.userinfo;
    const role_id = userinfo.role_id;
    const pathname: string = req.baseUrl.replace(`/${Config.adminPath}/`, '');
    if (
      userinfo.is_super == 1 ||
      pathname == 'login/loginOut' ||
      pathname == 'main/welcome' ||
      pathname == 'main' ||
      pathname == 'login' ||
      pathname == 'login/doLogin'
    ) {
      //超级管理员有所有权限
      return true;
    }
    //2. 根据角色获取当前角色的权限列表
    const accessResult = await this.roleAccessService.find({
      role_id,
    });
    const roleAccessArr = [];
    accessResult.forEach((value) => {
      roleAccessArr.push(value.access_id.toString());
    });
    //3. 获取当前url 对应的权限_id
    const authResult = await this.accessService.find({ url: pathname });
    if (authResult.length > 0) {
      //4. 判断当前访问url的权限_id， 是否在权限列表中
      if (roleAccessArr.indexOf(authResult[0]._id.toString()) != -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
