import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Writeoff } from './writeoff.entity';
import { WriteoffService } from './writeoff.service';
import { WriteoffController } from './writeoff.controller';
import { ComponentsModule } from 'src/components/components.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { Components } from 'src/components/components.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { WriteoffReasonsModule } from 'src/writeoff_reasons/writeoff_reasons.module';
import { WriteoffReasons } from 'src/writeoff_reasons/writeoff_reasons.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Writeoff,
      Components,
      WriteoffReasons,
      Organizations,
    ]),
    ComponentsModule,
    OrganizationsModule,
    WriteoffReasonsModule,
  ],
  providers: [WriteoffService],
  controllers: [WriteoffController],
  exports: [WriteoffService],
})
export class WriteoffModule {}
