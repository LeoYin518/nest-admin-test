import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as yaml from 'js-yaml';

export interface MysqlConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    charset: string;
    timezone: string;
    connectionLimit: number;
    logging: boolean;
}

export interface AppConfig extends Record<string, unknown> {
    db: {
        mysql: MysqlConfig;
    };
}

const configDir = dirname(fileURLToPath(import.meta.url));

export default function configuration(): AppConfig {
    const env = process.env.NODE_ENV || 'dev';

    if (env !== 'dev' && env !== 'test' && env !== 'prod') {
        throw new Error(`不支持的 NODE_ENV：${env}`);
    }

    const content = readFileSync(
        join(configDir, `${env}.yml`),
        'utf8',
    );

    const config = yaml.load(content) as AppConfig;
    const mysql = config?.db?.mysql;

    if (
        !mysql ||
        !mysql.host ||
        !mysql.username ||
        !mysql.database ||
        typeof mysql.password !== 'string' ||
        !Number.isInteger(mysql.port) ||
        mysql.port < 1 ||
        mysql.port > 65535
    ) {
        throw new Error(`${env}.yml 中的 db.mysql 配置不完整或端口无效`);
    }

    return config;
}