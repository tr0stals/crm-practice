import { Controller, Get, Post } from '@nestjs/common';
import { DatabaseEagerCachingService } from './database-eager-caching.service';

@Controller('database-eager-caching')
export class DatabaseEagerCachingController {
  constructor(private readonly cacheService: DatabaseEagerCachingService) {}

  @Get('all')
  getAll() {
    return this.cacheService.getAll();
  }

  @Post('refresh')
  async refresh() {
    await this.cacheService.refreshAllInBackground();
    return { status: 'refresh started' };
  }
} 