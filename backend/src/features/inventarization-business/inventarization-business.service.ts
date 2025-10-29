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
import { StandTasksComponents } from 'src/stand_tasks_components/stand_tasks_components.entity';

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
    calculationDate: Date = new Date(),
  ): Promise<ComponentCalculationResult> {
    const component = await this.componentsRepository.findOne({
      where: { id: componentId },
    });

    if (!component) {
      throw new Error(`Компонент с ID ${componentId} не найден`);
    }

    // 1. Находим последнюю инвентаризацию для этого компонента на фабрике
    const lastInventarization = await this.getLastInventarization(
      componentId,
      factoryId,
      calculationDate,
    );

    // 2. Рассчитываем приход по накладным после последней инвентаризации
    const arrivalFromDate = lastInventarization?.inventarizationDate
      ? new Date(lastInventarization.inventarizationDate)
      : undefined;

    const arrivalCount = await this.calculateArrivalCount(
      componentId,
      factoryId,
      arrivalFromDate,
      calculationDate,
    );

    // 3. Рассчитываем расход по выполненным задачам после последней инвентаризации
    const fromDate = lastInventarization?.inventarizationDate
      ? new Date(lastInventarization.inventarizationDate)
      : undefined;

    const completedTaskCount = await this.calculateCompletedTaskCount(
      componentId,
      factoryId,
      fromDate,
      calculationDate,
    );

    // 4. Рассчитываем ручные списания после последней инвентаризации
    const writeoffFromDate = lastInventarization?.inventarizationDate
      ? new Date(lastInventarization.inventarizationDate)
      : undefined;

    const writeoffCount = await this.calculateWriteoffCount(
      componentId,
      factoryId,
      writeoffFromDate,
      calculationDate,
    );

    // 5. Вычисляем итоговое количество
    const baseCount = lastInventarization?.componentCount || 0;
    const calculatedCount =
      baseCount + arrivalCount - completedTaskCount - writeoffCount;

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
    request: InventarizationCalculationRequest,
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
          calculationDate,
        );
        results.push(result);
      } catch (error) {
        console.error(
          `Ошибка при расчете компонента ${component.id}: ${error.message}`,
        );
      }
    }

    return results;
  }

  /**
   * Создает записи инвентаризации на основе расчета
   */
  async createInventarizationFromCalculation(
    request: InventarizationCalculationRequest & {
      factoryId: number;
      quality?: number;
    },
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
    calculationDate: Date = new Date(),
  ): Promise<Components> {
    console.log(`[InventarizationBusiness] Начинаем расчет компонента ${componentId} для фабрики ${factoryId}`);

    const calculationResult = await this.calculateComponentCount(
      componentId,
      factoryId,
      calculationDate,
    );

    console.log(`[InventarizationBusiness] Результат расчета для компонента ${componentId}:`);
    console.log(`  - Базовое количество (последняя инвентаризация): ${calculationResult.lastInventarizationCount || 0}`);
    console.log(`  - Приход: ${calculationResult.arrivalCount}`);
    console.log(`  - Выполненные задачи: ${calculationResult.completedTaskCount}`);
    console.log(`  - Списания: ${calculationResult.writeoffCount}`);
    console.log(`  - Итоговое количество: ${calculationResult.calculatedCount}`);

    // Если инвентаризации нет, создаем первичную
    if (!calculationResult.lastInventarizationCount) {
      console.log(`[InventarizationBusiness] Создаем первичную инвентаризацию для компонента ${componentId}`);

      const component = await this.componentsRepository.findOne({
        where: { id: componentId }
      });

      if (component) {
        // Если у компонента уже есть количество, используем его, иначе 0
        const initialCount = component.quantity || 0;

        const inventarization = this.inventarizationRepository.create({
          componentCount: initialCount,
          inventarizationQuality: 100,
          inventarizationDate: new Date(),
          component: component,
          factory: { id: factoryId } as Organizations,
        });

        await this.inventarizationRepository.save(inventarization);
        console.log(`[InventarizationBusiness] Создана первичная инвентаризация с количеством ${initialCount}`);

        // Пересчитываем заново с учетом созданной инвентаризации
        const newCalculationResult = await this.calculateComponentCount(
          componentId,
          factoryId,
          calculationDate,
        );

        console.log(`[InventarizationBusiness] Пересчет после создания инвентаризации:`);
        console.log(`  - Базовое количество (последняя инвентаризация): ${newCalculationResult.lastInventarizationCount || 0}`);
        console.log(`  - Приход: ${newCalculationResult.arrivalCount}`);
        console.log(`  - Выполненные задачи: ${newCalculationResult.completedTaskCount}`);
        console.log(`  - Списания: ${newCalculationResult.writeoffCount}`);
        console.log(`  - Итоговое количество: ${newCalculationResult.calculatedCount}`);

        calculationResult.calculatedCount = newCalculationResult.calculatedCount;
        calculationResult.lastInventarizationCount = newCalculationResult.lastInventarizationCount;
        calculationResult.arrivalCount = newCalculationResult.arrivalCount;
        calculationResult.completedTaskCount = newCalculationResult.completedTaskCount;
        calculationResult.writeoffCount = newCalculationResult.writeoffCount;
      }
    }

    // Обновляем количество в сущности компонента
    await this.componentsRepository.update(componentId, {
      quantity: calculationResult.calculatedCount,
    });

    console.log(`[InventarizationBusiness] Обновлено количество компонента ${componentId} на ${calculationResult.calculatedCount}`);

    // Возвращаем обновленный компонент
    const updatedComponent = await this.componentsRepository.findOne({
      where: { id: componentId },
    });

    return updatedComponent!;
  }

  /**
   * Массово обновляет количество компонентов на основе расчета
   */
  async updateMultipleComponentsQuantity(
    request: InventarizationCalculationRequest,
  ): Promise<Components[]> {
    const calculationResults = await this.calculateMultipleComponents(request);
    const updatedComponents: Components[] = [];

    for (const result of calculationResults) {
      await this.componentsRepository.update(result.componentId, {
        quantity: result.calculatedCount,
      });

      const updatedComponent = await this.componentsRepository.findOne({
        where: { id: result.componentId },
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
    calculationDate: Date = new Date(),
  ): Promise<Components[]> {
    return await this.updateMultipleComponentsQuantity({
      factoryId,
      calculationDate,
    });
  }

  /**
   * Находит последнюю инвентаризацию компонента на фабрике до указанной даты
   */
  private async getLastInventarization(
    componentId: number,
    factoryId: number,
    beforeDate: Date,
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
    toDate: Date,
  ): Promise<number> {
    console.log(`[InventarizationBusiness] Расчет прихода для компонента ${componentId}, фабрика ${factoryId}`);
    console.log(`[InventarizationBusiness] Период прихода: с ${fromDate ? fromDate.toISOString() : 'начала'} по ${toDate.toISOString()}`);

    const query = this.invoicesComponentsRepository
      .createQueryBuilder('ic')
      .leftJoinAndSelect('ic.arrivalInvoices', 'invoice')
      .leftJoinAndSelect('invoice.factory', 'factory')
      .leftJoinAndSelect('ic.components', 'component')
      .where('component.id = :componentId', { componentId })
      .andWhere('factory.id = :factoryId', { factoryId })
      .andWhere('invoice.date <= :toDate', { toDate });

    if (fromDate) {
      query.andWhere('invoice.date >= :fromDate', { fromDate });
    }

    // console.log(`[InventarizationBusiness] SQL запрос: ${query.getQuery()}`);
    console.log(`[InventarizationBusiness] Параметры: ${JSON.stringify(query.getParameters())}`);

    const results = await query.getRawMany();
    // console.log(`[InventarizationBusiness] Результаты запроса: ${JSON.stringify(results)}`);
    console.log(`[InventarizationBusiness] Найдено записей прихода: ${results.length}`);

    let totalCount = 0;
    for (const item of results) {
      const count = parseInt(item.ic_componentCount) || 0;
      totalCount += count;
      console.log(`  - Приход: кол-во ${count}, дата ${item.invoice_date}, ID ${item.invoice_id}`);
    }

    // Если приход не найден, попробуем найти все arrival_invoices для компонента
    if (results.length === 0) {
      console.log(`[InventarizationBusiness] Приход не найден. Ищем все arrival_invoices для компонента ${componentId}...`);

      // Ищем все arrival_invoices без фильтра по дате
      const allInvoicesQuery = this.arrivalInvoicesRepository
        .createQueryBuilder('ai')
        .leftJoin('ai.factory', 'factory')
        .leftJoin('ai.invoicesComponents', 'ic')
        .leftJoin('ic.components', 'component')
        .where('component.id = :componentId', { componentId })
        .andWhere('factory.id = :factoryId', { factoryId });

      const allInvoices = await allInvoicesQuery.getRawMany();
      console.log(`[InventarizationBusiness] Всего arrival_invoices для компонента: ${allInvoices.length}`);

      for (const invoice of allInvoices) {
        const invoiceDate = new Date(invoice.ai_date);
        const fromDateMs = fromDate ? fromDate.getTime() : 0;
        const toDateMs = toDate.getTime();
        const invoiceDateMs = invoiceDate.getTime();

        const componentCount = invoice.ic_componentCount || invoice.ic_component_count || 0;

        console.log(`  - Invoice: ID ${invoice.ai_id}, кол-во ${componentCount}, дата ${invoice.ai_date}, в периоде: ${fromDateMs <= invoiceDateMs && invoiceDateMs <= toDateMs}`);
        console.log(`    - Полная запись: ${JSON.stringify({
          invoiceId: invoice.ai_id,
          componentCount: componentCount,
          componentId: invoice.ic_components_id || invoice.ic_componentsId || invoice.ic_component_id,
          arrivalInvoicesId: invoice.ic_arrivalInvoices_id || invoice.ic_arrivalInvoicesId || invoice.ic_arrival_invoice_id,
          allFields: Object.keys(invoice)
        })}`);

        if (fromDateMs <= invoiceDateMs && invoiceDateMs <= toDateMs) {
          totalCount += componentCount;
        }
      }

      // Проверяем, есть ли invoices_components вообще
      console.log(`[InventarizationBusiness] Arrival_invoices найдены, проверяем invoices_components...`);

      const allComponentsQuery = this.invoicesComponentsRepository
        .createQueryBuilder('ic')
        .leftJoin('ic.components', 'component')
        .leftJoin('ic.arrivalInvoices', 'invoice')
        .leftJoin('invoice.factory', 'factory')
        .where('component.id = :componentId', { componentId })
        .andWhere('factory.id = :factoryId', { factoryId });

      const allComponents = await allComponentsQuery.getRawMany();
      console.log(`[InventarizationBusiness] Всего invoices_components для компонента: ${allComponents.length}`);

      for (const item of allComponents) {
        console.log(`  - InvoiceComponent: кол-во ${item.ic_componentCount || item.ic_component_count || 0}, invoice ID ${item.ic_arrivalInvoices_id || item.ic_arrival_invoices_id}, дата ${item.invoice_date || 'null'}`);
        console.log(`    - Все поля: ${JSON.stringify(Object.keys(item))}`);
        console.log(`    - Полная запись: ${JSON.stringify(item)}`);
      }

      // Если invoices_components пустые, ищем все invoices_components для arrival_invoices
      if (allComponents.length === 0) {
        console.log(`[InventarizationBusiness] invoices_components для компонента не найдены. Ищем все invoices_components для arrival_invoices...`);

        const invoiceComponentsForArrivalQuery = this.invoicesComponentsRepository
          .createQueryBuilder('ic')
          .leftJoin('ic.arrivalInvoices', 'invoice')
          .leftJoin('invoice.factory', 'factory')
          .where('factory.id = :factoryId', { factoryId });

        const invoiceComponentsForArrival = await invoiceComponentsForArrivalQuery.getRawMany();
        console.log(`[InventarizationBusiness] Всего invoices_components для фабрики: ${invoiceComponentsForArrival.length}`);

        for (const item of invoiceComponentsForArrival) {
          console.log(`  - InvoiceComponent: кол-во ${item.ic_componentCount || item.ic_component_count || 0}, component ID ${item.ic_components_id || item.ic_component_id}, invoice ID ${item.ic_arrivalInvoices_id || item.ic_arrival_invoices_id}`);
        }
      }
    }

    console.log(`[InventarizationBusiness] Общее количество прихода: ${totalCount}`);
    return totalCount;
  }

  /**
   * Рассчитывает расход компонента по выполненным задачам за период
   */
  private async calculateCompletedTaskCount(
    componentId: number,
    factoryId: number,
    fromDate: Date | undefined,
    toDate: Date,
  ): Promise<number> {
    console.log(`[InventarizationBusiness] Расчет выполненных задач для компонента ${componentId}, фабрика ${factoryId}`);
    console.log(`[InventarizationBusiness] Период: с ${fromDate ? fromDate.toISOString() : 'начала'} по ${toDate.toISOString()}`);

    let totalCount = 0;

    // 1. Ищем задачи через CurrentTasksComponents (учитываем задачи без shipments)
    const ctcQuery = this.currentTasksComponentsRepository
      .createQueryBuilder('ctc')
      .leftJoin('ctc.component', 'component')
      .leftJoin('ctc.currentTask', 'currentTask')
      .leftJoin('currentTask.currentTaskStates', 'state')
      .leftJoin('currentTask.shipmentStands', 'shipmentStand')
      .leftJoin('shipmentStand.shipments', 'shipments')
      .leftJoin('shipments.factory', 'factory')
      .where('component.id = :componentId', { componentId })
      .andWhere('(state.title = :completedState1 OR state.title = :completedState2 OR state.id = :completedStateId)', {
        completedState1: 'COMPLETED',
        completedState2: 'Завершена',
        completedStateId: 3,
      })
      .andWhere('(factory.id = :factoryId OR factory.id IS NULL)', { factoryId })
      .andWhere('(shipments.arrivalDate <= :toDate OR shipments.arrivalDate IS NULL)', { toDate });

    if (fromDate) {
      console.log(`[InventarizationBusiness] fromDate: ${fromDate}, тип: ${typeof fromDate}`);
      ctcQuery.andWhere('(shipments.arrivalDate >= :fromDate OR shipments.arrivalDate IS NULL)', { fromDate });
    }

    const ctcResults = await ctcQuery.getRawMany();
    console.log(`[InventarizationBusiness] Найдено задач через CurrentTasksComponents: ${ctcResults.length}`);

    for (const item of ctcResults) {
      const count = item.ctc_componentCount || 0;
      totalCount += count;
      console.log(`  - CTC задача: кол-во ${count}, статус ${item.state_title}, ID ${item.currentTask_id}`);
    }

    // 2. Ищем задачи через StandTasksComponents (основной и дополнительные компоненты)
    // Сначала получаем все StandTasks для компонента
    const standTasksQuery = this.currentTasksRepository
      .createQueryBuilder('ct')
      .leftJoin('ct.standTasks', 'st')
      .leftJoin('st.components', 'mainComponent')
      .leftJoin('ct.currentTaskStates', 'state')
      .leftJoin('ct.shipmentStands', 'shipmentStand')
      .leftJoin('shipmentStand.shipments', 'shipments')
      .leftJoin('shipments.factory', 'factory')
      .where('mainComponent.id = :componentId', { componentId })
      .andWhere('(state.title = :completedState1 OR state.title = :completedState2 OR state.id = :completedStateId)', {
        completedState1: 'COMPLETED',
        completedState2: 'Завершена',
        completedStateId: 3,
      })
      .andWhere('factory.id = :factoryId', { factoryId })
      .andWhere('shipments.arrivalDate <= :toDate', { toDate });

    if (fromDate) {
      standTasksQuery.andWhere('shipments.arrivalDate >= :fromDate', { fromDate });
    }

    const standTasksResults = await standTasksQuery.getRawMany();
    console.log(`[InventarizationBusiness] Найдено задач через StandTasks (основные компоненты): ${standTasksResults.length}`);

    for (const item of standTasksResults) {
      const count = item.st_componentOutCount || 1; // Берем componentOutCount из StandTasks
      totalCount += count;
      console.log(`  - StandTasks задача: кол-во ${count}, статус ${item.state_title}, ID ${item.ct_id}`);
    }

    // 3. Ищем задачи через StandTasksComponents (дополнительные компоненты)
    // Для задач без shipments будем использовать другую логику
    const stcWithoutShipmentsQuery = this.currentTasksRepository
      .createQueryBuilder('ct')
      .leftJoin('ct.standTasks', 'st')
      .leftJoin('st.standTasksComponents', 'stc')
      .leftJoin('stc.component', 'component')
      .leftJoin('ct.currentTaskStates', 'state')
      .where('component.id = :componentId', { componentId })
      .andWhere('(state.title = :completedState1 OR state.title = :completedState2 OR state.id = :completedStateId)', {
        completedState1: 'COMPLETED',
        completedState2: 'Завершена',
        completedStateId: 3,
      });

    const stcWithoutShipmentsResults = await stcWithoutShipmentsQuery.getRawMany();
    console.log(`[InventarizationBusiness] Найдено задач через StandTasksComponents (все): ${stcWithoutShipmentsResults.length}`);

    for (const item of stcWithoutShipmentsResults) {
      const count = item.stc_componentCount || 1;
      totalCount += count;
      console.log(`  - STC задача: кол-во ${count}, статус ${item.state_title || 'undefined'}, ID ${item.ct_id}`);
    }

    console.log(`[InventarizationBusiness] Общее количество выполненных задач: ${totalCount}`);
    return totalCount;
  }

  /**
   * Рассчитывает ручные списания компонента за период
   */
  private async calculateWriteoffCount(
    componentId: number,
    factoryId: number,
    fromDate: Date | undefined,
    toDate: Date,
  ): Promise<number> {
    console.log(`[InventarizationBusiness] Расчет списаний для компонента ${componentId}, фабрика ${factoryId}`);
    console.log(`[InventarizationBusiness] Период списаний: с ${fromDate ? fromDate.toISOString() : 'начала'} по ${toDate.toISOString()}`);

    // Ищем все writeoff для компонента на фабрике
    const writeoffQuery = this.writeoffRepository
      .createQueryBuilder('writeoff')
      .leftJoin('writeoff.components', 'component')
      .leftJoin('writeoff.factory', 'factory')
      .where('component.id = :componentId', { componentId })
      .andWhere('factory.id = :factoryId', { factoryId })
      .andWhere('writeoff.dateTime <= :toDate', { toDate });

    if (fromDate) {
      writeoffQuery.andWhere('writeoff.dateTime >= :fromDate', { fromDate });
    }

    const results = await writeoffQuery.getRawMany();
    console.log(`[InventarizationBusiness] Найдено записей writeoff: ${results.length}`);

    let totalCount = 0;
    for (const item of results) {
      // Пробуем разные варианты имен полей для количества
      const count = item.writeoff_count || item.writeoffCount || item.count || 0;
      totalCount += count;
      console.log(`  - Writeoff: кол-во ${count}, дата ${item.writeoff_dateTime || item.writeoffDateTime || item.dateTime}, ID ${item.writeoff_id || item.writeoffId || item.id}`);
      console.log(`    - Доступные поля: ${JSON.stringify(Object.keys(item))}`);
    }

    // Если записей не найдено, попробуем найти все writeoff для компонента без фильтра по дате
    if (results.length === 0) {
      console.log(`[InventarizationBusiness] Writeoff не найдены в указанном периоде. Ищем все writeoff для компонента...`);

      const allWriteoffQuery = this.writeoffRepository
        .createQueryBuilder('writeoff')
        .leftJoin('writeoff.components', 'component')
        .leftJoin('writeoff.factory', 'factory')
        .where('component.id = :componentId', { componentId })
        .andWhere('factory.id = :factoryId', { factoryId });

      const allResults = await allWriteoffQuery.getRawMany();
      console.log(`[InventarizationBusiness] Всего writeoff для компонента: ${allResults.length}`);

      for (const item of allResults) {
        // Пробуем разные варианты имен полей
        const count = item.writeoff_count || item.writeoffCount || item.count || 0;
        const writeoffDate = new Date(item.writeoff_dateTime || item.writeoffDateTime || item.dateTime);
        const fromDateMs = fromDate ? fromDate.getTime() : 0;
        const toDateMs = toDate.getTime();
        const writeoffDateMs = writeoffDate.getTime();

        console.log(`  - Writeoff: кол-во ${count}, дата ${item.writeoff_dateTime || item.writeoffDateTime || item.dateTime}, в периоде: ${fromDateMs <= writeoffDateMs && writeoffDateMs <= toDateMs}`);
        console.log(`    - Доступные поля: ${JSON.stringify(Object.keys(item))}`);

        if (fromDateMs <= writeoffDateMs && writeoffDateMs <= toDateMs) {
          totalCount += count;
        }
      }
    }

    console.log(`[InventarizationBusiness] Общее количество списаний: ${totalCount}`);
    return totalCount;
  }
}
