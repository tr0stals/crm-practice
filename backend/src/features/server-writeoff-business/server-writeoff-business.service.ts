import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { ServerWriteoff } from 'src/server_writeoff/server_writeoff.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { StandTasksComponents } from 'src/stand_tasks_components/stand_tasks_components.entity';
import { Components } from 'src/components/components.entity';

@Injectable()
export class ServerWriteoffBusinessService {
  constructor(
    @InjectRepository(ServerWriteoff)
    private readonly serverWriteoffRepository: Repository<ServerWriteoff>,

    @InjectRepository(StandTasksComponents)
    private readonly standTasksComponentsRepository: Repository<StandTasksComponents>,
  ) {}

  /**
   * Автоматически создает запись в server_writeoff при завершении current_task
   * @param currentTask - завершенная задача со всеми связанными данными
   */
  async createWriteoffFromCurrentTask(
    currentTask: CurrentTasks,
  ): Promise<ServerWriteoff[]> {
    const targetTask = currentTask?.standTasks;
    const standTasksComponents = await this.standTasksComponentsRepository.find(
      {
        where: {
          standTask: {
            id: currentTask.standTasks?.id,
          },
        },
        relations: ['standTask', 'component'],
      },
    );

    // Проверяем, что задача завершена
    if (!currentTask.isCompleted) {
      throw new Error('Нельзя создать списание для незавершенной задачи');
    }

    // Получаем компонент из standTasks
    // const component = currentTask.standTasks?.components;
    const component = standTasksComponents.map((item) => item.component);

    if (!component.length) {
      throw new Error('У задачи нет связанного компонента');
    }

    // Получаем завод из отгрузки
    const factory = currentTask.shipmentStands?.shipments?.factory;
    if (!factory) {
      throw new Error('У задачи нет связанного завода');
    }

    // Отфильтровываем только те строки, где действительно есть компонент
    // TODO: убрать костыль ` item.componentCount! ` - придумать, как можно сделать правильную проверку на null
    const validComponents = standTasksComponents.filter(
      (item) => item.component && item.componentCount! > 0,
    );

    // Если у задачи вообще нет валидных компонентов → writeoff не нужен
    if (validComponents.length === 0) {
      return []; // или null — как тебе удобнее
    }

    // Проверяем, что количество компонентов задано
    const componentCount = standTasksComponents.map(
      (item) => item.componentCount,
    );

    if (
      validComponents.some(
        (item) => !item.componentCount || item.componentCount <= 0,
      )
    ) {
      throw new Error('Некорректное количество компонентов');
    }

    // Проверяем, что списание еще не создано для этой задачи
    const existingWriteoff = await this.serverWriteoffRepository.findOne({
      where: { currentTasks: { id: currentTask.id } },
    });
    if (existingWriteoff) {
      throw new Error(`Списание для задачи #${currentTask.id} уже существует`);
    }

    const writeoffRecords = validComponents.map((item) =>
      this.serverWriteoffRepository.create({
        dateTime: new Date(),
        componentCount: String(item.componentCount),
        components: item.component,
        factory,
        currentTasks: currentTask,
      }),
    );

    // Дожидаемся выполнения всех запросов
    const saved = await Promise.all(
      writeoffRecords.map((item) => this.serverWriteoffRepository.save(item)),
    );

    return saved;
  }

  /**
   * Проверяет, существует ли списание для задачи
   */
  async hasWriteoffForTask(taskId: number): Promise<boolean> {
    const writeoff = await this.serverWriteoffRepository.findOne({
      where: { currentTasks: { id: taskId } },
    });
    return !!writeoff;
  }

  /**
   * Получает списание по ID задачи
   */
  async getWriteoffByTaskId(taskId: number): Promise<ServerWriteoff | null> {
    return await this.serverWriteoffRepository.findOne({
      where: { currentTasks: { id: taskId } },
      relations: ['components', 'factory', 'currentTasks'],
    });
  }

  /**
   * Получает все списания с связанными данными
   */
  async getAllWriteoffs(): Promise<ServerWriteoff[]> {
    return await this.serverWriteoffRepository.find({
      relations: [
        'components',
        'factory',
        'currentTasks',
        'currentTasks.standTasks',
        'currentTasks.shipmentStands',
        'currentTasks.shipmentStands.shipments',
      ],
    });
  }
}
