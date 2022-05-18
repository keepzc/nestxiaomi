import { Controller, Get, Render } from '@nestjs/common';
import { Config } from '../../../config/config';

@Controller(`${Config.adminPath}/manager`)
export class ManagerController {
  @Get()
  @Render('admin/manager/index')
  index() {
    return {};
  }

  @Get('add')
  @Render('admin/manager/add')
  add() {
    return {};
  }

  @Get('edit')
  @Render('admin/manager/edit')
  edit() {
    return {};
  }
}
