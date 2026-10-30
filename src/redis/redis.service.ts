import {
    Injectable,
    Logger,
    type OnModuleInit,
    type OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    readonly client: Redis;
    private readonly logger = new Logger(RedisService.name);

    constructor(config: ConfigService) {
        this.client = new Redis(config.getOrThrow<string>('redis.url'), {
            lazyConnect: true,
            maxRetriesPerRequest: 1,
        });

        this.client.on('error', (error: Error) => {
            this.logger.error(error.message);
        });
    }

    async onModuleInit(): Promise<void> {
        await this.client.connect();
    }

    onModuleDestroy(): void {
        this.client.disconnect();
    }
}