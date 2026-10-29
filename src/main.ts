import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './common/response.js'
import { DateFormatInterceptor } from './common/date-format.interceptor.js';

async function bootstrap() {

  // 跨域配置
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // 让 NestJS 应用能正确响应进程退出信号，执行优雅关闭，尤其用了 Prisma
  // 这样 Nest 关闭时会调用 PrismaService.onModuleDestroy() 并释放 MariaDB 连接池。
  app.enableShutdownHooks();

  // 开启管道配置
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );

  // 全局响应拦截器
  app.useGlobalInterceptors(new DateFormatInterceptor());

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
