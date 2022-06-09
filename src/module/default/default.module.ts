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
//引入redis 模块
import { RedisModule } from 'nestjs-redis';
import { Config } from '../../config/config';
import { CacheService } from '../../service/cache/cache.service';
@Module({
  imports: [PublicModule, RedisModule.register(Config.redisOptions)],
  providers: [CacheService],
  controllers: [
    IndexController,
    UserController,
    AddressController,
    BuyController,
    PassController,
    CartController,
    ProductController,
  ],
})
export class DefaultModule {}
