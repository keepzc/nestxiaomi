import { Controller, Get, Render } from '@nestjs/common';

@Controller('product')
export class ProductController {
  @Get()
  @Render('default/product/info')
  index() {
    return {};
  }
}
