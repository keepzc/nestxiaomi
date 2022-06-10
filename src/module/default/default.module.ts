import { Module } from '@nestjs/common';
//引入公共模块
import { PublicModule } from '../public/public.module';
import { IndexController } from './index/index.controller';
import { UserController } from './user/user.controller';
import { AddressController } from './address/address.controller';
import { BuyController } from './buy/buy.controller';
import { PassController } from './pass/pass.controller';
import { CartController } from './cart/cart.controller';
import { ProductController } from './product/product.controller';
import { CategoryController } from './category/category.controller';
@Module({
  imports: [PublicModule],
  controllers: [
    IndexController,
    UserController,
    AddressController,
    BuyController,
    PassController,
    CartController,
    ProductController,
    CategoryController,
  ],
})
export class DefaultModule {}
