import { Module } from '@nestjs/common';
import { DatabaseEagerCachingService } from './database-eager-caching.service';
import { DatabaseEagerCachingController } from './database-eager-caching.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [DatabaseEagerCachingService],
  controllers: [DatabaseEagerCachingController],
  exports: [DatabaseEagerCachingService],
})
export class DatabaseEagerCachingModule {} 