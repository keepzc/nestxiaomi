import { Module } from '@nestjs/common';
import { MainController } from './main/main.controller';
import { LoginController } from './login/login.controller';
import { ManagerController } from './manager/manager.controller';
import { ToolsService } from '../../service/tools/tools.service';

import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from '../../schema/admin.schema';
import { RoleSchema } from '../../schema/role.schema';
import { AccessSchema } from '../../schema/access.schema';
import { RoleAccessSchema } from '../../schema/role_access.schema';
import { FocusSchema } from '../../schema/focus.schema';
import { GoodsTypeSchema } from '../../schema/goods_type.schema';
import { GoodsTypeAttributeSchema } from '../../schema/goods_type_attribute.schema';
import { GoodsCateSchema } from '../../schema/goods_cate.schema';
import { AdminService } from '../../service/admin/admin.service';
import { RoleService } from '../../service/role/role.service';
import { AccessService } from '../../service/access/access.service';
import { RoleAccessService } from '../../service/role-access/role-access.service';
import { FocusService } from '../../service/focus/focus.service';
import { GoodsTypeService } from '../../service/goods-type/goods-type.service';
import { GoodsTypeAttributeService } from '../../service/goods-type-attribute/goods-type-attribute.service';
import { GoodsCateService } from '../../service/goods-cate/goods-cate.service';
import { RoleController } from './role/role.controller';
import { AccessController } from './access/access.controller';
import { FocusController } from './focus/focus.controller';
import { GoodsTypeController } from './goods-type/goods-type.controller';
import { GoodsTypeAttributeController } from './goods-type-attribute/goods-type-attribute.controller';
import { GoodsCateController } from './goods-cate/goods-cate.controller';
@Module({
  imports: [
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
    ]),
  ],
  controllers: [
    MainController,
    LoginController,
    ManagerController,
    RoleController,
    AccessController,
    FocusController,
    GoodsTypeController,
    GoodsTypeAttributeController,
    GoodsCateController,
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
  ],
  exports: [AdminService, RoleService, AccessService, RoleAccessService],
})
export class AdminModule {}
