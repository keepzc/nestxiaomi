import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //配置静态资源目录
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  //配置模板引擎
  app.setBaseViewsDir('views');
  app.setViewEngine('ejs');
  //配置 cookie 中间件
  app.use(cookieParser('*123@zcadfa7326#!@cvxbnb'));
  //配置 session 的中间件
  app.use(
    session({
      secret: '*123@zcadfa7326#!@cvxbnb',
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 30,
        httpOnly: true,
      },
      rolling: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
