import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
@Injectable()
export class CacheService {
  private client;
  constructor(private readonly redisService: RedisService) {
    this.getClient();
  }
  async getClient() {
    this.client = await this.redisService.getClient();
  }
  //写入redis
  async set(key: string, value: any, seconds?: number) {
    value = JSON.stringify(value);
    if (!this.client) {
      await this.getClient();
    }
    if (seconds) {
      await this.client.set(key, value, 'EX', seconds);
    } else {
      await this.client.set(key, value);
    }
  }
  //获取数据
  async get(key: string) {
    if (!this.client) {
      await this.getClient();
    }
    const data = await this.client.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }
  //清除缓存
  async clear() {
    if (!this.client) {
      await this.getClient();
    }
    await this.client.flushdb();
  }
}
