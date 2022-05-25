import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GoodsTypeAttributeInterface } from '../../interface/goods_type_attribute.interface';
@Injectable()
export class GoodsTypeAttributeService {
  constructor(
    @InjectModel('GoodsTypeAttribute') private readonly goodsTypeAttributeModel,
  ) {}

  async find(json: GoodsTypeAttributeInterface = {}, fields?: string) {
    try {
      return await this.goodsTypeAttributeModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }

  async add(json: GoodsTypeAttributeInterface) {
    try {
      const admin = new this.goodsTypeAttributeModel(json);
      const result = await admin.save();
      return result;
    } catch (error) {
      return null;
    }
  }
  async update(
    json1: GoodsTypeAttributeInterface,
    json2: GoodsTypeAttributeInterface,
  ) {
    try {
      const result = await this.goodsTypeAttributeModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: GoodsTypeAttributeInterface) {
    try {
      const result = await this.goodsTypeAttributeModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  getModel() {
    return this.goodsTypeAttributeModel;
  }
}
