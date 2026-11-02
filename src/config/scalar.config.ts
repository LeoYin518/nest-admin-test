import { DocumentBuilder } from '@nestjs/swagger';

// 1. 构建 OpenAPI 文档配置
export const config = new DocumentBuilder()
    .setTitle('My Nest Doc')
    .setDescription('API 文档描述')
    .setVersion('1.0')
    .addTag('示例文档')
    // .addBearerAuth() // 如需 JWT 认证
    .build();
