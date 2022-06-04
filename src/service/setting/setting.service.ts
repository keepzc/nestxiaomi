import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SettingInterface } from '../../interface/setting.interface';
@Injectable()
export class SettingService {
  constructor(@InjectModel('Setting') private readonly settingModel) {}
  async find(json: SettingInterface, fields?: string) {
    try {
      return await this.settingModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }
  async add(json: SettingInterface) {
    try {
      const setting = new this.settingModel(json);
      const result = await setting.save();
      return result;
    } catch (error) {
      return null;
    }
  }
  async update(json1: SettingInterface, json2: SettingInterface) {
    try {
      const result = await this.settingModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }
  async delete(json: SettingInterface) {
    try {
      const result = await this.settingModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  getModel() {
    return this.settingModel;
  }
}
