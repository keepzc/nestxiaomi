import { Module } from '@nestjs/common';
import { MainController } from './main/main.controller';
import { LoginController } from './login/login.controller';
import { ManagerController } from './manager/manager.controller';
import { ToolsService } from '../../service/tools/tools.service';

import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from '../../schema/admin.schema';
import { AdminService } from '../../service/admin/admin.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Admin',
        schema: AdminSchema,
        collection: 'admin',
      },
    ]),
  ],
  controllers: [MainController, LoginController, ManagerController],
  providers: [ToolsService, AdminService],
})
export class AdminModule {}
