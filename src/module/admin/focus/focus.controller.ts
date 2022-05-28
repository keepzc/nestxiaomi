import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ToolsService } from '../../../service/tools/tools.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FocusService } from '../../../service/focus/focus.service';
import { Config } from '../../../config/config';
@Controller(`${Config.adminPath}/focus`)
export class FocusController {
  constructor(
    private toolsService: ToolsService,
    private focusService: FocusService,
  ) {}
  @Get()
  @Render('admin/focus/index')
  async index() {
    const result = await this.focusService.find({});
    return {
      focusList: result,
    };
  }

  @Get('add')
  @Render('admin/focus/add')
  add() {
    return {};
  }

  @Post('doAdd')
  @UseInterceptors(FileInterceptor('focus_img'))
  async doAdd(@Body() body, @UploadedFile() file, @Response() res) {
    const { saveDir } = this.toolsService.uploadFile(file);
    await this.focusService.add(
      Object.assign(body, {
        focus_img: saveDir,
      }),
    );
    this.toolsService.success(
      res,
      '新增轮播图成功',
      `/${Config.adminPath}/focus`,
    );
  }
  @Get('edit')
  @Render('admin/focus/edit')
  async edit(@Query() query) {
    try {
      const result = await this.focusService.find({ _id: query.id });
      return {
        focus: result[0],
      };
    } catch (error) {
      console.log(error);
    }
  }
  @Post('doEdit')
  @UseInterceptors(FileInterceptor('focus_img'))
  async doEdit(@Body() body, @UploadedFile() file, @Response() res) {
    const _id = body._id;
    if (file) {
      const { saveDir } = this.toolsService.uploadFile(file);
      await this.focusService.update(
        { _id: _id },
        Object.assign(body, {
          focus_img: saveDir,
        }),
      );
    } else {
      await this.focusService.update({ _id: _id }, body);
    }
    this.toolsService.success(
      res,
      '修改轮播图成功',
      `/${Config.adminPath}/focus`,
    );
  }
  @Get('delete')
  async delete(@Query() query, @Response() res) {
    await this.focusService.delete({ _id: query.id });
    this.toolsService.success(res, '删除成功', `/${Config.adminPath}/focus`);
  }
  //更新状态
  @Get('changeStatus')
  async changeStatus(@Query() query) {
    //1. 获取要修改数据id
    //2. 查询当前数据状态
    //3. 修改状态1-->0
    const id = query.id;
    let json;
    const result = await this.focusService.find({ _id: id });
    if (result.length > 0) {
      const status = result[0].status;
      status == 1 ? (json = { status: 0 }) : (json = { status: 0 });
      await this.focusService.update({ _id: id }, json);
      return {
        success: true,
        message: '修改成功',
      };
    } else {
      return {
        success: false,
        message: '传入参数错误',
      };
    }
  }
}
