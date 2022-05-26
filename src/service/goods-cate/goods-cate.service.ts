import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GoodsCateInterface } from '../../interface/goods_cate_interface';
@Injectable()
export class GoodsCateService {
  constructor(@InjectModel('GoodsCate') private readonly goodsCateModel) {}

  async find(json: GoodsCateInterface, fields?: string) {
    try {
      return await this.goodsCateModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }
  async add(json: GoodsCateInterface) {
    try {
      const goodsCate = new this.goodsCateModel(json);
      const result = await goodsCate.save();
      return result;
    } catch (error) {
      return null;
    }
  }
  async update(json1: GoodsCateInterface, json2: GoodsCateInterface) {
    try {
      const result = await this.goodsCateModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }
  async delete(json: GoodsCateInterface) {
    try {
      const result = await this.goodsCateModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  getModel() {
    return this.goodsCateModel;
  }
}
