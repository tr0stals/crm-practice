import { Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DatabaseCleanupService } from './database_cleanup.service';
import { CleanupStatistics } from './database_cleanup.types';

@ApiTags('Database Cleanup')
@Controller('utils/database-cleanup')
export class DatabaseCleanupController {
  constructor(private readonly databaseCleanupService: DatabaseCleanupService) {}

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete reset of all configured tables (deletes ALL records)' })
  @ApiResponse({
    status: 200,
    description: 'Complete reset completed successfully',
    type: 'object'
  })
  @ApiResponse({
    status: 500,
    description: 'Complete reset failed'
  })
  async completeReset(): Promise<CleanupStatistics> {
    return await this.databaseCleanupService.performCompleteReset();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get current statistics for all configured tables' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: 'object'
  })
  async getTablesStatistics(): Promise<Record<string, number | string>> {
    return await this.databaseCleanupService.getTablesStatistics();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check cleanup service health' })
  @ApiResponse({
    status: 200,
    description: 'Service health status',
    type: 'object'
  })
  async healthCheck() {
    return await this.databaseCleanupService.healthCheck();
  }
}