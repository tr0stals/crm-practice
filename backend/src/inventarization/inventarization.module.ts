import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventarization } from './inventarization.entity';
import { InventarizationService } from './inventarization.service';
import { InventarizationController } from './inventarization.controller';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { ComponentsModule } from 'src/components/components.module';
import { InventarizationBusinessModule } from 'src/features/inventarization-business/inventarization-business.module';
import { ComponentQuantityWatcherModule } from 'src/features/component-quantity-watcher/component-quantity-watcher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventarization]),
    OrganizationsModule,
    ComponentsModule,
    InventarizationBusinessModule,
    ComponentQuantityWatcherModule,
  ],
  controllers: [InventarizationController],
  providers: [InventarizationService],
  exports: [TypeOrmModule],
})
export class InventarizationModule {}
