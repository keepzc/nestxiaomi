import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { GoodsInterface } from '../../interface/goods.interface';
import { GoodsCateService } from '../../service/goods-cate/goods-cate.service';
@Injectable()
export class GoodsService {
  constructor(
    @InjectModel('Goods') private readonly goodsModel,
    private goodsCateService: GoodsCateService,
  ) {}
  async find(json: GoodsInterface, skip = 0, limit = 0, fields?: string) {
    //分页查询 算法 db.表名.find().skip((page-1)*pageSize).limit(pageSize)
    try {
      return await this.goodsModel.find(json, fields).skip(skip).limit(limit);
    } catch (error) {
      return [];
    }
  }

  async findIn(json, fields?: string, limit = 10, skip = 0) {
    try {
      return await this.goodsModel.find(json, fields).skip(skip).limit(limit);
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
  /*
    根据商品分类获取推荐商品
    @param {String} cate_id - 分类id
    @param {String} type -  hot  best  new
    @param {Number} limit -  数量
  */
  async getCategoryGoods(cate_id: string, type: string, limit = 8, skip = 0) {
    //1. 获取分类下的子分类
    let cateIdsResult = await this.goodsCateService.find({
      pid: new mongoose.Types.ObjectId(cate_id),
    });
    if (cateIdsResult.length == 0) {
      cateIdsResult = [{ _id: new mongoose.Types.ObjectId(cate_id) }];
    }
    //2.获取子分类的_id放在数组里面
    const tmpArr = [];
    cateIdsResult.forEach((item) => {
      tmpArr.push(item._id);
    });
    //3、查找条件
    let findJson = { cate_id: { $in: tmpArr } };
    //判断类型 合并对象
    switch (type) {
      case 'hot':
        findJson = Object.assign(findJson, { is_hot: 1 });
        break;
      case 'best':
        findJson = Object.assign(findJson, { is_best: 1 });
        break;
      case 'new':
        findJson = Object.assign(findJson, { is_new: 1 });
        break;
      default:
        findJson = Object.assign(findJson, {});
        break;
    }
    //4.获取子分类热门商品
    const goodsArr = await this.findIn(
      findJson,
      'title goods_img shop_price',
      limit,
      skip,
    );
    return goodsArr;
  }
}
