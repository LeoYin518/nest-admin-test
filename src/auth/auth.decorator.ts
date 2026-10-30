import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Auth = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user; // 通常由 AuthGuard 注入

        // 如果传入了属性名，则只返回该属性
        return data ? user?.[data] : user;
    },
);