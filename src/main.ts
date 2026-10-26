import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import rateLimit from 'express-rate-limit';

async function bootstrap() {

  // 跨域配置
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // 限流配置
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000, // 限制15分钟内最多只能访问1000次
    }),
  );

  // 获取配置服务
  const config = app.get(ConfigService);

  // 设置 api 访问前缀（请求上下文路径）
  const prefix = config.get<string>('app.prefix');
  app.setGlobalPrefix(prefix || '');

  // 端口配置
  const port = config.get<number>('app.port') || 3000;
  await app.listen(port);
}
await bootstrap();
