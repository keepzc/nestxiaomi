import { Controller, Get } from '@nestjs/common';

@Controller('cart')
export class CartController {
  @Get()
  index() {
    return '我是购物车';
  }
}
