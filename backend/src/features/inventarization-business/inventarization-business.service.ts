import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventarization } from 'src/inventarization/inventarization.entity';
import { Components } from 'src/components/components.entity';
import { InvoicesComponents } from 'src/invoices_components/invoices_components.entity';
import { ArrivalInvoices } from 'src/arrival_invoices/arrival_invoices.entity';
import { CurrentTasksComponents } from 'src/current_tasks_components/current_tasks_components.entity';
import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { CurrentTaskStates } from 'src/current_task_states/current_task_states.entity';
import { Writeoff } from 'src/writeoff/writeoff.entity';
import { Organizations } from 'src/organizations/organizations.entity';

export interface ComponentCalculationResult {
  componentId: number;
  component: Components;
  calculatedCount: number;
  calculationDate: Date;
  lastInventarizationCount?: number;
  arrivalCount: number;
  completedTaskCount: number;
  writeoffCount: number;
}

export interface InventarizationCalculationRequest {
  componentIds?: number[];
  factoryId: number;
  calculationDate?: Date;
}

@Injectable()
export class InventarizationBusinessService {
  constructor(
    @InjectRepository(Inventarization)
    private inventarizationRepository: Repository<Inventarization>,

    @InjectRepository(Components)
    private componentsRepository: Repository<Components>,

    @InjectRepository(InvoicesComponents)
    private invoicesComponentsRepository: Repository<InvoicesComponents>,

    @InjectRepository(ArrivalInvoices)
    private arrivalInvoicesRepository: Repository<ArrivalInvoices>,

    @InjectRepository(CurrentTasksComponents)
    private currentTasksComponentsRepository: Repository<CurrentTasksComponents>,

    @InjectRepository(CurrentTasks)
    private currentTasksRepository: Repository<CurrentTasks>,

    @InjectRepository(Writeoff)
    private writeoffRepository: Repository<Writeoff>,
  ) {}

  /**
   * Рассчитывает количество компонентов для инвентаризации
   * Формула: N = inv (последняя инвентаризация) + приход - выполненные задачи - списания
   */
  async calculateComponentCount(
    componentId: number,
    factoryId: number,
    calculationDate: Date = new Date()
  ): Promise<ComponentCalculationResult> {

    const component = await this.componentsRepository.findOne({
      where: { id: componentId }
    });

    if (!component) {
      throw new Error(`Компонент с ID ${componentId} не найден`);
    }

    // 1. Находим последнюю инвентаризацию для этого компонента на фабрике
    const lastInventarization = await this.getLastInventarization(componentId, factoryId, calculationDate);

    // 2. Рассчитываем приход по накладным после последней инвентаризации
    const arrivalCount = await this.calculateArrivalCount(componentId, factoryId, lastInventarization?.inventarizationDate, calculationDate);

    // 3. Рассчитываем расход по выполненным задачам после последней инвентаризации
    const completedTaskCount = await this.calculateCompletedTaskCount(componentId, factoryId, lastInventarization?.inventarizationDate, calculationDate);

    // 4. Рассчитываем ручные списания после последней инвентаризации
    const writeoffCount = await this.calculateWriteoffCount(componentId, factoryId, lastInventarization?.inventarizationDate, calculationDate);

    // 5. Вычисляем итоговое количество
    const baseCount = lastInventarization?.componentCount || 0;
    const calculatedCount = baseCount + arrivalCount - completedTaskCount - writeoffCount;

    return {
      componentId,
      component,
      calculatedCount: Math.max(0, calculatedCount), // Не отрицаем количество
      calculationDate,
      lastInventarizationCount: lastInventarization?.componentCount,
      arrivalCount,
      completedTaskCount,
      writeoffCount,
    };
  }

  /**
   * Массовый расчет количества компонентов
   */
  async calculateMultipleComponents(
    request: InventarizationCalculationRequest
  ): Promise<ComponentCalculationResult[]> {
    const { componentIds, factoryId, calculationDate = new Date() } = request;

    if (!factoryId) {
      throw new Error('factoryId является обязательным параметром');
    }

    // Если компоненты не указаны, берем все компоненты
    const components = componentIds
      ? await this.componentsRepository.findByIds(componentIds)
      : await this.componentsRepository.find();

    const results: ComponentCalculationResult[] = [];

    for (const component of components) {
      try {
        const result = await this.calculateComponentCount(
          component.id,
          factoryId,
          calculationDate
        );
        results.push(result);
      } catch (error) {
        console.error(`Ошибка при расчете компонента ${component.id}: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Создает записи инвентаризации на основе расчета
   */
  async createInventarizationFromCalculation(
    request: InventarizationCalculationRequest & { factoryId: number; quality?: number }
  ): Promise<Inventarization[]> {
    const { factoryId, quality = 100, calculationDate = new Date() } = request;

    const calculationResults = await this.calculateMultipleComponents(request);
    const inventarizations: Inventarization[] = [];

    for (const result of calculationResults) {
      const inventarization = this.inventarizationRepository.create({
        componentCount: result.calculatedCount,
        inventarizationQuality: quality,
        inventarizationDate: calculationDate,
        component: result.component,
        factory: { id: factoryId } as Organizations,
      });

      inventarizations.push(inventarization);
    }

    return await this.inventarizationRepository.save(inventarizations);
  }

  /**
   * Обновляет количество компонента на основе расчета
   */
  async updateComponentQuantity(
    componentId: number,
    factoryId: number,
    calculationDate: Date = new Date()
  ): Promise<Components> {
    const calculationResult = await this.calculateComponentCount(
      componentId,
      factoryId,
      calculationDate
    );

    // Обновляем количество в сущности компонента
    await this.componentsRepository.update(componentId, {
      quantity: calculationResult.calculatedCount
    });

    // Возвращаем обновленный компонент
    const updatedComponent = await this.componentsRepository.findOne({
      where: { id: componentId }
    });

    return updatedComponent!;
  }

  /**
   * Массово обновляет количество компонентов на основе расчета
   */
  async updateMultipleComponentsQuantity(
    request: InventarizationCalculationRequest
  ): Promise<Components[]> {
    const calculationResults = await this.calculateMultipleComponents(request);
    const updatedComponents: Components[] = [];

    for (const result of calculationResults) {
      await this.componentsRepository.update(result.componentId, {
        quantity: result.calculatedCount
      });

      const updatedComponent = await this.componentsRepository.findOne({
        where: { id: result.componentId }
      });

      if (updatedComponent) {
        updatedComponents.push(updatedComponent);
      }
    }

    return updatedComponents;
  }

  /**
   * Пересчитывает и обновляет количество всех компонентов для фабрики
   */
  async recalculateAllComponentsForFactory(
    factoryId: number,
    calculationDate: Date = new Date()
  ): Promise<Components[]> {
    return await this.updateMultipleComponentsQuantity({
      factoryId,
      calculationDate
    });
  }

  /**
   * Находит последнюю инвентаризацию компонента на фабрике до указанной даты
   */
  private async getLastInventarization(
    componentId: number,
    factoryId: number,
    beforeDate: Date
  ): Promise<Inventarization | null> {
    return await this.inventarizationRepository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.component', 'component')
      .leftJoinAndSelect('inv.factory', 'factory')
      .where('component.id = :componentId', { componentId })
      .andWhere('factory.id = :factoryId', { factoryId })
      .andWhere('inv.inventarizationDate < :beforeDate', { beforeDate })
      .orderBy('inv.inventarizationDate', 'DESC')
      .getOne();
  }

  /**
   * Рассчитывает приход компонента по накладным за период
   */
  private async calculateArrivalCount(
    componentId: number,
    factoryId: number,
    fromDate: Date | undefined,
    toDate: Date
  ): Promise<number> {
    const query = this.invoicesComponentsRepository
      .createQueryBuilder('ic')
      .leftJoin('ic.arrivalInvoices', 'invoice')
      .leftJoin('invoice.factory', 'factory')
      .where('ic.components.id = :componentId', { componentId })
      .andWhere('factory.id = :factoryId', { factoryId })
      .andWhere('invoice.date <= :toDate', { toDate });

    if (fromDate) {
      query.andWhere('invoice.date > :fromDate', { fromDate });
    }

    const results = await query.getRawMany();

    return results.reduce((sum, item) => {
      const count = parseInt(item.ic_componentCount) || 0;
      return sum + count;
    }, 0);
  }

  /**
   * Рассчитывает расход компонента по выполненным задачам за период
   */
  private async calculateCompletedTaskCount(
    componentId: number,
    factoryId: number,
    fromDate: Date | undefined,
    toDate: Date
  ): Promise<number> {
    const query = this.currentTasksComponentsRepository
      .createQueryBuilder('ctc')
      .leftJoin('ctc.component', 'component')
      .leftJoin('ctc.currentTask', 'currentTask')
      .leftJoin('currentTask.currentTaskStates', 'state')
      .leftJoin('currentTask.shipmentStands', 'shipmentStand')
      .leftJoin('shipmentStand.shipments', 'shipments')
      .leftJoin('shipments.factory', 'factory')
      .where('component.id = :componentId', { componentId })
      .andWhere('state.title = :completedState', { completedState: 'COMPLETED' })
      .andWhere('factory.id = :factoryId', { factoryId })
      .andWhere('shipments.arrivalDate <= :toDate', { toDate });

    if (fromDate) {
      query.andWhere('shipments.arrivalDate > :fromDate', { fromDate });
    }

    const results = await query.getRawMany();

    return results.reduce((sum, item) => {
      return sum + (item.ctc_componentCount || 0);
    }, 0);
  }

  /**
   * Рассчитывает ручные списания компонента за период
   */
  private async calculateWriteoffCount(
    componentId: number,
    factoryId: number,
    fromDate: Date | undefined,
    toDate: Date
  ): Promise<number> {
    const query = this.writeoffRepository
      .createQueryBuilder('writeoff')
      .leftJoin('writeoff.components', 'component')
      .leftJoin('writeoff.factory', 'factory')
      .where('component.id = :componentId', { componentId })
      .andWhere('factory.id = :factoryId', { factoryId })
      .andWhere('writeoff.dateTime <= :toDate', { toDate });

    if (fromDate) {
      query.andWhere('writeoff.dateTime > :fromDate', { fromDate });
    }

    const results = await query.getRawMany();

    return results.reduce((sum, item) => {
      return sum + (item.writeoff_count || 0);
    }, 0);
  }
}