import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NavInterface } from '../../interface/nav.interface';
@Injectable()
export class NavService {
  constructor(@InjectModel('Nav') private readonly navModel) {}
  async find(json: NavInterface, skip = 0, limit = 0, fields?: string) {
    //分页查询 算法 db.表名.find().skip((page-1)*pageSize).limit(pageSize)
    try {
      return await this.navModel.find(json, fields).skip(skip).limit(limit);
    } catch (error) {
      return [];
    }
  }
  async count(json: NavInterface) {
    try {
      return await this.navModel.find(json).count();
    } catch (error) {
      return 0;
    }
  }
  async add(json: NavInterface) {
    try {
      const nav = new this.navModel(json);
      const result = await nav.save();
      return result;
    } catch (error) {
      return null;
    }
  }
  async update(json1: NavInterface, json2: NavInterface) {
    try {
      const result = await this.navModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }
  async delete(json: NavInterface) {
    try {
      const result = await this.navModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  getModel() {
    return this.navModel;
  }
}
