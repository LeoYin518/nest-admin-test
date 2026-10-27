import {
    Injectable,
    type OnModuleDestroy,
    type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import type { MysqlConfig } from '../config/index.js';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    constructor(config: ConfigService) {
        const mysql = config.getOrThrow<MysqlConfig>('db.mysql');

        const adapter = new PrismaMariaDb({
            host: mysql.host,
            port: mysql.port,
            user: mysql.username,
            password: mysql.password,
            database: mysql.database,
            charset: mysql.charset,
            timezone: mysql.timezone,
            connectionLimit: mysql.connectionLimit,
        });

        super({
            adapter,
            log: mysql.logging
                ? ['query', 'warn', 'error']
                : ['warn', 'error'],
        });
    }

    async onModuleInit(): Promise<void> {
        await this.$connect();
    }

    async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
    }
}