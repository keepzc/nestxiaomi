import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdminInterface } from '../../interface/admin.interface';
@Injectable()
export class AdminService {
  constructor(@InjectModel('Admin') private readonly adminModel) {}

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
}
