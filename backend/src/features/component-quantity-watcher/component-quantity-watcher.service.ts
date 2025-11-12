import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Components } from 'src/components/components.entity';
import { InvoicesComponents } from 'src/invoices_components/invoices_components.entity';
import { Writeoff } from 'src/writeoff/writeoff.entity';
import { CurrentTasksComponents } from 'src/current_tasks_components/current_tasks_components.entity';
import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { ArrivalInvoices } from 'src/arrival_invoices/arrival_invoices.entity';
import { StandTasksComponents } from 'src/stand_tasks_components/stand_tasks_components.entity';
import { InventarizationBusinessService } from 'src/features/inventarization-business/inventarization-business.service';
import { WsGateway } from 'src/websocket/ws.gateway';

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

    @InjectRepository(StandTasksComponents)
    private standTasksComponentsRepository: Repository<StandTasksComponents>,

    public inventarizationBusinessService: InventarizationBusinessService,
    private wsGateway: WsGateway,
  ) {}

  /**
   * Автоматически пересчитывает количество компонента
   */
  async recalculateComponentQuantity(
    componentId: number,
    factoryId?: number,
  ): Promise<void> {
    console.log(
      `[ComponentQuantityWatcher] Начинаем пересчет компонента ${componentId}, factoryId: ${factoryId || 'не указан'}`,
    );

    try {
      // Если factoryId не указан, пытаемся найти его через последнюю операцию
      if (!factoryId) {
        factoryId = (await this.findComponentFactory(componentId)) || undefined;
        console.log(
          `[ComponentQuantityWatcher] Определен factoryId для компонента ${componentId}: ${factoryId}`,
        );
      }

      if (!factoryId) {
        console.warn(
          `[ComponentQuantityWatcher] Не удалось определить factoryId для компонента ${componentId}`,
        );
        return;
      }

      // Обновляем количество через бизнес-логику
      await this.inventarizationBusinessService.updateComponentQuantity(
        componentId,
        factoryId,
      );

      console.log(
        `[ComponentQuantityWatcher] Автоматически обновлено количество компонента ${componentId} для фабрики ${factoryId}`,
      );
    } catch (error) {
      console.error(
        `[ComponentQuantityWatcher] Ошибка при автоматическом пересчете компонента ${componentId}:`,
        error.message,
      );
      console.error(`[ComponentQuantityWatcher] Stack trace:`, error.stack);
    }
  }

  /**
   * Пытается найти factoryId для компонента по последним операциям
   */
  private async findComponentFactory(
    componentId: number,
  ): Promise<number | null> {
    // Ищем factoryId в последней накладной
    const lastInvoice = await this.invoicesComponentsRepository.findOne({
      where: { components: { id: componentId } },
      relations: ['arrivalInvoices', 'arrivalInvoices.factory'],
      order: { id: 'DESC' },
    });

    if (lastInvoice?.arrivalInvoices?.factory?.id) {
      return lastInvoice.arrivalInvoices.factory.id;
    }

    // Ищем factoryId в последнем списании
    const lastWriteoff = await this.writeoffRepository.findOne({
      where: { components: { id: componentId } },
      relations: ['factory'],
      order: { id: 'DESC' },
    });

    if (lastWriteoff?.factory?.id) {
      return lastWriteoff.factory.id;
    }

    // Ищем factoryId в последней задаче через CurrentTasksComponents
    const lastTaskComponent =
      await this.currentTasksComponentsRepository.findOne({
        where: { component: { id: componentId } },
        relations: [
          'currentTask',
          'currentTask.shipmentStands',
          'currentTask.shipmentStands.shipments',
          'currentTask.shipmentStands.shipments.factory',
        ],
        order: { id: 'DESC' },
      });

    if (
      lastTaskComponent?.currentTask?.shipmentStands?.shipments?.factory?.id
    ) {
      return lastTaskComponent.currentTask.shipmentStands.shipments.factory.id;
    }

    // Ищем factoryId через StandTasksComponents (более простой подход)
    const lastStandTaskComponent =
      await this.standTasksComponentsRepository.findOne({
        where: { component: { id: componentId } },
        relations: ['standTask'],
        order: { id: 'DESC' },
      });

    if (lastStandTaskComponent?.standTask?.id) {
      // Ищем последнюю текущую задачу для этой standTask
      const lastCurrentTask = await this.currentTasksRepository.findOne({
        where: { standTasks: { id: lastStandTaskComponent.standTask.id } },
        relations: [
          'shipmentStands',
          'shipmentStands.shipments',
          'shipmentStands.shipments.factory',
        ],
        order: { id: 'DESC' },
      });

      if (lastCurrentTask?.shipmentStands?.shipments?.factory?.id) {
        return lastCurrentTask.shipmentStands.shipments.factory.id;
      }
    }

    // Ищем в последней инвентаризации
    const lastInventarization = await this.componentsRepository.findOne({
      where: { id: componentId },
      relations: ['inventarizations', 'inventarizations.factory'],
    });

    if (
      lastInventarization?.inventarizations &&
      lastInventarization.inventarizations.length > 0
    ) {
      const sortedInvs = lastInventarization.inventarizations.sort(
        (a, b) =>
          new Date(b.inventarizationDate).getTime() -
          new Date(a.inventarizationDate).getTime(),
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
  async onCurrentTaskComponentChange(
    componentId: number,
    currentTaskId: number,
  ): Promise<void> {
    // Проверяем, изменяется ли задача в статус завершения
    const currentTask = await this.currentTasksRepository.findOne({
      where: { id: currentTaskId },
      relations: ['currentTaskStates'],
    });

    // Пересчитываем компонент, если задача завершена (статус 3 или isCompleted = true)
    if (
      currentTask &&
      (currentTask.isCompleted || currentTask.currentTaskStates?.id === 3)
    ) {
      await this.recalculateComponentQuantity(componentId);
    }
  }

  /**
   * Обработчик изменения статуса задачи
   */
  async onCurrentTaskStatusChange(currentTaskId: number): Promise<void> {
    console.log(
      `[ComponentQuantityWatcher] Обработка изменения статуса задачи ${currentTaskId}`,
    );

    // Сначала получаем информацию о задаче
    const currentTask = await this.currentTasksRepository.findOne({
      where: { id: currentTaskId },
      relations: ['currentTaskStates', 'standTasks', 'standTasks.components'],
    });

    if (!currentTask) {
      console.log(
        `[ComponentQuantityWatcher] Задача ${currentTaskId} не найдена`,
      );
      return;
    }

    console.log(
      `[ComponentQuantityWatcher] Статус задачи: ${currentTask.currentTaskStates?.title}, isCompleted: ${currentTask.isCompleted}, currentStateId: ${currentTask.currentTaskStates?.id}`,
    );

    // Пересчитываем все компоненты, если задача завершена (статус 3 или isCompleted = true)
    if (currentTask.isCompleted || currentTask.currentTaskStates?.id === 3) {
      console.log(
        `[ComponentQuantityWatcher] Задача завершена, начинаем пересчет компонентов`,
      );

      const componentIds = new Set<number>();

      // 1. Ищем компоненты из CurrentTasksComponents
      const taskComponents = await this.currentTasksComponentsRepository.find({
        where: { currentTask: { id: currentTaskId } },
        relations: ['component'],
      });

      console.log(
        `[ComponentQuantityWatcher] Найдено компонентов в CurrentTasksComponents: ${taskComponents.length}`,
      );
      for (const taskComponent of taskComponents) {
        componentIds.add(taskComponent.component.id);
        console.log(
          `[ComponentQuantityWatcher] Найден компонент из CurrentTasksComponents: ${taskComponent.component.id}: ${taskComponent.component.title}`,
        );
      }

      // 2. Проверяем основной компонент из StandTasks
      if (currentTask.standTasks?.components) {
        componentIds.add(currentTask.standTasks.components.id);
        console.log(
          `[ComponentQuantityWatcher] Найден основной компонент из StandTasks: ${currentTask.standTasks.components.id}: ${currentTask.standTasks.components.title}`,
        );
      }

      // 3. Ищем компоненты из StandTasksComponents
      if (currentTask.standTasks?.id) {
        const standTasksComponents = await this.findStandTasksComponents(
          currentTask.standTasks.id,
        );
        console.log(
          `[ComponentQuantityWatcher] Найдено компонентов в StandTasksComponents: ${standTasksComponents.length}`,
        );
        for (const stc of standTasksComponents) {
          if (stc.component) componentIds.add(stc.component.id);
          console.log(
            `[ComponentQuantityWatcher] Найден компонент из StandTasksComponents: ${stc.component?.id}: ${stc.component?.title}`,
          );
        }
      }

      // Пересчитываем все уникальные компоненты
      console.log(
        `[ComponentQuantityWatcher] Всего уникальных компонентов к пересчету: ${componentIds.size}`,
      );
      for (const componentId of componentIds) {
        console.log(
          `[ComponentQuantityWatcher] Пересчитываем компонент ${componentId}`,
        );
        await this.recalculateComponentQuantity(componentId);
      }
    } else {
      console.log(
        `[ComponentQuantityWatcher] Задача не завершена, пересчет не требуется`,
      );
    }
  }

  /**
   * Находит компоненты для задачи стенда
   */
  private async findStandTasksComponents(
    standTaskId: number,
  ): Promise<StandTasksComponents[]> {
    return await this.standTasksComponentsRepository.find({
      where: { standTask: { id: standTaskId } },
      relations: ['component'],
    });
  }

  /**
   * Массовый пересчет всех компонентов для фабрики
   */
  async recalculateAllComponentsForFactory(factoryId: number): Promise<void> {
    try {
      await this.inventarizationBusinessService.recalculateAllComponentsForFactory(
        factoryId,
      );
      console.log(
        `Выполнен массовый пересчет всех компонентов для фабрики ${factoryId}`,
      );
    } catch (error) {
      console.error(
        `Ошибка при массовом пересчете компонентов для фабрики ${factoryId}:`,
        error.message,
      );
    }
  }

  /**
   * Проверяет доступность компонента для операции
   */
  async checkComponentAvailability(
    componentId: number,
    requestedQuantity: number,
    operation: 'writeoff' | 'task_completion' = 'writeoff',
    userId?: string,
    factoryId?: number,
  ): Promise<boolean> {
    try {
      console.log(
        `[ComponentQuantityWatcher] Проверка доступности компонента ${componentId}, кол-во: ${requestedQuantity}, операция: ${operation}`,
      );

      // Если factoryId не указан, определяем его
      if (!factoryId) {
        factoryId = (await this.findComponentFactory(componentId)) || undefined;
      }

      if (!factoryId) {
        console.warn(
          `[ComponentQuantityWatcher] Не удалось определить factoryId для компонента ${componentId}`,
        );
        if (userId) {
          this.wsGateway.sendNotification(
            userId,
            'Не удалось определить фабрику для компонента. Операция отменена.',
            'error',
          );
        }
        return false;
      }

      // Получаем текущее количество через расчет
      const calculationResult =
        await this.inventarizationBusinessService.calculateComponentCount(
          componentId,
          factoryId,
        );

      const availableQuantity = calculationResult.calculatedCount;
      const isAvailable = availableQuantity >= requestedQuantity;

      console.log(
        `[ComponentQuantityWatcher] Результат проверки: доступно ${availableQuantity}, требуется ${requestedQuantity}, операция разрешена: ${isAvailable}`,
      );

      if (!isAvailable) {
        const operationText =
          operation === 'writeoff' ? 'списание' : 'выполнение задачи';
        const message = `Недостаточно компонентов "${calculationResult.component.title}" для ${operationText}. Доступно: ${availableQuantity}, требуется: ${requestedQuantity}. Операция отменена.`;

        console.log(`[ComponentQuantityWatcher] ${message}`);

        // Отправляем уведомление пользователю
        if (userId) {
          this.wsGateway.sendNotification(userId, message, 'error');
        }
      }

      return isAvailable;
    } catch (error) {
      console.error(
        `[ComponentQuantityWatcher] Ошибка при проверке доступности компонента ${componentId}:`,
        error.message,
      );

      // В случае ошибки не разрешаем операцию
      if (userId) {
        this.wsGateway.sendNotification(
          userId,
          'Ошибка при проверке доступности компонентов. Операция отменена.',
          'error',
        );
      }

      return false;
    }
  }

  /**
   * Проверяет доступность компонентов для задачи перед выполнением
   */
  async checkTaskComponentsAvailability(
    taskId: number,
    userId?: string,
  ): Promise<boolean> {
    try {
      console.log(
        `[ComponentQuantityWatcher] Проверка доступности компонентов для задачи ${taskId}`,
      );

      // Получаем информацию о задаче
      const currentTask = await this.currentTasksRepository.findOne({
        where: { id: taskId },
        relations: ['currentTaskStates', 'standTasks', 'standTasks.components'],
      });

      if (!currentTask) {
        console.log(`[ComponentQuantityWatcher] Задача ${taskId} не найдена`);
        return false;
      }

      const componentIds = new Map<number, number>(); // componentId -> requiredCount

      // 1. Ищем компоненты из CurrentTasksComponents
      const taskComponents = await this.currentTasksComponentsRepository.find({
        where: { currentTask: { id: taskId } },
        relations: ['component'],
      });

      for (const taskComponent of taskComponents) {
        componentIds.set(
          taskComponent.component.id,
          taskComponent.componentCount || 1,
        );
        console.log(
          `[ComponentQuantityWatcher] Найден компонент в CurrentTasksComponents: ${taskComponent.component.id} (${taskComponent.component.title}) - ${taskComponent.componentCount || 1} шт`,
        );
      }

      // 2. Добавляем основной компонент из StandTasks
      if (currentTask.standTasks?.components) {
        const mainComponentId = currentTask.standTasks.components.id;
        const mainCount = currentTask.standTasks.componentOutCount || 1;
        componentIds.set(
          mainComponentId,
          (componentIds.get(mainComponentId) || 0) + mainCount,
        );
        console.log(
          `[ComponentQuantityWatcher] Основной компонент: ${mainComponentId} (${currentTask.standTasks.components.title}) - ${mainCount} шт`,
        );
      }

      // 3. Ищем компоненты из StandTasksComponents
      if (currentTask.standTasks?.id) {
        const standTasksComponents = await this.findStandTasksComponents(
          currentTask.standTasks.id,
        );
        for (const stc of standTasksComponents) {
          if (stc.component)
            componentIds.set(
              stc.component.id,
              (componentIds.get(stc.component.id) || 0) +
                (stc.componentCount || 1),
            );
          console.log(
            `[ComponentQuantityWatcher] Дополнительный компонент: ${stc.component?.id} (${stc.component?.title}) - ${stc.componentCount || 1} шт`,
          );
        }
      }

      // Проверяем доступность каждого компонента
      for (const [componentId, requiredCount] of componentIds) {
        const isAvailable = await this.checkComponentAvailability(
          componentId,
          requiredCount,
          'task_completion',
          userId,
        );

        if (!isAvailable) {
          console.log(
            `[ComponentQuantityWatcher] Компонент ${componentId} недоступен, выполнение задачи отменено`,
          );
          return false;
        }
      }

      console.log(
        `[ComponentQuantityWatcher] Все компоненты доступны, выполнение задачи разрешено`,
      );
      return true;
    } catch (error) {
      console.error(
        `[ComponentQuantityWatcher] Ошибка при проверке доступности компонентов задачи ${taskId}:`,
        error.message,
      );

      if (userId) {
        this.wsGateway.sendNotification(
          userId,
          'Ошибка при проверке доступности компонентов для задачи. Операция отменена.',
          'error',
        );
      }

      return false;
    }
  }
}
