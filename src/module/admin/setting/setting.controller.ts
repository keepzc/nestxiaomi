import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Response,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ToolsService } from '../../../service/tools/tools.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SettingService } from '../../../service/setting/setting.service';
import { Config } from '../../../config/config';
@Controller(`${Config.adminPath}/setting`)
export class SettingController {
  constructor(
    private toolsService: ToolsService,
    private settingService: SettingService,
  ) {}
  @Get()
  @Render('admin/setting/index')
  async index() {
    const result = await this.settingService.find({});
    return {
      list: result[0],
    };
  }

  @Post('doEdit')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'site_logo', maxCount: 1 },
      { name: 'no_picture', maxCount: 1 },
    ]),
  )
  async doEdit(@Body() body, @UploadedFiles() files, @Response() res) {
    let updateJson = body;
    if (files.site_logo) {
      const siteLogoDir = this.toolsService.uploadFile(
        files.site_logo[0],
      ).saveDir;

      updateJson = Object.assign(updateJson, {
        site_logo: siteLogoDir,
      });
    }
    if (files.no_picture) {
      const noPictureDir = this.toolsService.uploadFile(
        files.no_picture[0],
      ).saveDir;
      updateJson = Object.assign(updateJson, {
        no_picture: noPictureDir,
      });
    }
    //更新数据
    await this.settingService.update({}, updateJson);
    this.toolsService.success(res, '修改成功', `/${Config.adminPath}/setting`);
  }
}
