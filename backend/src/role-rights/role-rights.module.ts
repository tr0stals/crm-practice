import { Module } from '@nestjs/common';
import { RoleRightsService } from './role-rights.service';
import { RoleRightsController } from './role-rights.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRights } from './role-rights.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleRights])],
  providers: [RoleRightsService],
  controllers: [RoleRightsController],
  exports: [RoleRightsService],
})
export class RoleRightsModule {}
