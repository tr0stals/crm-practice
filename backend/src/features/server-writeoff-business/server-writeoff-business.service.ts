import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { ServerWriteoff } from 'src/server_writeoff/server_writeoff.entity';
import { Organizations } from 'src/organizations/organizations.entity';

@Injectable()
export class ServerWriteoffBusinessService {
  constructor(
    @InjectRepository(ServerWriteoff)
    private readonly serverWriteoffRepository: Repository<ServerWriteoff>,
  ) {}

  /**
   * Автоматически создает запись в server_writeoff при завершении current_task
   * @param currentTask - завершенная задача со всеми связанными данными
   */
  async createWriteoffFromCurrentTask(currentTask: CurrentTasks): Promise<ServerWriteoff> {
    // Проверяем, что задача завершена
    if (!currentTask.isCompleted) {
      throw new Error('Нельзя создать списание для незавершенной задачи');
    }

    // Получаем компонент из standTasks
    const component = currentTask.standTasks?.components;
    if (!component) {
      throw new Error('У задачи нет связанного компонента');
    }

    // Получаем завод из отгрузки
    const factory = currentTask.shipmentStands?.shipments?.factory;
    if (!factory) {
      throw new Error('У задачи нет связанного завода');
    }

    // Проверяем, что количество компонентов задано
    const componentCount = currentTask.standTasks?.componentOutCount;
    if (!componentCount || componentCount <= 0) {
      throw new Error('Некорректное количество компонентов');
    }

    // Проверяем, что списание еще не создано для этой задачи
    const existingWriteoff = await this.serverWriteoffRepository.findOne({
      where: { currentTasks: { id: currentTask.id } },
    });

    if (existingWriteoff) {
      throw new Error(`Списание для задачи #${currentTask.id} уже существует`);
    }

    // Создаем запись о списании
    const writeoff = this.serverWriteoffRepository.create({
      dateTime: new Date(), // текущая дата
      componentCount: componentCount.toString(), // количество из standTasks
      components: component,
      factory: factory,
      currentTasks: currentTask,
    });

    return await this.serverWriteoffRepository.save(writeoff);
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
      relations: ['components', 'factory', 'currentTasks', 'currentTasks.standTasks', 'currentTasks.shipmentStands', 'currentTasks.shipmentStands.shipments'],
    });
  }
}