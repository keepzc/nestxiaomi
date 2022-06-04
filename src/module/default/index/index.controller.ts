import { Controller, Get, Render } from '@nestjs/common';
import { NavService } from '../../../service/nav/nav.service';
import { FocusService } from '../../../service/focus/focus.service';
@Controller('')
export class IndexController {
  constructor(
    private navService: NavService,
    private focusService: FocusService,
  ) {}
  @Get()
  @Render('default/index/index')
  async index() {
    const navResult = await this.navService.find({});
    const focusResult = await this.focusService.find({});
    return {};
  }
}
