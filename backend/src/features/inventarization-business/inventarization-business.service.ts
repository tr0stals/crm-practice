import { Inject, Injectable } from '@nestjs/common';
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
import { ServerWriteoff } from 'src/server_writeoff/server_writeoff.entity';

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

    @InjectRepository(ServerWriteoff)
    private serverWriteoffRepository: Repository<ServerWriteoff>,
  ) {}

  /**
   * Рассчитывает количество компонентов для инвентаризации
   * Формула: N = (фактический приход - задачи - списания - серверные списания)
   * Планируемый приход НЕ учитывается!
   */
  async calculateComponentCount(
    componentId: number,
    factoryId: number,
    calculationDate?: Date,
    standTaskId?: number | null,
  ): Promise<ComponentCalculationResult> {
    const component = await this.componentsRepository.findOne({
      where: { id: componentId },
    });

    if (!component) {
      throw new Error(`Компонент с ID ${componentId} не найден`);
    }

    console.log('Текущий компонент: ', component);
    // 1. Находим последнюю инвентаризацию для этого компонента на фабрике
    const lastInventarization = await this.getLastInventarization(
      componentId,
      factoryId,
    );

    // 2. Рассчитываем ФАКТИЧЕСКИЙ приход (только УЖЕ поступившее на склад)
    // Планируемый приход НЕ учитывается!
    const arrivalCount = await this.calculateArrivalCount(
      componentId,
      factoryId,
      undefined, // Не ограничиваем период, но фильтруем по дате поступления
    );

    // 3. Рассчитываем ОБЩИЙ расход по всем выполненным задачам
    // Без учета дат - все завершенные задачи учитываются
    const completedTaskCount = await this.calculateCompletedTaskCount(
      componentId,
      factoryId,
      undefined, // Не ограничиваем период, берем всё
      standTaskId,
    );

    // 4. Рассчитываем ОБЩИЕ ручные списания
    // Без учета дат - все списания учитываются
    const writeoffCount = await this.calculateWriteoffCount(
      componentId,
      factoryId,
      undefined, // Не ограничиваем период, берем всё
    );

    // const serverWriteoffCount = await this.calculateServerWriteoffCount(
    //   componentId,
    //   factoryId,
    //   undefined, // Не ограничиваем период, берем всё
    // );

    console.log('[!!!!!!INVOICE_COMPONENTS!!!!!!]', arrivalCount);
    console.log('[!!!!!INVOICE_COMPONENTS!!!!!]', completedTaskCount);
    console.log('[!!!!!!!INVOICE_COMPONENTS!!!!!]', writeoffCount);

    // 5. Вычисляем итоговое количество по формуле:
    //    (фактический приход - задачи - списания - серверные списания)
    const calculatedCount = arrivalCount - completedTaskCount - writeoffCount;
    console.log('[TOTAL COMPONENTS COUNT]: ', calculatedCount);

    console.log('LAST INVENTARIZATION: ', lastInventarization);
    return {
      componentId,
      component,
      calculatedCount: Math.max(0, calculatedCount), // Не отрицаем количество
      calculationDate: calculationDate || new Date(),
      lastInventarizationCount: lastInventarization?.componentCount,
      arrivalCount,
      completedTaskCount,
      writeoffCount,
    };
  }

  async calculateServerWriteoffCount(
    componentId: number,
    factoryId: number,
    fromDate: Date | undefined,
  ) {
    const query = this.serverWriteoffRepository
      .createQueryBuilder('serverWriteoff')
      .leftJoin('serverWriteoff.components', 'components')
      .leftJoin('serverWriteoff.factory', 'factory')
      .where('components.id = :componentId', { componentId })
      .andWhere('factory.id = :factoryId', { factoryId });

    const rows = await query.getRawMany();
    console.log('server writeoffs rows!!!!', rows);

    /**
     * Общее количество серверных списаний этого компонента
     */
    let totalCount = 0;

    for (const item of rows) {
      const writeoffCount = Number(item.serverWriteoff_componentCount) || 0;

      totalCount += writeoffCount;
    }

    return totalCount;
  }

  /**
   * Массовый расчет количества компонентов
   */
  async calculateMultipleComponents(
    request: InventarizationCalculationRequest,
  ): Promise<ComponentCalculationResult[]> {
    const { componentIds, factoryId, calculationDate } = request;

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
    standTaskId?: number | null,
    calculationDate?: Date,
  ): Promise<Components> {
    console.log(
      `[InventarizationBusiness] Начинаем расчет компонента ${componentId} для фабрики ${factoryId}`,
    );

    const calculationResult = await this.calculateComponentCount(
      componentId,
      factoryId,
      calculationDate,
      standTaskId,
    );

    console.log(
      `[InventarizationBusiness] Результат расчета для компонента ${componentId}:`,
    );
    console.log(
      `  - Базовое количество (последняя инвентаризация): ${calculationResult.lastInventarizationCount || 0}`,
    );
    console.log(`  - Приход: ${calculationResult.arrivalCount}`);
    console.log(
      `  - Выполненные задачи: ${calculationResult.completedTaskCount}`,
    );
    console.log(`  - Списания: ${calculationResult.writeoffCount}`);
    console.log(
      `  - Итоговое количество: ${calculationResult.calculatedCount}`,
    );

    // Создаем или обновляем инвентаризацию с рассчитанным количеством
    if (calculationResult.lastInventarizationCount) {
      console.log(
        `[InventarizationBusiness] Обновляем существующую инвентаризацию с количества ${calculationResult.lastInventarizationCount} на ${calculationResult.calculatedCount}`,
      );

      // Находим последнюю инвентаризацию и обновляем её
      const lastInventarization = await this.getLastInventarization(
        componentId,
        factoryId,
      );
      if (lastInventarization) {
        await this.inventarizationRepository.update(lastInventarization.id, {
          componentCount: calculationResult.calculatedCount,
          inventarizationDate: new Date(),
        });
        console.log(
          `[InventarizationBusiness] Инвентаризация #${lastInventarization.id} обновлена на количество ${calculationResult.calculatedCount}`,
        );
      }
    } else {
      console.log(
        `[InventarizationBusiness] Создаем первичную инвентаризацию для компонента ${componentId} с количеством ${calculationResult.calculatedCount}`,
      );

      const component = await this.componentsRepository.findOne({
        where: { id: componentId },
      });

      if (component) {
        const inventarization = this.inventarizationRepository.create({
          componentCount: calculationResult.calculatedCount,
          inventarizationQuality: 100,
          inventarizationDate: new Date(),
          component: component,
          factory: { id: factoryId } as Organizations,
        });

        await this.inventarizationRepository.save(inventarization);
        console.log(
          `[InventarizationBusiness] Создана первичная инвентаризация с количеством ${calculationResult.calculatedCount}`,
        );
      }
    }

    console.log(
      `[CHECKPOINT HONDA ACCORD]: ${calculationResult.calculatedCount}`,
    );
    // Обновляем количество в сущности компонента
    await this.componentsRepository.update(componentId, {
      quantity: calculationResult.calculatedCount,
    });

    console.log(
      `[InventarizationBusiness] Обновлено количество компонента ${componentId} на ${calculationResult.calculatedCount}`,
    );

    // Возвращаем обновленный компонент
    const updatedComponent = await this.componentsRepository.findOne({
      where: { id: componentId },
    });

    if (!updatedComponent) {
      throw new Error(
        `[UPDATEDCOMPONENTERROR] Component with ID ${componentId} not found`,
      );
    }

    return updatedComponent;
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
   * Создает или обновляет запись инвентаризации для компонента
   */
  async createOrUpdateInventarization(
    componentId: number,
    factoryId: number,
    quality: number = 100,
    calculationDate?: Date,
  ): Promise<Inventarization> {
    console.log(
      `[InventarizationBusiness] Создание/обновление инвентаризации для компонента ${componentId}, фабрика ${factoryId}`,
    );

    // Рассчитываем текущее количество компонента
    const calculationResult = await this.calculateComponentCount(
      componentId,
      factoryId,
      calculationDate,
    );

    // Ищем существующую инвентаризацию для этого компонента на фабрике
    const existingInventarization = await this.inventarizationRepository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.component', 'component')
      .leftJoinAndSelect('inv.factory', 'factory')
      .where('component.id = :componentId', { componentId })
      .andWhere('factory.id = :factoryId', { factoryId })
      .orderBy('inv.inventarizationDate', 'DESC')
      .getOne();

    if (existingInventarization) {
      // Обновляем существующую запись
      console.log(
        `[InventarizationBusiness] Найдена существующая инвентаризация #${existingInventarization.id}, обновляем количество с ${existingInventarization.componentCount} на ${calculationResult.calculatedCount}`,
      );

      await this.inventarizationRepository.update(existingInventarization.id, {
        componentCount: calculationResult.calculatedCount,
        inventarizationQuality: quality,
        inventarizationDate: calculationDate || new Date(),
      });

      // Возвращаем обновленную запись
      const updatedInventarization =
        await this.inventarizationRepository.findOne({
          where: { id: existingInventarization.id },
          relations: ['component', 'factory'],
        });

      console.log(
        `[InventarizationBusiness] Инвентаризация #${existingInventarization.id} обновлена`,
      );
      return updatedInventarization!;
    } else {
      // Создаем новую запись
      console.log(
        `[InventarizationBusiness] Создаем новую инвентаризацию с количеством ${calculationResult.calculatedCount}`,
      );

      const component = await this.componentsRepository.findOne({
        where: { id: componentId },
      });

      if (!component) {
        throw new Error(`Компонент с ID ${componentId} не найден`);
      }

      const newInventarization = this.inventarizationRepository.create({
        componentCount: calculationResult.calculatedCount,
        inventarizationQuality: quality,
        inventarizationDate: calculationDate || new Date(),
        component: component,
        factory: { id: factoryId } as Organizations,
      });

      const savedInventarization =
        await this.inventarizationRepository.save(newInventarization);
      console.log(
        `[InventarizationBusiness] Создана новая инвентаризация #${savedInventarization.id}`,
      );

      return savedInventarization;
    }
  }

  /**
   * Пересчитывает и обновляет количество всех компонентов для фабрики
   */
  async recalculateAllComponentsForFactory(
    factoryId: number,
    calculationDate?: Date,
  ): Promise<Components[]> {
    return await this.updateMultipleComponentsQuantity({
      factoryId,
      calculationDate,
    });
  }

  /**
   * Находит последнюю инвентаризацию компонента на фабрике
   */
  public async getLastInventarization(
    componentId: number,
    factoryId: number,
  ): Promise<Inventarization | null> {
    return await this.inventarizationRepository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.component', 'component')
      .leftJoinAndSelect('inv.factory', 'factory')
      .where('component.id = :componentId', { componentId })
      .andWhere('factory.id = :factoryId', { factoryId })
      .orderBy('inv.inventarizationDate', 'DESC')
      .getOne();
  }

  /**
   * Рассчитывает приход компонента по накладным
   * Учитываются все компоненты - и поступившие на склад, и планируемые
   */
  private async calculateArrivalCount(
    componentId: number,
    factoryId: number,
    fromDate: Date | undefined,
  ): Promise<number> {
    console.log(
      `[InventarizationBusiness] Расчет ФАКТИЧЕСКОГО прихода для компонента ${componentId}, фабрика ${factoryId}`,
    );

    // Учитываем ТОЛЬКО то, что УЖЕ поступило на склад
    const today = new Date();
    const query = this.invoicesComponentsRepository
      .createQueryBuilder('ic')
      .leftJoinAndSelect('ic.arrivalInvoices', 'invoice')
      .leftJoinAndSelect('invoice.factory', 'factory')
      .leftJoinAndSelect('ic.components', 'component')
      .where('component.id = :componentId', { componentId })
      .andWhere('factory.id = :factoryId', { factoryId })
      .andWhere('invoice.dateTimeToWarehouse <= :today', { today }); // ТОЛЬКО УЖЕ ПОСТУПИВШЕЕ

    console.log(
      `[InventarizationBusiness] Параметры: ${JSON.stringify(query.getParameters())}`,
    );

    const results = await query.getRawMany();
    console.log(
      `[InventarizationBusiness] Найдено записей прихода: ${results.length}`,
    );

    let totalCount = 0;
    for (const item of results) {
      const count = parseInt(item.ic_componentCount) || 0;
      totalCount += count;
      const arrivalDate = item.invoice_dateTimeToWarehouse
        ? new Date(item.invoice_dateTimeToWarehouse).toISOString().split('T')[0]
        : 'не указана';
      console.log(
        `  - Фактический приход: кол-во ${count}, дата поступления ${arrivalDate}, ID ${item.invoice_id}`,
      );
    }

    console.log(
      `[InventarizationBusiness] Общее количество ФАКТИЧЕСКОГО прихода: ${totalCount}`,
    );
    return totalCount;
  }

  /**
   * Считает расход компонента по завершённым задачам
   * На основе StandTasksComponents
   */
  private async calculateCompletedTaskCount(
    componentId: number,
    factoryId: number,
    fromDate?: Date,
    standTaskId?: number | null,
  ): Promise<number> {
    console.log(
      `[InventarizationBusiness] Расчет выполненных задач для компонента ${componentId}, фабрика ${factoryId}`,
    );

    const query = this.currentTasksRepository
      .createQueryBuilder('ct')
      .leftJoin('ct.currentTaskStates', 'state')
      .leftJoin('ct.standTasks', 'st')
      .leftJoin('st.standTasksComponents', 'stc')
      .leftJoin('stc.component', 'component')
      .leftJoin('ct.shipmentStands', 'shipmentStand')
      .leftJoin('shipmentStand.shipments', 'shipments')
      .leftJoin('shipments.factory', 'factory')
      .where('component.id = :componentId', { componentId })
      .andWhere(
        '(state.title = :completedState1 OR state.title = :completedState2 OR state.id = :completedStateId)',
        {
          completedState1: 'COMPLETED',
          completedState2: 'Завершена',
          completedStateId: 3,
        },
      )
      .andWhere('factory.id = :factoryId OR factory.id IS NULL', { factoryId })
      .select([
        'ct.id AS ct_id',
        'st.id AS st_id',
        'stc.id AS stc_id',
        'stc.componentCount AS stc_componentCount',
        'component.id AS component_id',
        'state.id AS state_id',
      ]);

    if (standTaskId) {
      query.andWhere('st.id = :standTaskId', { standTaskId });
    }

    if (fromDate) {
      query.andWhere('ct.updatedAt >= :fromDate', { fromDate });
    }

    const rows = await query.getRawMany();

    console.log(
      `[InventarizationBusiness] Найдено StandTasksComponents строк: ${rows.length}`,
    );

    let total = 0;

    for (const r of rows) {
      console.log('=-============');
      console.log('R Value', r);
      const count = r.stc_componentCount || 0;
      total += count;

      console.log(
        ` - STC: standTask=${r.st_id}, ct=${r.ct_id}, count=${count}, status=${r.state_id}`,
      );
      console.log('=-============');
    }

    console.log(
      `[InventarizationBusiness] Общее количество использованных компонентов: ${total}`,
    );

    return total;
  }

  /**
   * Рассчитывает ручные списания компонента
   * Без учета дат - все списания учитываются
   */
  private async calculateWriteoffCount(
    componentId: number,
    factoryId: number,
    fromDate: Date | undefined,
  ): Promise<number> {
    console.log(
      `[InventarizationBusiness] Расчет ОБЩИХ списаний для компонента ${componentId}, фабрика ${factoryId}`,
    );

    // Ищем все writeoff для компонента на фабрике
    const writeoffQuery = this.writeoffRepository
      .createQueryBuilder('writeoff')
      .leftJoin('writeoff.components', 'component')
      .leftJoin('writeoff.factory', 'factory')
      .where('component.id = :componentId', { componentId })
      .andWhere('factory.id = :factoryId', { factoryId });

    const results = await writeoffQuery.getRawMany();
    console.log(
      `[InventarizationBusiness] Найдено записей writeoff: ${results.length}`,
    );

    let totalCount = 0;
    for (const item of results) {
      // Пробуем разные варианты имен полей для количества
      const count =
        item.writeoff_count || item.writeoffCount || item.count || 0;
      totalCount += count;
      console.log(
        `  - Writeoff: кол-во ${count}, дата ${item.writeoff_dateTime || item.writeoffDateTime || item.dateTime}, ID ${item.writeoff_id || item.writeoffId || item.id}`,
      );
    }

    console.log(
      `[InventarizationBusiness] Общее количество списаний: ${totalCount}`,
    );
    return totalCount;
  }
}
