import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Roleinterface } from '../../interface/role.interface';
@Injectable()
export class RoleService {
  constructor(@InjectModel('Role') private roleModel) {}

  async find(json: Roleinterface, fields?: string) {
    try {
      return await this.roleModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }
  async add(json: Roleinterface) {
    try {
      const role = new this.roleModel(json);
      const result = await role.save();
      return result;
    } catch (error) {
      return null;
    }
  }
  async update(json1: Roleinterface, json2: Roleinterface) {
    try {
      const result = await this.roleModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }
  async delete(json: Roleinterface) {
    try {
      const result = await this.roleModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
}
