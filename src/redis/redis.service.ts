import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
    client;
    private isRedisAvailable = false;
    private durationForRefreshRedis = Number(process.env?.REDIS_REFRESH_TIME_PER_SECOUND)
    onModuleInit() {
        this.client = new Redis({
            host: 'localhost',
            port: 6379,
            retryStrategy: () => null,
            maxRetriesPerRequest: 1,
        });
        this.startHealthCheck()
    }
    startHealthCheck() {
        setInterval(async () => {
            try {
                await this.client.ping();
                this.isRedisAvailable = true;
            } catch (err) {
                this.isRedisAvailable = false;
                this.client.disconnect();
                this.client = new Redis({
                    host: 'localhost',
                    port: 6379,
                    retryStrategy: () => null,
                    maxRetriesPerRequest: 1,
                });
            }
        }, this.durationForRefreshRedis * 1000);
    }

    async rPop(key: string) {
        return await this.client.rpop(key)
    }

    async lPush(key: string, data: string) {
        if (!this.isRedisAvailable) throw new InternalServerErrorException("our service is not avaible")
        try {
            await this.client.lpush(key, data)
        }
        catch {
            this.isRedisAvailable = false
            throw new InternalServerErrorException("our service is not avaible")
        }
    }

    async set(key: string, value: any) {
        if (!this.isRedisAvailable) throw new InternalServerErrorException("our service is not avaible")
        try { await this.client.set(key, JSON.stringify(value)); }
        catch {
            this.isRedisAvailable = false
            throw new InternalServerErrorException("our service is not avaible")
        }
    }

    async ttl(key: string) {
        if (!this.isRedisAvailable) throw new InternalServerErrorException("our service is not avaible")
        try { return await this.client.ttl(key) }
        catch {
            this.isRedisAvailable = false
            throw new InternalServerErrorException("our service is not avaible")
        }
    }

    async get(key: string) {
        if (!this.isRedisAvailable) throw new InternalServerErrorException("our service is not avaible")
        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        }
        catch {
            this.isRedisAvailable = false
            throw new InternalServerErrorException("our service is not avaible")
        }
    }

    async del(key: string) {
        if (!this.isRedisAvailable) throw new InternalServerErrorException("our service is not avaible")
        try {
            await this.client.del(key);
        }
        catch {
            this.isRedisAvailable = false
            throw new InternalServerErrorException("our service is not avaible")
        }
    }
    async incre(key: string) {
        if (!this.isRedisAvailable) throw new InternalServerErrorException("our service is not avaible")
        try {
            await this.client.incr(key);
        }
        catch {
            this.isRedisAvailable = false
            throw new InternalServerErrorException("our service is not avaible")
        }

    }
    async expir(key: string, tll: number) {
        if (!this.isRedisAvailable) throw new InternalServerErrorException("our service is not avaible")
        try {
            await this.client.expire(key, tll);
        }
        catch {
            this.isRedisAvailable = false
            throw new InternalServerErrorException("our service is not avaible")
        }
    }
}
