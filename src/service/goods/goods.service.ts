import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GoodsInterface } from '../../interface/goods.interface';
@Injectable()
export class GoodsService {
  constructor(@InjectModel('Goods') private readonly goodsModel) {}
  async find(json: GoodsInterface, skip = 0, limit = 0, fields?: string) {
    //分页查询 算法 db.表名.find().skip((page-1)*pageSize).limit(pageSize)
    try {
      return await this.goodsModel.find(json, fields).skip(skip).limit(limit);
    } catch (error) {
      return [];
    }
  }

  async findIn(json, fields?: string) {
    try {
      return await this.goodsModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }
  async count(json: GoodsInterface) {
    try {
      return await this.goodsModel.find(json).count();
    } catch (error) {
      return 0;
    }
  }
  async add(json: GoodsInterface) {
    try {
      const goods = new this.goodsModel(json);
      const result = await goods.save();
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async update(json1: GoodsInterface, json2: GoodsInterface) {
    try {
      const result = await this.goodsModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }
  async delete(json: GoodsInterface) {
    try {
      const result = await this.goodsModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  async deleteMany(json: GoodsInterface) {
    try {
      const result = await this.goodsModel.deleteMany(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  getModel() {
    return this.goodsModel;
  }
}
