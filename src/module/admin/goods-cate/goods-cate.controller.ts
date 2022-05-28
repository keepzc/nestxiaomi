import {
  Controller,
  Body,
  Get,
  Post,
  Query,
  Render,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { GoodsCateService } from '../../../service/goods-cate/goods-cate.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ToolsService } from '../../../service/tools/tools.service';
import { Config } from '../../../config/config';

@Controller(`${Config.adminPath}/goodsCate`)
export class GoodsCateController {
  constructor(
    private goodsCateService: GoodsCateService,
    private toolsService: ToolsService,
  ) {}

  @Get()
  @Render('admin/goodsCate/index')
  async index() {
    const result = await this.goodsCateService.getModel().aggregate([
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
    return {
      list: result,
    };
  }
  @Get('add')
  @Render('admin/goodsCate/add')
  async add() {
    const result = await this.goodsCateService.find({ pid: '0' });
    return {
      cateList: result,
    };
  }

  @Post('doAdd')
  @UseInterceptors(FileInterceptor('cate_img'))
  async doAdd(@Body() body, @UploadedFile() file, @Response() res) {
    const pid = body.pid;
    const { saveDir, uploadDir } = this.toolsService.uploadFile(file);
    try {
      if (pid != 0) {
        body.pid = new mongoose.Types.ObjectId(pid); //注意
      }

      await this.goodsCateService.add(
        Object.assign(body, {
          cate_img: saveDir,
        }),
      );
      if (uploadDir) {
        //缩略图
        this.toolsService.jimpImg(uploadDir);
      }

      this.toolsService.success(
        res,
        '新增商品分类成功',
        `/${Config.adminPath}/goodsCate`,
      );
    } catch (error) {
      console.log(error);
      this.toolsService.error(
        res,
        '非法请求',
        `/${Config.adminPath}/goodsCate/add`,
      );
    }
  }
  @Get('edit')
  @Render('admin/goodsCate/edit')
  async edit(@Query() query) {
    //获取所有的以及分类
    try {
      const cateList = await this.goodsCateService.find({ pid: '0' });
      const result = await this.goodsCateService.find({ _id: query.id });
      return {
        cateList: cateList,
        list: result[0],
      };
    } catch (error) {
      return error;
    }
  }
  @Post('doEdit')
  @UseInterceptors(FileInterceptor('cate_img'))
  async doEdit(@Body() body, @UploadedFile() file, @Response() res) {
    const id = body._id;
    const pid = body.pid;
    if (pid != 0) {
      body.pid = new mongoose.Types.ObjectId(pid);
    }
    try {
      if (file) {
        const { saveDir, uploadDir } = this.toolsService.uploadFile(file);
        await this.goodsCateService.update(
          { _id: id },
          Object.assign(body, {
            cate_img: saveDir,
          }),
        );
        //生成缩略图
        if (uploadDir) {
          this.toolsService.jimpImg(uploadDir);
        }
      } else {
        await this.goodsCateService.update({ _id: id }, body);
      }
      this.toolsService.success(
        res,
        '新增商品分类成功',
        `/${Config.adminPath}/goodsCate`,
      );
    } catch (error) {
      this.toolsService.error(
        res,
        '非法请求',
        `/${Config.adminPath}/goodsCate/edit?id=${id}`,
      );
    }
  }
  @Get('delete')
  async delete(@Query() query, @Response() res) {
    const result = await this.goodsCateService.delete({ _id: query.id });
    this.toolsService.success(
      res,
      '删除成功',
      `/${Config.adminPath}/goodsCate`,
    );
  }
}
