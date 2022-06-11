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
//配置全局config
import { Config } from './config/config';
import { PublicModule } from './module/public/public.module';
import { CacheService } from './service/cache/cache.service';

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
  providers: [CacheService],
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
      );
  }
}
