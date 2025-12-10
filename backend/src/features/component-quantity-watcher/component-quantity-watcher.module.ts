import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentQuantityWatcherService } from './component-quantity-watcher.service';
import { Components } from 'src/components/components.entity';
import { InvoicesComponents } from 'src/invoices_components/invoices_components.entity';
import { Writeoff } from 'src/writeoff/writeoff.entity';
import { CurrentTasksComponents } from 'src/current_tasks_components/current_tasks_components.entity';
import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { ArrivalInvoices } from 'src/arrival_invoices/arrival_invoices.entity';
import { StandTasksComponents } from 'src/stand_tasks_components/stand_tasks_components.entity';
import { InventarizationBusinessModule } from 'src/features/inventarization-business/inventarization-business.module';
import { WsGateway } from 'src/websocket/ws.gateway';
import { Inventarization } from 'src/inventarization/inventarization.entity';
import { Organizations } from 'src/organizations/organizations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Components,
      InvoicesComponents,
      Writeoff,
      CurrentTasksComponents,
      CurrentTasks,
      ArrivalInvoices,
      StandTasksComponents,
      Inventarization,
      Organizations,
    ]),
    InventarizationBusinessModule,
  ],
  providers: [ComponentQuantityWatcherService, WsGateway],
  exports: [ComponentQuantityWatcherService],
})
export class ComponentQuantityWatcherModule {}
