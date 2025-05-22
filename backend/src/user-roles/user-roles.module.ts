import { Module } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { UserRolesController } from './user-roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoles } from './user-roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoles])],
  providers: [UserRolesService],
  controllers: [UserRolesController],
  exports: [UserRolesService],
})
export class UserRolesModule {}
