import { Injectable } from '@nestjs/common';
import { LoginBody } from './dto/login-body.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ResponseUtil } from '../../common/response.js';
import { UserConstants } from '../../common/constants.js';
import { randomUUID } from 'crypto';

@Injectable()
export class LoginService {
    constructor(private readonly prisma: PrismaService) { }
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
        return ResponseUtil.success(token)
    }
}
