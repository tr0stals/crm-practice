import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Components } from 'src/components/components.entity';
import { InvoicesComponents } from 'src/invoices_components/invoices_components.entity';
import { Writeoff } from 'src/writeoff/writeoff.entity';
import { CurrentTasksComponents } from 'src/current_tasks_components/current_tasks_components.entity';
import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { ArrivalInvoices } from 'src/arrival_invoices/arrival_invoices.entity';
import { InventarizationBusinessService } from 'src/features/inventarization-business/inventarization-business.service';

@Injectable()
export class ComponentQuantityWatcherService {
  constructor(
    @InjectRepository(Components)
    private componentsRepository: Repository<Components>,

    @InjectRepository(InvoicesComponents)
    private invoicesComponentsRepository: Repository<InvoicesComponents>,

    @InjectRepository(Writeoff)
    private writeoffRepository: Repository<Writeoff>,

    @InjectRepository(CurrentTasksComponents)
    private currentTasksComponentsRepository: Repository<CurrentTasksComponents>,

    @InjectRepository(CurrentTasks)
    private currentTasksRepository: Repository<CurrentTasks>,

    @InjectRepository(ArrivalInvoices)
    private arrivalInvoicesRepository: Repository<ArrivalInvoices>,

    private inventarizationBusinessService: InventarizationBusinessService,
  ) {}

  /**
   * Автоматически пересчитывает количество компонента
   */
  async recalculateComponentQuantity(componentId: number, factoryId?: number): Promise<void> {
    try {
      // Если factoryId не указан, пытаемся найти его через последнюю операцию
      if (!factoryId) {
        factoryId = await this.findComponentFactory(componentId) || undefined;
      }

      if (!factoryId) {
        console.warn(`Не удалось определить factoryId для компонента ${componentId}`);
        return;
      }

      // Обновляем количество через бизнес-логику
      await this.inventarizationBusinessService.updateComponentQuantity(
        componentId,
        factoryId
      );

      console.log(`Автоматически обновлено количество компонента ${componentId} для фабрики ${factoryId}`);
    } catch (error) {
      console.error(`Ошибка при автоматическом пересчете компонента ${componentId}:`, error.message);
    }
  }

  /**
   * Пытается найти factoryId для компонента по последним операциям
   */
  private async findComponentFactory(componentId: number): Promise<number | null> {
    // Ищем factoryId в последней накладной
    const lastInvoice = await this.invoicesComponentsRepository.findOne({
      where: { components: { id: componentId } },
      relations: ['arrivalInvoices', 'arrivalInvoices.factory'],
      order: { id: 'DESC' }
    });

    if (lastInvoice?.arrivalInvoices?.factory?.id) {
      return lastInvoice.arrivalInvoices.factory.id;
    }

    // Ищем factoryId в последнем списании
    const lastWriteoff = await this.writeoffRepository.findOne({
      where: { components: { id: componentId } },
      relations: ['factory'],
      order: { id: 'DESC' }
    });

    if (lastWriteoff?.factory?.id) {
      return lastWriteoff.factory.id;
    }

    // Ищем factoryId в последней задаче
    const lastTaskComponent = await this.currentTasksComponentsRepository.findOne({
      where: { component: { id: componentId } },
      relations: [
        'currentTask',
        'currentTask.shipmentStands',
        'currentTask.shipmentStands.shipments',
        'currentTask.shipmentStands.shipments.factory'
      ],
      order: { id: 'DESC' }
    });

    if (lastTaskComponent?.currentTask?.shipmentStands?.shipments?.factory?.id) {
      return lastTaskComponent.currentTask.shipmentStands.shipments.factory.id;
    }

    // Ищем в последней инвентаризации
    const lastInventarization = await this.componentsRepository.findOne({
      where: { id: componentId },
      relations: ['inventarizations', 'inventarizations.factory']
    });

    if (lastInventarization?.inventarizations && lastInventarization.inventarizations.length > 0) {
      const sortedInvs = lastInventarization.inventarizations.sort((a, b) =>
        new Date(b.inventarizationDate).getTime() - new Date(a.inventarizationDate).getTime()
      );
      return sortedInvs[0].factory.id;
    }

    return null;
  }

  /**
   * Обработчик изменения в InvoicesComponents
   */
  async onInvoicesComponentChange(componentId: number): Promise<void> {
    await this.recalculateComponentQuantity(componentId);
  }

  /**
   * Обработчик изменения в Writeoff
   */
  async onWriteoffChange(componentId: number): Promise<void> {
    await this.recalculateComponentQuantity(componentId);
  }

  /**
   * Обработчик изменения в CurrentTasksComponents
   */
  async onCurrentTaskComponentChange(componentId: number, currentTaskId: number): Promise<void> {
    // Проверяем, изменился ли статус задачи на COMPLETED
    const currentTask = await this.currentTasksRepository.findOne({
      where: { id: currentTaskId },
      relations: ['currentTaskStates']
    });

    if (currentTask?.currentTaskStates?.title === 'COMPLETED') {
      await this.recalculateComponentQuantity(componentId);
    }
  }

  /**
   * Обработчик изменения статуса задачи
   */
  async onCurrentTaskStatusChange(currentTaskId: number): Promise<void> {
    // Находим все компоненты в этой задаче
    const taskComponents = await this.currentTasksComponentsRepository.find({
      where: { currentTask: { id: currentTaskId } },
      relations: ['currentTask', 'currentTask.currentTaskStates', 'component']
    });

    const currentTask = taskComponents[0]?.currentTask;

    if (currentTask?.currentTaskStates?.title === 'COMPLETED') {
      // Пересчитываем все компоненты в выполненной задаче
      for (const taskComponent of taskComponents) {
        await this.recalculateComponentQuantity(taskComponent.component.id);
      }
    }
  }

  /**
   * Массовый пересчет всех компонентов для фабрики
   */
  async recalculateAllComponentsForFactory(factoryId: number): Promise<void> {
    try {
      await this.inventarizationBusinessService.recalculateAllComponentsForFactory(factoryId);
      console.log(`Выполнен массовый пересчет всех компонентов для фабрики ${factoryId}`);
    } catch (error) {
      console.error(`Ошибка при массовом пересчете компонентов для фабрики ${factoryId}:`, error.message);
    }
  }
}