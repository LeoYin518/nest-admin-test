import { defineConfig } from 'prisma/config';
import configuration from './src/config/index.js';

const { db: { mysql } } = configuration();

const username = encodeURIComponent(mysql.username);
const password = encodeURIComponent(mysql.password);
const database = encodeURIComponent(mysql.database);

const url =
  `mysql://${username}:${password}` +
  `@${mysql.host}:${mysql.port}/${database}`;

export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations',
  },

  datasource: {
    url,
  },
});