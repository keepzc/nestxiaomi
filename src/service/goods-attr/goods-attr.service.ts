import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GoodsAttrInterface } from '../../interface/goods_attr.interface';
@Injectable()
export class GoodsAttrService {
  constructor(@InjectModel('GoodsAttr') private readonly GoodsAttrModel) {}

  async find(json: GoodsAttrInterface, fields?: string) {
    try {
      return await this.GoodsAttrModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }
  async add(json: GoodsAttrInterface) {
    try {
      const goodsAttr = new this.GoodsAttrModel(json);
      const result = await goodsAttr.save();
      return result;
    } catch (error) {
      return null;
    }
  }
  async update(json1: GoodsAttrInterface, json2: GoodsAttrInterface) {
    try {
      const result = await this.GoodsAttrModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }
  async delete(json: GoodsAttrInterface) {
    try {
      const result = await this.GoodsAttrModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  async deleteMany(json: GoodsAttrInterface) {
    try {
      const result = await this.GoodsAttrModel.deleteMany(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  getModel() {
    return this.GoodsAttrModel;
  }
}
