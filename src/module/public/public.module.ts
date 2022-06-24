import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminSchema } from '../../schema/admin.schema';
import { RoleSchema } from '../../schema/role.schema';
import { AccessSchema } from '../../schema/access.schema';
import { RoleAccessSchema } from '../../schema/role_access.schema';
import { FocusSchema } from '../../schema/focus.schema';
import { GoodsTypeSchema } from '../../schema/goods_type.schema';
import { GoodsTypeAttributeSchema } from '../../schema/goods_type_attribute.schema';
import { GoodsCateSchema } from '../../schema/goods_cate.schema';
import { GoodsSchema } from '../../schema/goods.schema';
import { GoodsColorSchema } from '../../schema/goods_color.schema';
import { GoodsAttrSchema } from '../../schema/goods_attr.schema';
import { GoodsImageSchema } from '../../schema/goods_image.schema';
import { NavSchema } from '../../schema/nav.schema';
import { SettingSchema } from '../../schema/setting.schema';
import { UserSchema } from '../../schema/user.schema';
import { UserTempSchema } from '../../schema/user_temp.schema';
import { AddressSchema } from '../../schema/address.schema';

import { AdminService } from '../../service/admin/admin.service';
import { RoleService } from '../../service/role/role.service';
import { AccessService } from '../../service/access/access.service';
import { RoleAccessService } from '../../service/role-access/role-access.service';
import { FocusService } from '../../service/focus/focus.service';
import { GoodsTypeService } from '../../service/goods-type/goods-type.service';
import { GoodsTypeAttributeService } from '../../service/goods-type-attribute/goods-type-attribute.service';
import { GoodsCateService } from '../../service/goods-cate/goods-cate.service';
import { GoodsService } from '../../service/goods/goods.service';
import { GoodsColorService } from '../../service/goods-color/goods-color.service';
import { GoodsAttrService } from '../../service/goods-attr/goods-attr.service';
import { GoodsImageService } from '../../service/goods-image/goods-image.service';
import { SettingService } from '../../service/setting/setting.service';
import { NavService } from '../../service/nav/nav.service';
import { ToolsService } from '../../service/tools/tools.service';
import { CacheService } from '../../service/cache/cache.service';
import { CookieService } from '../../service/cookie/cookie.service';
import { CartService } from '../../service/cart/cart.service';
import { UserService } from '../../service/user/user.service';
import { UserTempService } from '../../service/user-temp/user-temp.service';
import { AddressService } from '../../service/address/address.service';
//引入redis 模块
import { RedisModule } from 'nestjs-redis';
import { Config } from '../../config/config';
@Module({
  imports: [
    RedisModule.register(Config.redisOptions),
    MongooseModule.forFeature([
      {
        name: 'Admin',
        schema: AdminSchema,
        collection: 'admin',
      },
      {
        name: 'Role',
        schema: RoleSchema,
        collection: 'role',
      },
      {
        name: 'Access',
        schema: AccessSchema,
        collection: 'access',
      },
      {
        name: 'RoleAccess',
        schema: RoleAccessSchema,
        collection: 'role_access',
      },
      {
        name: 'Focus',
        schema: FocusSchema,
        collection: 'focus',
      },
      {
        name: 'GoodsType',
        schema: GoodsTypeSchema,
        collection: 'goods_type',
      },
      {
        name: 'GoodsTypeAttribute',
        schema: GoodsTypeAttributeSchema,
        collection: 'goods_type_attribute',
      },
      {
        name: 'GoodsCate',
        schema: GoodsCateSchema,
        collection: 'goods_cate',
      },
      {
        name: 'Goods',
        schema: GoodsSchema,
        collection: 'goods',
      },
      {
        name: 'GoodsColor',
        schema: GoodsColorSchema,
        collection: 'goods_color',
      },
      {
        name: 'GoodsAttr',
        schema: GoodsAttrSchema,
        collection: 'goods_attr',
      },
      {
        name: 'GoodsImage',
        schema: GoodsImageSchema,
        collection: 'goods_image',
      },
      {
        name: 'Nav',
        schema: NavSchema,
        collection: 'nav',
      },
      {
        name: 'Setting',
        schema: SettingSchema,
        collection: 'setting',
      },
      {
        name: 'User',
        schema: UserSchema,
        collection: 'user',
      },
      {
        name: 'UserTemp',
        schema: UserTempSchema,
        collection: 'userTemp',
      },
      {
        name: 'Address',
        schema: AddressSchema,
        collection: 'address',
      },
    ]),
  ],
  providers: [
    ToolsService,
    AdminService,
    RoleService,
    AccessService,
    RoleAccessService,
    FocusService,
    GoodsTypeService,
    GoodsTypeAttributeService,
    GoodsCateService,
    GoodsService,
    GoodsColorService,
    GoodsAttrService,
    GoodsImageService,
    NavService,
    SettingService,
    CacheService,
    CookieService,
    CartService,
    UserService,
    UserTempService,
    AddressService,
  ],
  //暴露服务
  exports: [
    ToolsService,
    AdminService,
    RoleService,
    AccessService,
    RoleAccessService,
    FocusService,
    GoodsTypeService,
    GoodsTypeAttributeService,
    GoodsCateService,
    GoodsService,
    GoodsColorService,
    GoodsAttrService,
    GoodsImageService,
    NavService,
    SettingService,
    CacheService,
    CookieService,
    CartService,
    UserService,
    UserTempService,
    AddressService,
  ],
})
export class PublicModule {}
