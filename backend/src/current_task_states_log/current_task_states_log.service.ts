import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentTaskStatesLog } from './current_task_states_log.entity';

@Injectable()
export class CurrentTaskStatesLogService {
  constructor(
    @InjectRepository(CurrentTaskStatesLog)
    private repo: Repository<CurrentTaskStatesLog>,
  ) {}

  async create(data: Partial<CurrentTaskStatesLog>) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async getAll() {
    const result = await this.repo.find({
      relations: ['currentTask', 'currentTaskState'],
      order: { dateTime: 'DESC' }
    });
    
    return result;
  }

  async getByTaskId(taskId: number) {
    return await this.repo.find({
      where: { currentTask: { id: taskId } },
      relations: ['currentTask', 'currentTaskState'],
      order: { dateTime: 'DESC' }
    });
  }

  async getByStateId(stateId: number) {
    return await this.repo.find({
      where: { currentTaskState: { id: stateId } },
      relations: ['currentTask', 'currentTaskState'],
      order: { dateTime: 'DESC' }
    });
  }

  async getOne(id: number) {
    return await this.repo.findOne({ 
      where: { id },
      relations: ['currentTask', 'currentTaskState']
    });
  }

  async update(id: number, data: Partial<CurrentTaskStatesLog>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }

  async logStateChange(taskId: number, stateId: number) {
    const entity = this.repo.create();
    entity.currentTask = { id: taskId } as any;
    entity.currentTaskState = { id: stateId } as any;
    return await this.repo.save(entity);
  }

  async generateData() {
    try {
      
      const currentTaskStatesLogs = await this.getAll();
      
      const data: any[] = [];

      if (!currentTaskStatesLogs || currentTaskStatesLogs.length === 0) {
        return [];
      }

      for (let i = 0; i < currentTaskStatesLogs.length; i++) {
        const item = currentTaskStatesLogs[i];
        
        const { currentTask, currentTaskState, ...defaultData } = item;
        
        const taskTitle = currentTask?.title || 'Неизвестная задача';
        const stateTitle = currentTaskState?.title || 'Неизвестное состояние';
        
        // Форматируем дату без миллисекунд
        const formattedDateTime = defaultData.dateTime 
          ? new Date(defaultData.dateTime).toLocaleString('ru-RU', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
          : '';

        const { dateTime, ...dataWithoutDateTime } = defaultData;
        const logData = {
          ...dataWithoutDateTime,
          formattedDateTime,
          taskTitle,
          stateTitle,
        };
        
        data.push(logData);
      }

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }
} 