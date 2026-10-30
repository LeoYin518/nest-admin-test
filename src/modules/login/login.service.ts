import { Injectable } from '@nestjs/common';
import { LoginBody } from './dto/login-body.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ResponseUtil } from '../../common/response.js';
import { RedisKey, UserConstants } from '../../common/constants.js';
import { randomUUID } from 'crypto';
import { RedisService } from '../../redis/redis.service.js';

@Injectable()
export class LoginService {
    constructor(private readonly prisma: PrismaService,
        private readonly redis: RedisService
    ) { }
    async doLogin(loginBody: LoginBody) {
        const { username, password } = loginBody
        const user = await this.prisma.user.findUnique({
            where: {
                username
            }
        })
        if (user === null) {
            return ResponseUtil.fail(UserConstants.USER_NOT_EXISTS)
        }
        if (password !== user.password) {
            return ResponseUtil.fail(UserConstants.PASSWORD_ERROR)
        }
        const token = randomUUID();
        await this.redis.client.set(RedisKey.USER_LOGIN_TOKEN + token, JSON.stringify(user), 'EX', 1800)
        return ResponseUtil.success(token)
    }
}
