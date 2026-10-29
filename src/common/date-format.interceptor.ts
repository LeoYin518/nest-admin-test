import {
    Injectable,
    type CallHandler,
    type ExecutionContext,
    type NestInterceptor,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { map } from 'rxjs';

function formatDates(value: unknown): unknown {
    if (value instanceof Date) {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
    }

    if (Array.isArray(value)) {
        return value.map(formatDates);
    }

    if (value !== null && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [
                key,
                formatDates(item),
            ]),
        );
    }

    return value;
}

@Injectable()
export class DateFormatInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(map(formatDates));
    }
}