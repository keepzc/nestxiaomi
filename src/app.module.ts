import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AdminModule } from './module/admin/admin.module';
import { DefaultModule } from './module/default/default.module';
import { ApiModule } from './module/api/api.module';
import { MongooseModule } from '@nestjs/mongoose';
//配置中间件
import { AdminauthMiddleware } from './middleware/adminauth.middleware';
import { InitMiddleware } from './middleware/init.middleware';
import { DefaultMiddleware } from './middleware/default.middleware';
import { UserauthMiddleware } from './middleware/userauth.middleware';
//配置全局config
import { Config } from './config/config';
import { PublicModule } from './module/public/public.module';

@Module({
  imports: [
    AdminModule,
    DefaultModule,
    ApiModule,
    MongooseModule.forRoot(
      'mongodb://nestadmin:123456@127.0.0.1:27017/nestxiaomi',
      {
        useNewUrlParser: true,
      },
    ),
    PublicModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminauthMiddleware)
      .forRoutes(`${Config.adminPath}/*`)
      .apply(InitMiddleware)
      .forRoutes('*')
      .apply(DefaultMiddleware)
      .forRoutes(
        {
          path: '/',
          method: RequestMethod.GET,
        },
        {
          path: '/category/*',
          method: RequestMethod.GET,
        },
        {
          path: '/product/*',
          method: RequestMethod.GET,
        },
        {
          path: '/cart',
          method: RequestMethod.GET,
        },
        {
          path: '/cart/addCartSuccess',
          method: RequestMethod.GET,
        },
        {
          path: '/buy/*',
          method: RequestMethod.GET,
        },
        {
          path: '/user/*',
          method: RequestMethod.GET,
        },
      )
      .apply(UserauthMiddleware)
      .forRoutes(
        {
          path: '/buy/*',
          method: RequestMethod.ALL,
        },
        {
          path: '/user/*',
          method: RequestMethod.ALL,
        },
      );
  }
}
