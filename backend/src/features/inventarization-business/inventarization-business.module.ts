import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarizationBusinessService } from './inventarization-business.service';
import { Inventarization } from 'src/inventarization/inventarization.entity';
import { Components } from 'src/components/components.entity';
import { InvoicesComponents } from 'src/invoices_components/invoices_components.entity';
import { ArrivalInvoices } from 'src/arrival_invoices/arrival_invoices.entity';
import { CurrentTasksComponents } from 'src/current_tasks_components/current_tasks_components.entity';
import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { CurrentTaskStates } from 'src/current_task_states/current_task_states.entity';
import { Writeoff } from 'src/writeoff/writeoff.entity';
import { Organizations } from 'src/organizations/organizations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventarization,
      Components,
      InvoicesComponents,
      ArrivalInvoices,
      CurrentTasksComponents,
      CurrentTasks,
      CurrentTaskStates,
      Writeoff,
      Organizations,
    ]),
  ],
  providers: [InventarizationBusinessService],
  exports: [InventarizationBusinessService],
})
export class InventarizationBusinessModule {}