import {
  Controller,
  Body,
  Get,
  Post,
  Query,
  Render,
  Request,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ToolsService } from '../../../service/tools/tools.service';
import { GoodsService } from '../../../service/goods/goods.service';
import { GoodsCateService } from '../../../service/goods-cate/goods-cate.service';
import { GoodsColorService } from '../../../service/goods-color/goods-color.service';
import { GoodsTypeService } from '../../../service/goods-type/goods-type.service';
import { GoodsTypeAttributeService } from '../../../service/goods-type-attribute/goods-type-attribute.service';
import { GoodsAttrService } from '../../../service/goods-attr/goods-attr.service';
import { GoodsImageService } from '../../../service/goods-image/goods-image.service';
import { Config } from '../../../config/config';
import * as mongoose from 'mongoose';
@Controller(`${Config.adminPath}/goods`)
export class GoodsController {
  constructor(
    private toolsService: ToolsService,
    private goodsService: GoodsService,
    private goodsCateService: GoodsCateService,
    private goodsTypeService: GoodsTypeService,
    private goodsColorService: GoodsColorService,
    private goodsTypeAttributeService: GoodsTypeAttributeService,
    private goodsAttrService: GoodsAttrService,
    private goodsImageService: GoodsImageService,
  ) {}

  @Get()
  @Render('admin/goods/index')
  async index(@Query() query) {
    //分页 搜索商品数据
    const keyword = query.keyword;
    //查询 条件
    let json = {};
    if (keyword) {
      json = Object.assign(json, { title: { $regex: new RegExp(keyword) } });
    }
    //多个查询条件继续写
    // if (cateName) {
    //   json = Object.assign(json, {
    //     cate_name: { $regex: new RegExp(cateName) },
    //   });
    // }
    const currentPage = query.page || 1;
    const pageSize = 15;
    const skip = (currentPage - 1) * pageSize;
    const goodsResult = await this.goodsService.find(json, skip, pageSize);
    const count = await this.goodsService.count(json);
    //totalPages
    const totalPages = Math.ceil(count / pageSize);
    return {
      goodsList: goodsResult,
      currentPage: currentPage,
      totalPages: totalPages,
      keyword: keyword,
    };
  }

  @Get('add')
  @Render('admin/goods/add')
  async add() {
    //1. 获取商品分类
    const goodsCateRes = await this.goodsCateService.getModel().aggregate([
      {
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items',
        },
      },
      {
        $match: {
          pid: '0',
        },
      },
    ]);
    //2. 获取所有颜色
    const goodsColorsRes = await this.goodsColorService.find({});
    //3. 获取商品类型
    const goodsTypeRes = await this.goodsTypeService.find({});
    return {
      goodsCate: goodsCateRes,
      goodsColor: goodsColorsRes,
      goodsType: goodsTypeRes,
    };
  }
  //富文本编辑器上传 图库上传
  @Post('doImageUpload')
  @UseInterceptors(FileInterceptor('file'))
  async doUpload(@UploadedFile() file) {
    const { saveDir, uploadDir } = await this.toolsService.uploadFile(file);
    //缩略图
    if (uploadDir) {
      this.toolsService.jimpImg(uploadDir);
    }
    return { link: '/' + saveDir };
  }
  //获取商品类型属性
  @Get('getGoodsTypeAttribute')
  async getGoodsTypeAttribute(@Query() query) {
    const cate_id = query.cate_id;
    const goodsTypeAttrResult = await this.goodsTypeAttributeService.find({
      cate_id: cate_id,
    });
    return {
      result: goodsTypeAttrResult,
    };
  }
  //执行增加
  @Post('doAdd')
  @UseInterceptors(FileInterceptor('goods_img'))
  async doAdd(@UploadedFile() file, @Body() body, @Response() res) {
    const { saveDir, uploadDir } = await this.toolsService.uploadFile(file);
    //生成缩略图
    if (uploadDir) {
      this.toolsService.jimpImg(uploadDir);
    }
    //1、增加商品数据
    if (body.goods_color && typeof body.goods_color !== 'string') {
      body.goods_color = body.goods_color.join(',');
    }
    const result = await this.goodsService.add(
      Object.assign(body, {
        goods_img: saveDir,
      }),
    );
    //2.增加图库数据
    const goods_image_list = body.goods_image_list;
    if (
      result._id &&
      goods_image_list &&
      typeof goods_image_list !== 'string'
    ) {
      for (let i = 0; i < goods_image_list.length; i++) {
        await this.goodsImageService.add({
          goods_id: result._id,
          img_url: goods_image_list[i],
        });
      }
    }
    //3. 增加商品属性
    const attr_id_list = body.attr_id_list;
    const attr_value_list = body.attr_value_list;
    if (result._id && attr_id_list && typeof attr_id_list !== 'string') {
      for (let i = 0; i < attr_id_list.length; i++) {
        //获取当前商品类型id对应商品类型属性
        const goodsTypeAttrResult = await this.goodsTypeAttributeService.find({
          _id: attr_id_list[i],
        });
        //把获取到值保存到goods_attr表中
        await this.goodsAttrService.add({
          goods_id: result._id,
          goods_cate_id: result.goods_cate_id,
          attribute_id: attr_id_list[i],
          attribute_type: goodsTypeAttrResult[0].attr_type,
          attribute_title: goodsTypeAttrResult[0].title,
          attribute_value: attr_value_list[i],
        });
      }
    }
    this.toolsService.success(
      res,
      '新增商品成功',
      `/${Config.adminPath}/goods`,
    );
  }
  @Get('edit')
  @Render('admin/goods/edit')
  async edit(@Query() query, @Request() req) {
    /*
        1、获取商品数据

        2、获取商品分类

        3、获取所有颜色 以及选中的颜色

        4、商品的图库信息

        5、获取商品类型

        6、获取规格信息
      */
    //0. 获取上一页地址 req.prevPage

    //1、获取商品数据
    const goodsResult = await this.goodsService.find({ _id: query.id });

    //2、获取商品分类
    const goodsCateResult = await this.goodsCateService.getModel().aggregate([
      {
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items',
        },
      },
      {
        $match: {
          pid: '0',
        },
      },
    ]);
    //3. 获取所有颜色 以及选中的颜色
    let goodsColorResult = await this.goodsColorService.find({});
    //goodsColorResult 不可改变对象 可以通过序列反序列化来改变
    goodsColorResult = JSON.parse(JSON.stringify(goodsColorResult));
    if (goodsResult[0].goods_color) {
      const tempColorArr = goodsResult[0].goods_color.split(',');
      for (let i = 0; i < goodsColorResult.length; i++) {
        if (tempColorArr.indexOf(goodsColorResult[i]._id.toString()) != -1) {
          goodsColorResult[i].checked = true;
        }
      }
    }
    //4、商品的图库信息
    const goodsImageResult = await this.goodsImageService.find({
      goods_id: goodsResult[0]._id,
    });
    //5. 获取商品类型
    const goodsTypeResult = await this.goodsTypeService.find({});
    //6、获取规格信息 商品规格属性
    const goodsAttrResult = await this.goodsAttrService.find({
      goods_id: goodsResult[0]._id,
    });
    //拼接表单
    let goodsAttrStr = '';
    goodsAttrResult.forEach(async (val) => {
      if (val.attribute_type == 1) {
        goodsAttrStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <input type="text" name="attr_value_list"  value="${val.attribute_value}" /></li>`;
      } else if (val.attribute_type == 2) {
        goodsAttrStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <textarea cols="50" rows="3" name="attr_value_list">${val.attribute_value}</textarea></li>`;
      } else {
        // 获取 attr_value  获取可选值列表
        const oneGoodsTypeAttributeResult =
          await this.goodsTypeAttributeService.find({
            _id: val.attribute_id,
          });

        const arr = oneGoodsTypeAttributeResult[0].attr_value.split('\n');

        goodsAttrStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />`;

        goodsAttrStr += '<select name="attr_value_list">';

        for (let j = 0; j < arr.length; j++) {
          if (arr[j] == val.attribute_value) {
            goodsAttrStr += `<option value="${arr[j]}" selected >${arr[j]}</option>`;
          } else {
            goodsAttrStr += `<option value="${arr[j]}" >${arr[j]}</option>`;
          }
        }
        goodsAttrStr += '</select>';
        goodsAttrStr += '</li>';
      }
    });
    console.log(goodsAttrStr, 'goodsAttr');
    return {
      goodsCate: goodsCateResult,
      goodsColor: goodsColorResult,
      goodsType: goodsTypeResult,
      goods: goodsResult[0],
      goodsAttr: goodsAttrStr,
      goodsImage: goodsImageResult,
      prevPage: req.prevPage, //上一页地址
    };
  }
  //执行修改
  @Post('doEdit')
  @UseInterceptors(FileInterceptor('goods_img'))
  async doEdit(@Body() body, @UploadedFile() file, @Response() res) {
    console.log(body);
    //获取上一页传过来地址
    const prevPage = body.prevPage || `/${Config.adminPath}/goods`;
    //1、修改商品数据
    const goods_id = body._id;
    //注意 goods_color的类型
    if (body.goods_color && typeof body.goods_color !== 'string') {
      body.goods_color = body.goods_color.join(',');
    }

    if (file) {
      const { saveDir, uploadDir } = await this.toolsService.uploadFile(file);
      //生成缩略图
      if (uploadDir) {
        this.toolsService.jimpImg(uploadDir);
      }
      await this.goodsService.update(
        {
          _id: goods_id,
        },
        Object.assign(body, {
          goods_img: saveDir,
        }),
      );
    } else {
      await this.goodsService.update(
        {
          _id: goods_id,
        },
        body,
      );
    }

    //2、修改图库数据 （增加）

    const goods_image_list = body.goods_image_list;
    if (goods_id && goods_image_list && typeof goods_image_list !== 'string') {
      for (let i = 0; i < goods_image_list.length; i++) {
        await this.goodsImageService.add({
          goods_id: goods_id,
          img_url: goods_image_list[i],
        });
      }
    }

    // 3、修改商品类型属性数据         1、删除当前商品id对应的类型属性  2、执行增加

    // 3.1 删除当前商品id对应的类型属性
    await this.goodsAttrService.deleteMany({ goods_id: goods_id });

    // 3.2 执行增加
    const attr_id_list = body.attr_id_list;
    const attr_value_list = body.attr_value_list;
    if (goods_id && attr_id_list && typeof attr_id_list !== 'string') {
      for (let i = 0; i < attr_id_list.length; i++) {
        //获取当前 商品类型id对应的商品类型属性
        const goodsTypeAttributeResult =
          await this.goodsTypeAttributeService.find({ _id: attr_id_list[i] });
        await this.goodsAttrService.add({
          goods_id: goods_id,
          goods_cate_id: body.goods_cate_id, //分类id
          attribute_id: attr_id_list[i],
          attribute_type: goodsTypeAttributeResult[0].attr_type,
          attribute_title: goodsTypeAttributeResult[0].title,
          attribute_value: attr_value_list[i],
        });
      }
    }
    this.toolsService.success(res, '修改商品成功', prevPage);
  }
  @Get('changeGoodsImageColor')
  async changeGoodsImageColor(@Query() query) {
    let color_id = query.color_id;
    const goods_image_id = query.goods_image_id;
    if (color_id) {
      color_id = new mongoose.Types.ObjectId(color_id);
    }
    const res = await this.goodsImageService.update(
      {
        _id: goods_image_id,
      },
      { color_id: color_id },
    );
    if (res) {
      return { success: true, message: '更新数据成功' };
    } else {
      return { success: false, message: '更新数据失败' };
    }
  }
  @Get('removeGoodsImage')
  async removeGoodsImage(@Query() query) {
    const goods_image_id = query.goods_image_id;

    const result = await this.goodsImageService.delete({
      _id: goods_image_id,
    });
    if (result) {
      return { success: true, message: '删除数据成功' };
    } else {
      return { success: false, message: '删除数据失败' };
    }
  }
  //建议：软删除
  @Get('delete')
  async delete(@Query() query, @Response() res, @Request() req) {
    const result = await this.goodsService.delete({ _id: query.id });
    const prevPage = req.prevPage || `/${Config.adminPath}/goods`;
    if (result.acknowledged) {
      await this.goodsAttrService.deleteMany({
        goods_id: query.id,
      });

      await this.goodsImageService.deleteMany({
        goods_id: query.id,
      });
      this.toolsService.success(res, '删除成功', prevPage);
    } else {
      this.toolsService.error(res, '删除失败', prevPage);
    }
  }
}
