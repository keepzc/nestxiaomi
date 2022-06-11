import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserTempInterface } from '../../interface/user_temp.interface';

@Injectable()
export class UserTempService {
  constructor(@InjectModel('UserTemp') private readonly userTempModel) {}

  async find(json: UserTempInterface = {}, fields?: string) {
    try {
      return await this.userTempModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }
  async count(json: UserTempInterface = {}) {
    try {
      return await this.userTempModel.find(json).count();
    } catch (error) {
      return [];
    }
  }

  async add(json: UserTempInterface) {
    try {
      const userTemp = new this.userTempModel(json);
      const result = await userTemp.save();
      return result;
    } catch (error) {
      return null;
    }
  }

  async update(json1: UserTempInterface, json2: UserTempInterface) {
    try {
      const result = await this.userTempModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: UserTempInterface) {
    try {
      const result = await this.userTempModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }

  getModel() {
    return this.userTempModel;
  }
}
