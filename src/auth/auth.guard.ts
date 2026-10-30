import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { RedisService } from "../redis/redis.service.js";
import { RedisKey } from "../common/constants.js";
import { IS_PUBLIC_KEY } from "./public.decorator.js";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly redis: RedisService,
        private readonly reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;

        if (!token) {
            throw new UnauthorizedException('请先登录');
        }

        let user = await this.redis.client.get(RedisKey.USER_LOGIN_TOKEN + token);

        if (user === null) {
            throw new UnauthorizedException('token已过期');
        }

        // 当前请求后续流程直接使用，不再查询 Redis
        request.user = JSON.parse(user);
        request.token = token;

        return true;
    }
}