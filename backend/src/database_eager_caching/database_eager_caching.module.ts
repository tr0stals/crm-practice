import { Module } from '@nestjs/common';
import { DatabaseEagerCachingService } from './database_eager_caching.service';
import { DatabaseEagerCachingController } from './database_eager_caching.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [DatabaseEagerCachingService],
  controllers: [DatabaseEagerCachingController],
  exports: [DatabaseEagerCachingService],
})
export class DatabaseEagerCachingModule {} 