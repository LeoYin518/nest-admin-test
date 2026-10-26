/**
  readFileSync：Node.js 内置的 fs 模块方法，用来同步读取文件内容。
  js-yaml：一个库，用来把 YAML 文件 转成 JS 对象。
  join：Node.js 内置的 path 模块方法，用来拼接路径，保证跨平台（Win/Linux/Mac）都能正确使用。
 */
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

type EnvKey = 'dev' | 'test' | 'prod';
const configFileNameObj: Record<EnvKey, string> = {
    dev: 'dev',
    test: 'test',
    prod: 'prod',
};

export default () => {
    const rawEnv = process.env.NODE_ENV || 'dev';
    if (rawEnv !== 'dev' && rawEnv !== 'test' && rawEnv !== 'prod') {
        throw new Error(`不支持的 NODE_ENV：${rawEnv}`);
    }
    const env: EnvKey = rawEnv;

    console.log(`当前环境：${env}`);

    return yaml.load(readFileSync(join(import.meta.dirname, `./${configFileNameObj[env]}.yml`), 'utf8')) as Record<string, unknown>;
}