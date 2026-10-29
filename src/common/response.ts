import { HttpException, HttpStatus } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

export interface ApiResponse<T> {
    data: T;
    message: string;
    code: number;
}

export class ResponseUtil {
    static success<T>(
        data: T,
        message = '操作成功',
    ): ApiResponse<T> {
        return {
            data,
            message,
            code: 200,
        };
    }

    static fail(
        message: string,
        code = 500,
    ): ApiResponse<null> {
        return {
            data: null,
            message,
            code,
        };
    }
}

function findFirstMessage(
    errors: ValidationError[],
): string | undefined {
    for (const error of errors) {
        const message = Object.values(error.constraints ?? {})[0];

        if (message) {
            return message;
        }

        const childMessage = findFirstMessage(error.children ?? []);

        if (childMessage) {
            return childMessage;
        }
    }

    return undefined;
}

export function validationExceptionFactory(
    errors: ValidationError[],
): HttpException {
    const message = findFirstMessage(errors) ?? '参数校验失败';

    return new HttpException(
        ResponseUtil.fail(message, 400),
        HttpStatus.OK,
    );
}