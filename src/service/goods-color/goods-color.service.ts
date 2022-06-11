import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GoodsColorInterface } from '../../interface/goods_color.interface';
@Injectable()
export class GoodsColorService {
  constructor(@InjectModel('GoodsColor') private readonly goodsColorModel) {}
  async find(json, fields?: string) {
    try {
      return await this.goodsColorModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }
  async findIn(json, fields?: string, limit = 10, skip = 0) {
    try {
      return await this.goodsColorModel
        .find(json, fields)
        .skip(skip)
        .limit(limit);
    } catch (error) {
      return [];
    }
  }
  async add(json: GoodsColorInterface) {
    try {
      const goodsColor = new this.goodsColorModel(json);
      const result = await goodsColor.save();
      return result;
    } catch (error) {
      return null;
    }
  }
  async update(json1: GoodsColorInterface, json2: GoodsColorInterface) {
    try {
      const result = await this.goodsColorModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }
  async delete(json: GoodsColorInterface) {
    try {
      const result = await this.goodsColorModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  getModel() {
    return this.goodsColorModel;
  }
}
