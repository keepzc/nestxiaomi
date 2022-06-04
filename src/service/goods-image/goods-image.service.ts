import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GoodsImageInterface } from '../../interface/goods_image.interface';
@Injectable()
export class GoodsImageService {
  constructor(@InjectModel('GoodsImage') private readonly GoodsImageModel) {}

  async find(json: GoodsImageInterface, fields?: string) {
    try {
      return await this.GoodsImageModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }
  async add(json: GoodsImageInterface) {
    try {
      const goodsImage = new this.GoodsImageModel(json);
      const result = await goodsImage.save();
      return result;
    } catch (error) {
      return null;
    }
  }
  async update(json1: GoodsImageInterface, json2: GoodsImageInterface) {
    try {
      const result = await this.GoodsImageModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }
  async delete(json: GoodsImageInterface) {
    try {
      const result = await this.GoodsImageModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  async deleteMany(json: GoodsImageInterface) {
    try {
      const result = await this.GoodsImageModel.deleteMany(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  getModel() {
    return this.GoodsImageModel;
  }
}
